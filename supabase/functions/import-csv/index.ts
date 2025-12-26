import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportResult {
  table: string;
  success: number;
  failed: number;
  errors: string[];
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(csvContent: string): { headers: string[]; rows: string[][] } {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1).map(line => parseCSVLine(line));
  
  return { headers, rows };
}

function parseDate(dateStr: string | null): string | null {
  if (!dateStr || dateStr === 'NULL' || dateStr.trim() === '') return null;
  
  // Handle various date formats
  const formats = [
    /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/, // DD-MM-YYYY HH:mm
    /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
    /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)$/, // MM/DD/YYYY HH:mm:ss AM/PM
  ];
  
  try {
    // DD-MM-YYYY HH:mm format
    let match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/);
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}:00`;
    }
    
    // DD-MM-YYYY format
    match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    }
    
    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      return dateStr;
    }
    
    return null;
  } catch {
    return null;
  }
}

function cleanValue(val: string): string | null {
  if (val === 'NULL' || val === '' || val === 'undefined') return null;
  return val;
}

function parseBool(val: string): boolean {
  return val === '1' || val.toLowerCase() === 'yes' || val.toLowerCase() === 'true';
}

function parseNumber(val: string): number | null {
  if (!val || val === 'NULL' || val === '') return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

function parseInt2(val: string): number | null {
  if (!val || val === 'NULL' || val === '') return null;
  const num = parseInt(val, 10);
  return isNaN(num) ? null : num;
}

function mapLeadStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'not-purchased': 'not-purchased',
    'purchased': 'purchased',
    'active': 'active',
    'converted': 'converted',
    'lost': 'lost',
    'follow-up': 'follow-up',
    'contacted': 'contacted',
    'new': 'new',
  };
  return statusMap[status?.toLowerCase()] || 'new';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { table, csvContent, batchSize = 500 } = await req.json();

    if (!table || !csvContent) {
      return new Response(
        JSON.stringify({ error: 'Missing table or csvContent' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting import for table: ${table}`);
    const { headers, rows } = parseCSV(csvContent);
    console.log(`Parsed ${rows.length} rows with headers:`, headers);

    const results: ImportResult = {
      table,
      success: 0,
      failed: 0,
      errors: [],
    };

    // Process in batches
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const records: Record<string, any>[] = [];

      for (const row of batch) {
        try {
          const record = mapRowToRecord(table, headers, row);
          if (record) records.push(record);
        } catch (err) {
          results.failed++;
          if (results.errors.length < 10) {
            results.errors.push(`Row ${i}: ${err instanceof Error ? err.message : String(err)}`);
          }
        }
      }

      if (records.length > 0) {
        // Team Users is often re-imported; ignore duplicates by legacy_id so existing rows don't fail the whole batch.
        const shouldIgnoreDuplicates = table === 'team_users';

        const { data, error } = shouldIgnoreDuplicates
          ? await supabase
              .from(table)
              .upsert(records, { onConflict: 'legacy_id', ignoreDuplicates: true })
              .select('legacy_id')
          : await supabase.from(table).insert(records);

        if (error) {
          console.error(`Batch insert error:`, error);
          results.failed += records.length;
          if (results.errors.length < 10) {
            results.errors.push(`Batch ${Math.floor(i / batchSize)}: ${error.message}`);
          }
        } else {
          // When ignoring duplicates, the returned rows (if any) represent the records actually inserted.
          results.success += shouldIgnoreDuplicates ? (data?.length ?? 0) : records.length;
        }
      }

      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(rows.length / batchSize)}`);
    }

    console.log(`Import complete:`, results);

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function mapRowToRecord(table: string, headers: string[], row: string[]): Record<string, any> | null {
  const getValue = (name: string): string => {
    const idx = headers.indexOf(name);
    return idx >= 0 ? row[idx] || '' : '';
  };

  switch (table) {
    case 'team_users':
      return {
        legacy_id: parseInt2(getValue('id')),
        name: cleanValue(getValue('name')) || 'Unknown',
        username: cleanValue(getValue('username')) || `user_${getValue('id')}`,
        email: cleanValue(getValue('email')) || `user_${getValue('id')}@placeholder.com`,
        mobile: cleanValue(getValue('mobile')),
        discount: parseInt2(getValue('discount')) || 0,
        thru_register: cleanValue(getValue('thru_register')),
        email_verified_at: parseDate(getValue('email_verified_at')),
        password_hash: cleanValue(getValue('password')),
      };

    case 'planners':
      return {
        legacy_id: parseInt2(getValue('id')),
        name: cleanValue(getValue('name')) || 'Unknown',
        username: cleanValue(getValue('username')),
        email: cleanValue(getValue('email')),
        mobile: cleanValue(getValue('mobile')),
        api_token: cleanValue(getValue('api_token')),
        android_token: cleanValue(getValue('android_token')),
        iphone_token: cleanValue(getValue('iphone_token')),
        account_number: cleanValue(getValue('account_number')),
        bank_name: cleanValue(getValue('bank_name')),
        ifsc: cleanValue(getValue('ifsc')),
        branch_name: cleanValue(getValue('branch_name')),
        terms_conditions: cleanValue(getValue('terms_conditions')),
        image: cleanValue(getValue('image')),
        about: cleanValue(getValue('about')),
        business_name: cleanValue(getValue('business_name')),
        address1: cleanValue(getValue('address1')),
        address2: cleanValue(getValue('address2')),
        area_name: cleanValue(getValue('area_name')),
        city: cleanValue(getValue('city')),
        specialization: cleanValue(getValue('specialization')),
        gst_number: cleanValue(getValue('gstnumber')),
        pan_number: cleanValue(getValue('pannumber')),
        company_website: cleanValue(getValue('compweb')),
        business_years: parseInt2(getValue('business_years')) || 0,
        completed_events: parseInt2(getValue('completed_events')) || 0,
        company_logo: cleanValue(getValue('company_logo')),
        company_gst_image: cleanValue(getValue('company_gst_image')),
        company_pancard_image: cleanValue(getValue('company_pancard_image')),
        is_active: parseBool(getValue('is_active')),
        th_code: cleanValue(getValue('thcode')),
        gst: cleanValue(getValue('gst')),
        ipm_amount: parseNumber(getValue('ipm_amount')),
        ipm_date: parseDate(getValue('ipm_date')),
        wallet_amount: parseNumber(getValue('wallet_amount')),
        last_wallet_date: parseDate(getValue('last_wallet_date')),
        last_purchased: parseDate(getValue('last_purchased')),
        remarks: cleanValue(getValue('remarks')),
        last_login: parseDate(getValue('last_login')),
        managed_by_role: cleanValue(getValue('manageby_pawrole')),
        is_partner: parseBool(getValue('is_partner')),
        is_admin: parseBool(getValue('is_admin')),
        invoice_business_name: cleanValue(getValue('inovice_business_name')),
        invoice_address: cleanValue(getValue('invoice_address')),
        invoice_address2: cleanValue(getValue('invoice_address2')),
        invoice_address3: cleanValue(getValue('invoice_address3')),
        invoice_city: cleanValue(getValue('invoice_city')),
        invoice_gstin: cleanValue(getValue('invoice_gstin')),
        invoice_gst: cleanValue(getValue('invoice_gst')),
        registered_from: cleanValue(getValue('registered_froms')),
        register_time: parseDate(getValue('register_time')),
        latest_logged_in: parseDate(getValue('latest_logged_in')),
        delete_account: parseBool(getValue('delete_account')),
        user_state_capital: cleanValue(getValue('userstatecapital')),
        user_state: cleanValue(getValue('userstate')),
        chk_subscription: parseBool(getValue('chk_subscription')),
        subscribed_tenure: cleanValue(getValue('subscribed_tenure')),
        subscribed_on: parseDate(getValue('subscribed_on')),
        user_lead_state_name: cleanValue(getValue('user_lead_state_name')),
      };

    case 'general_leads':
      const status = cleanValue(getValue('status'));
      return {
        legacy_id: parseInt2(getValue('id')),
        custom_lead_id: cleanValue(getValue('custom_lead_id')),
        name: cleanValue(getValue('name')),
        email: cleanValue(getValue('email')),
        mobile: cleanValue(getValue('mobile')),
        executive_name: cleanValue(getValue('executive_name')),
        lead_time: parseDate(getValue('lead_time')),
        wedding_date_fixed: cleanValue(getValue('wedding_datefixed')),
        event_date: parseDate(getValue('event_date')),
        approx_wedding: cleanValue(getValue('approx_wedding')),
        expiry_date: parseDate(getValue('expiry_date')),
        package_type: cleanValue(getValue('package_type')),
        event_category: cleanValue(getValue('event_category')),
        lead_type: cleanValue(getValue('lead_type')),
        status: status ? mapLeadStatus(status) : 'not-purchased',
        lead_audio: cleanValue(getValue('lead_audio')),
        lead_description: cleanValue(getValue('lead_description')),
        price: parseNumber(getValue('price')),
        payment_initiated: parseBool(getValue('payment_initiated')),
        city: cleanValue(getValue('city')),
        state_id: parseInt2(getValue('state_id')),
        state_name: cleanValue(getValue('state_name')),
        state_capital: cleanValue(getValue('state_capital')),
        event_location: cleanValue(getValue('event_location')),
        purchase_allowed: parseBool(getValue('purchase_allowed')),
        wedding_type: cleanValue(getValue('wedding_type')),
        address: cleanValue(getValue('address')),
        connected_by: cleanValue(getValue('connected_by')),
        followup: cleanValue(getValue('followup')),
        follow_done: cleanValue(getValue('follow_done')),
        team_remarks: cleanValue(getValue('team_remarks')),
        sms_city: cleanValue(getValue('smscity')),
        sms_category1: cleanValue(getValue('smscategory1')),
        sms_category2: cleanValue(getValue('smscategory2')),
        mute: parseBool(getValue('mute')),
        lead_remarks: cleanValue(getValue('leadremarks')),
        lead_status_text: cleanValue(getValue('lead_status')),
        buyleads_category_type: cleanValue(getValue('buyleads_category_type')),
        leads_link: cleanValue(getValue('leads_link')),
        lead_source: cleanValue(getValue('lead_source')),
        leadsource: cleanValue(getValue('leadsource')),
      };

    case 'custom_buyleads':
      const buyStatus = cleanValue(getValue('buyleads_status'));
      return {
        legacy_id: parseInt2(getValue('id')),
        customer_name: cleanValue(getValue('customer_name')),
        customer_email: cleanValue(getValue('customer_email')),
        customer_mobile: cleanValue(getValue('customer_mobile')),
        wedding_list_items: cleanValue(getValue('weddinglist_items')),
        wedding_decoration_sublist_items: cleanValue(getValue('weddingdecoration_sublist_items')),
        complete_wedding_budget: cleanValue(getValue('complete_weddingbudget')),
        complete_guest_number: cleanValue(getValue('complete_guestnumber')),
        city: cleanValue(getValue('city')),
        location: cleanValue(getValue('location')),
        venue_fixed: cleanValue(getValue('venue_fixed')),
        venue_name: cleanValue(getValue('venuename')),
        venue_allow_outside_vendors: cleanValue(getValue('venue_allow_outsidevendors')),
        venue_detail: cleanValue(getValue('venuedetail')),
        wedding_date_fixed: cleanValue(getValue('weddingdate_fixed')),
        wedding_date: parseDate(getValue('wedding_date')),
        wedding_approx_period: cleanValue(getValue('wedding_approx_period')),
        buy_leads_description: cleanValue(getValue('buy_leads_description')),
        buyleads_package_type: cleanValue(getValue('buyleads_package_type')),
        buyleads_purchase_allowed: parseBool(getValue('buyleads_purchase_allowed')),
        buyleads_status: buyStatus ? mapLeadStatus(buyStatus) : 'not-purchased',
        buyleads_city: cleanValue(getValue('buyleads_city')),
        state_id: parseInt2(getValue('state_id')),
        state_name: cleanValue(getValue('state_name')),
        state_capital: cleanValue(getValue('state_capital')),
        buyleads_event_category: cleanValue(getValue('buyleads_event_category')),
        buyleads_type: cleanValue(getValue('buyleads_type')),
        meeting_lead_type: cleanValue(getValue('meeting_leadtype')),
        meeting_address: cleanValue(getValue('meetingaddress')),
        buyleads_price: cleanValue(getValue('buyleads_price')),
        buyleads_amount: parseNumber(getValue('buyleads_amount')),
        buyleads_executive_name: cleanValue(getValue('buyleads_executive_name')),
        buyleads_lead_date: parseDate(getValue('buyleads_lead_date')),
        buyleads_expiry_date: parseDate(getValue('buyleads_expiry_date')),
        wedding_type: cleanValue(getValue('wedding_type')),
        move_to_leads: parseBool(getValue('move_toleads')),
        lead_remarks: cleanValue(getValue('leadremarks')),
        followup: cleanValue(getValue('followup')),
        follow_done: cleanValue(getValue('follow_done')),
        connected_by: cleanValue(getValue('connected_by')),
        lead_status_text: cleanValue(getValue('lead_status')),
        followup_count: parseInt2(getValue('followup_count')) || 0,
      };

    case 'chat_leadform':
      return {
        legacy_id: parseInt2(getValue('id')),
        enquiry_for: cleanValue(getValue('enquiryfor')),
        role_name: cleanValue(getValue('role_name')),
        name: cleanValue(getValue('name')),
        email: cleanValue(getValue('email')),
        mobile: cleanValue(getValue('mobile')),
        city: cleanValue(getValue('city')),
        remarks: cleanValue(getValue('remarks')),
        source_from: cleanValue(getValue('source_from')),
        website_from: cleanValue(getValue('website_from')),
        connected_by: cleanValue(getValue('connected_by')),
        followup: cleanValue(getValue('followup')),
        follow_done: cleanValue(getValue('follow_done')),
        lead_status: cleanValue(getValue('lead_status')),
        followup_count: parseInt2(getValue('followup_count')) || 0,
        wedding_date: parseDate(getValue('wedding_date')),
        otp_list: cleanValue(getValue('otp_list')),
        enquired_time: parseDate(getValue('enquired_time')),
        website_source: cleanValue(getValue('websitie_source')),
        wedding_fixed: cleanValue(getValue('wedding_fixed')),
        approx_wedding: cleanValue(getValue('approx_wedding')),
      };

    case 'general_leads_buy':
      const glbStatus = cleanValue(getValue('status'));
      return {
        legacy_id: parseInt2(getValue('id')),
        general_leads_legacy_id: parseInt2(getValue('general_leads_id')),
        user_legacy_id: parseInt2(getValue('user_id')),
        status: glbStatus ? mapLeadStatus(glbStatus) : 'purchased',
      };

    case 'client_subscriptions':
      return {
        legacy_id: parseInt2(getValue('id')),
        client_legacy_id: parseInt2(getValue('client_id')),
        subscription_amount: cleanValue(getValue('subscription_amount')),
        subscription_type: cleanValue(getValue('subscription_type')),
        subscription_date: parseDate(getValue('subscription_date')),
        actual_subscription_date: parseDate(getValue('actual_subscription_date')),
        subscription_tenure: cleanValue(getValue('subscription_tenure')),
        subscription_exist: parseBool(getValue('subscription_exist')),
        subscription_closed: getValue('subscription_closed') === 'yes',
        remaining_days: parseInt2(getValue('remaining_days')),
        remaining_month: parseInt2(getValue('remaining_month')),
        actual_subscription_start_date: parseDate(getValue('actual_subscription_start_date')),
        actual_subscription_end_date: parseDate(getValue('actual_subscription_end_date')),
        subscription_closed_on: parseDate(getValue('subscription_closed_on')),
        subscribed_month: cleanValue(getValue('subscribed_month')),
      };

    case 'planner_subscriptions':
      return {
        legacy_id: parseInt2(getValue('id')),
        user_legacy_id: parseInt2(getValue('user_id')),
        team_legacy_id: parseInt2(getValue('team_id')),
        subscription_amount: parseNumber(getValue('subscriptoin_amount')),
        subscription_type: cleanValue(getValue('subscription_type')),
        subscription_date: parseDate(getValue('subscription_date')),
        actual_subscription_date: parseDate(getValue('actual_subscription_date')),
        actual_subscription_end_date: parseDate(getValue('actual_subscription_end_date')),
        subscription_tenure: cleanValue(getValue('subscription_tenure')),
        subscribed_month: cleanValue(getValue('subscribed_month')),
        remaining_days: parseInt2(getValue('remaining_days')),
        actual_remaining_days_counter: parseInt2(getValue('actual_remaining_days_counter')),
        remaining_month: parseInt2(getValue('remaining_month')),
        subscription_closed_on: parseDate(getValue('subscription_closed_on')),
      };

    case 'app_links':
      return {
        legacy_id: parseInt2(getValue('id')),
        name: cleanValue(getValue('name')),
        mobile: cleanValue(getValue('mobile')),
        type_request: cleanValue(getValue('type_request')),
        enquired_time: parseDate(getValue('enquired_time')),
      };

    default:
      return null;
  }
}
