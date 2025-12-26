export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_links: {
        Row: {
          created_at: string | null
          enquired_time: string | null
          id: string
          legacy_id: number | null
          mobile: string | null
          name: string | null
          type_request: string | null
        }
        Insert: {
          created_at?: string | null
          enquired_time?: string | null
          id?: string
          legacy_id?: number | null
          mobile?: string | null
          name?: string | null
          type_request?: string | null
        }
        Update: {
          created_at?: string | null
          enquired_time?: string | null
          id?: string
          legacy_id?: number | null
          mobile?: string | null
          name?: string | null
          type_request?: string | null
        }
        Relationships: []
      }
      chat_leadform: {
        Row: {
          approx_wedding: string | null
          city: string | null
          connected_by: string | null
          created_at: string | null
          email: string | null
          enquired_time: string | null
          enquiry_for: string | null
          follow_done: string | null
          followup: string | null
          followup_count: number | null
          id: string
          lead_status: string | null
          legacy_id: number | null
          mobile: string | null
          name: string | null
          otp_list: string | null
          remarks: string | null
          role_name: string | null
          source_from: string | null
          updated_at: string | null
          website_from: string | null
          website_source: string | null
          wedding_date: string | null
          wedding_fixed: string | null
        }
        Insert: {
          approx_wedding?: string | null
          city?: string | null
          connected_by?: string | null
          created_at?: string | null
          email?: string | null
          enquired_time?: string | null
          enquiry_for?: string | null
          follow_done?: string | null
          followup?: string | null
          followup_count?: number | null
          id?: string
          lead_status?: string | null
          legacy_id?: number | null
          mobile?: string | null
          name?: string | null
          otp_list?: string | null
          remarks?: string | null
          role_name?: string | null
          source_from?: string | null
          updated_at?: string | null
          website_from?: string | null
          website_source?: string | null
          wedding_date?: string | null
          wedding_fixed?: string | null
        }
        Update: {
          approx_wedding?: string | null
          city?: string | null
          connected_by?: string | null
          created_at?: string | null
          email?: string | null
          enquired_time?: string | null
          enquiry_for?: string | null
          follow_done?: string | null
          followup?: string | null
          followup_count?: number | null
          id?: string
          lead_status?: string | null
          legacy_id?: number | null
          mobile?: string | null
          name?: string | null
          otp_list?: string | null
          remarks?: string | null
          role_name?: string | null
          source_from?: string | null
          updated_at?: string | null
          website_from?: string | null
          website_source?: string | null
          wedding_date?: string | null
          wedding_fixed?: string | null
        }
        Relationships: []
      }
      client_subscriptions: {
        Row: {
          actual_subscription_date: string | null
          actual_subscription_end_date: string | null
          actual_subscription_start_date: string | null
          client_legacy_id: number | null
          created_at: string | null
          id: string
          legacy_id: number | null
          remaining_days: number | null
          remaining_month: number | null
          subscribed_month: string | null
          subscription_amount: string | null
          subscription_closed: boolean | null
          subscription_closed_on: string | null
          subscription_date: string | null
          subscription_exist: boolean | null
          subscription_tenure: string | null
          subscription_type: string | null
          updated_at: string | null
        }
        Insert: {
          actual_subscription_date?: string | null
          actual_subscription_end_date?: string | null
          actual_subscription_start_date?: string | null
          client_legacy_id?: number | null
          created_at?: string | null
          id?: string
          legacy_id?: number | null
          remaining_days?: number | null
          remaining_month?: number | null
          subscribed_month?: string | null
          subscription_amount?: string | null
          subscription_closed?: boolean | null
          subscription_closed_on?: string | null
          subscription_date?: string | null
          subscription_exist?: boolean | null
          subscription_tenure?: string | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_subscription_date?: string | null
          actual_subscription_end_date?: string | null
          actual_subscription_start_date?: string | null
          client_legacy_id?: number | null
          created_at?: string | null
          id?: string
          legacy_id?: number | null
          remaining_days?: number | null
          remaining_month?: number | null
          subscribed_month?: string | null
          subscription_amount?: string | null
          subscription_closed?: boolean | null
          subscription_closed_on?: string | null
          subscription_date?: string | null
          subscription_exist?: boolean | null
          subscription_tenure?: string | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_buyleads: {
        Row: {
          buy_leads_description: string | null
          buyleads_amount: number | null
          buyleads_city: string | null
          buyleads_event_category: string | null
          buyleads_executive_name: string | null
          buyleads_expiry_date: string | null
          buyleads_lead_date: string | null
          buyleads_package_type: string | null
          buyleads_price: string | null
          buyleads_purchase_allowed: boolean | null
          buyleads_status: Database["public"]["Enums"]["lead_status"] | null
          buyleads_type: string | null
          city: string | null
          complete_guest_number: string | null
          complete_wedding_budget: string | null
          connected_by: string | null
          created_at: string | null
          customer_email: string | null
          customer_mobile: string | null
          customer_name: string | null
          follow_done: string | null
          followup: string | null
          followup_count: number | null
          id: string
          lead_remarks: string | null
          lead_status_text: string | null
          legacy_id: number | null
          location: string | null
          meeting_address: string | null
          meeting_lead_type: string | null
          move_to_leads: boolean | null
          state_capital: string | null
          state_id: number | null
          state_name: string | null
          updated_at: string | null
          venue_allow_outside_vendors: string | null
          venue_detail: string | null
          venue_fixed: string | null
          venue_name: string | null
          wedding_approx_period: string | null
          wedding_date: string | null
          wedding_date_fixed: string | null
          wedding_decoration_sublist_items: string | null
          wedding_list_items: string | null
          wedding_type: string | null
        }
        Insert: {
          buy_leads_description?: string | null
          buyleads_amount?: number | null
          buyleads_city?: string | null
          buyleads_event_category?: string | null
          buyleads_executive_name?: string | null
          buyleads_expiry_date?: string | null
          buyleads_lead_date?: string | null
          buyleads_package_type?: string | null
          buyleads_price?: string | null
          buyleads_purchase_allowed?: boolean | null
          buyleads_status?: Database["public"]["Enums"]["lead_status"] | null
          buyleads_type?: string | null
          city?: string | null
          complete_guest_number?: string | null
          complete_wedding_budget?: string | null
          connected_by?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_mobile?: string | null
          customer_name?: string | null
          follow_done?: string | null
          followup?: string | null
          followup_count?: number | null
          id?: string
          lead_remarks?: string | null
          lead_status_text?: string | null
          legacy_id?: number | null
          location?: string | null
          meeting_address?: string | null
          meeting_lead_type?: string | null
          move_to_leads?: boolean | null
          state_capital?: string | null
          state_id?: number | null
          state_name?: string | null
          updated_at?: string | null
          venue_allow_outside_vendors?: string | null
          venue_detail?: string | null
          venue_fixed?: string | null
          venue_name?: string | null
          wedding_approx_period?: string | null
          wedding_date?: string | null
          wedding_date_fixed?: string | null
          wedding_decoration_sublist_items?: string | null
          wedding_list_items?: string | null
          wedding_type?: string | null
        }
        Update: {
          buy_leads_description?: string | null
          buyleads_amount?: number | null
          buyleads_city?: string | null
          buyleads_event_category?: string | null
          buyleads_executive_name?: string | null
          buyleads_expiry_date?: string | null
          buyleads_lead_date?: string | null
          buyleads_package_type?: string | null
          buyleads_price?: string | null
          buyleads_purchase_allowed?: boolean | null
          buyleads_status?: Database["public"]["Enums"]["lead_status"] | null
          buyleads_type?: string | null
          city?: string | null
          complete_guest_number?: string | null
          complete_wedding_budget?: string | null
          connected_by?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_mobile?: string | null
          customer_name?: string | null
          follow_done?: string | null
          followup?: string | null
          followup_count?: number | null
          id?: string
          lead_remarks?: string | null
          lead_status_text?: string | null
          legacy_id?: number | null
          location?: string | null
          meeting_address?: string | null
          meeting_lead_type?: string | null
          move_to_leads?: boolean | null
          state_capital?: string | null
          state_id?: number | null
          state_name?: string | null
          updated_at?: string | null
          venue_allow_outside_vendors?: string | null
          venue_detail?: string | null
          venue_fixed?: string | null
          venue_name?: string | null
          wedding_approx_period?: string | null
          wedding_date?: string | null
          wedding_date_fixed?: string | null
          wedding_decoration_sublist_items?: string | null
          wedding_list_items?: string | null
          wedding_type?: string | null
        }
        Relationships: []
      }
      general_leads: {
        Row: {
          actual_city_tbl_id: number | null
          actual_city_tbl_names: string | null
          actual_state_id: number | null
          actual_state_tbl_id: number | null
          actual_state_tbl_name: string | null
          added_from_business: boolean | null
          additional_remarks: string | null
          address: string | null
          approx_wedding: string | null
          buyleads_category_type: string | null
          city: string | null
          client_actual_id: number | null
          connected_by: string | null
          created_at: string | null
          custom_lead_id: string | null
          email: string | null
          enable_disable_added_by: string | null
          enable_disable_added_by_id: number | null
          enable_disable_added_on: string | null
          engagement_pax: number | null
          event_category: string | null
          event_date: string | null
          event_location: string | null
          excel_data_id: number | null
          executive_name: string | null
          expiry_date: string | null
          final_discount: number | null
          follow_done: string | null
          followup: string | null
          from_source: string | null
          honeymoon_sent: boolean | null
          honeymoon_sent_added_by: string | null
          honeymoon_sent_added_on: string | null
          id: string
          lead_assign_wp_status: string | null
          lead_audio: string | null
          lead_description: string | null
          lead_enable_disable: boolean | null
          lead_moved_from: string | null
          lead_remarks: string | null
          lead_request_for: string | null
          lead_request_id: number | null
          lead_source: string | null
          lead_source_show: string | null
          lead_status_text: string | null
          lead_time: string | null
          lead_to_assign_detail: string | null
          lead_type: string | null
          leads_link: string | null
          leadsource: string | null
          legacy_id: number | null
          looking_for: string | null
          mobile: string | null
          mute: boolean | null
          mute_added_by: string | null
          mute_added_id: number | null
          mute_added_on: string | null
          name: string | null
          not_show_wp: boolean | null
          other_leads_added: boolean | null
          other_leads_id: number | null
          package_amount: number | null
          package_city: string | null
          package_description: string | null
          package_id_number: string | null
          package_image: string | null
          package_type: string | null
          payment_initiated: boolean | null
          price: number | null
          purchase_allowed: boolean | null
          reception_pax: number | null
          request_from: string | null
          sms_category1: string | null
          sms_category2: string | null
          sms_city: string | null
          state_capital: string | null
          state_id: number | null
          state_name: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          status_added_by: string | null
          status_added_id: number | null
          status_added_on: string | null
          team_new_remarks: string | null
          team_remarks: string | null
          this_user_id: number | null
          updated_at: string | null
          wedding_date_fixed: string | null
          wedding_pax: number | null
          wedding_type: string | null
          wp_package_id: number | null
          wp_package_name: string | null
          wp_package_user_id: number | null
          wp_packages_form_id: number | null
        }
        Insert: {
          actual_city_tbl_id?: number | null
          actual_city_tbl_names?: string | null
          actual_state_id?: number | null
          actual_state_tbl_id?: number | null
          actual_state_tbl_name?: string | null
          added_from_business?: boolean | null
          additional_remarks?: string | null
          address?: string | null
          approx_wedding?: string | null
          buyleads_category_type?: string | null
          city?: string | null
          client_actual_id?: number | null
          connected_by?: string | null
          created_at?: string | null
          custom_lead_id?: string | null
          email?: string | null
          enable_disable_added_by?: string | null
          enable_disable_added_by_id?: number | null
          enable_disable_added_on?: string | null
          engagement_pax?: number | null
          event_category?: string | null
          event_date?: string | null
          event_location?: string | null
          excel_data_id?: number | null
          executive_name?: string | null
          expiry_date?: string | null
          final_discount?: number | null
          follow_done?: string | null
          followup?: string | null
          from_source?: string | null
          honeymoon_sent?: boolean | null
          honeymoon_sent_added_by?: string | null
          honeymoon_sent_added_on?: string | null
          id?: string
          lead_assign_wp_status?: string | null
          lead_audio?: string | null
          lead_description?: string | null
          lead_enable_disable?: boolean | null
          lead_moved_from?: string | null
          lead_remarks?: string | null
          lead_request_for?: string | null
          lead_request_id?: number | null
          lead_source?: string | null
          lead_source_show?: string | null
          lead_status_text?: string | null
          lead_time?: string | null
          lead_to_assign_detail?: string | null
          lead_type?: string | null
          leads_link?: string | null
          leadsource?: string | null
          legacy_id?: number | null
          looking_for?: string | null
          mobile?: string | null
          mute?: boolean | null
          mute_added_by?: string | null
          mute_added_id?: number | null
          mute_added_on?: string | null
          name?: string | null
          not_show_wp?: boolean | null
          other_leads_added?: boolean | null
          other_leads_id?: number | null
          package_amount?: number | null
          package_city?: string | null
          package_description?: string | null
          package_id_number?: string | null
          package_image?: string | null
          package_type?: string | null
          payment_initiated?: boolean | null
          price?: number | null
          purchase_allowed?: boolean | null
          reception_pax?: number | null
          request_from?: string | null
          sms_category1?: string | null
          sms_category2?: string | null
          sms_city?: string | null
          state_capital?: string | null
          state_id?: number | null
          state_name?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          status_added_by?: string | null
          status_added_id?: number | null
          status_added_on?: string | null
          team_new_remarks?: string | null
          team_remarks?: string | null
          this_user_id?: number | null
          updated_at?: string | null
          wedding_date_fixed?: string | null
          wedding_pax?: number | null
          wedding_type?: string | null
          wp_package_id?: number | null
          wp_package_name?: string | null
          wp_package_user_id?: number | null
          wp_packages_form_id?: number | null
        }
        Update: {
          actual_city_tbl_id?: number | null
          actual_city_tbl_names?: string | null
          actual_state_id?: number | null
          actual_state_tbl_id?: number | null
          actual_state_tbl_name?: string | null
          added_from_business?: boolean | null
          additional_remarks?: string | null
          address?: string | null
          approx_wedding?: string | null
          buyleads_category_type?: string | null
          city?: string | null
          client_actual_id?: number | null
          connected_by?: string | null
          created_at?: string | null
          custom_lead_id?: string | null
          email?: string | null
          enable_disable_added_by?: string | null
          enable_disable_added_by_id?: number | null
          enable_disable_added_on?: string | null
          engagement_pax?: number | null
          event_category?: string | null
          event_date?: string | null
          event_location?: string | null
          excel_data_id?: number | null
          executive_name?: string | null
          expiry_date?: string | null
          final_discount?: number | null
          follow_done?: string | null
          followup?: string | null
          from_source?: string | null
          honeymoon_sent?: boolean | null
          honeymoon_sent_added_by?: string | null
          honeymoon_sent_added_on?: string | null
          id?: string
          lead_assign_wp_status?: string | null
          lead_audio?: string | null
          lead_description?: string | null
          lead_enable_disable?: boolean | null
          lead_moved_from?: string | null
          lead_remarks?: string | null
          lead_request_for?: string | null
          lead_request_id?: number | null
          lead_source?: string | null
          lead_source_show?: string | null
          lead_status_text?: string | null
          lead_time?: string | null
          lead_to_assign_detail?: string | null
          lead_type?: string | null
          leads_link?: string | null
          leadsource?: string | null
          legacy_id?: number | null
          looking_for?: string | null
          mobile?: string | null
          mute?: boolean | null
          mute_added_by?: string | null
          mute_added_id?: number | null
          mute_added_on?: string | null
          name?: string | null
          not_show_wp?: boolean | null
          other_leads_added?: boolean | null
          other_leads_id?: number | null
          package_amount?: number | null
          package_city?: string | null
          package_description?: string | null
          package_id_number?: string | null
          package_image?: string | null
          package_type?: string | null
          payment_initiated?: boolean | null
          price?: number | null
          purchase_allowed?: boolean | null
          reception_pax?: number | null
          request_from?: string | null
          sms_category1?: string | null
          sms_category2?: string | null
          sms_city?: string | null
          state_capital?: string | null
          state_id?: number | null
          state_name?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          status_added_by?: string | null
          status_added_id?: number | null
          status_added_on?: string | null
          team_new_remarks?: string | null
          team_remarks?: string | null
          this_user_id?: number | null
          updated_at?: string | null
          wedding_date_fixed?: string | null
          wedding_pax?: number | null
          wedding_type?: string | null
          wp_package_id?: number | null
          wp_package_name?: string | null
          wp_package_user_id?: number | null
          wp_packages_form_id?: number | null
        }
        Relationships: []
      }
      general_leads_buy: {
        Row: {
          created_at: string | null
          general_leads_legacy_id: number | null
          id: string
          legacy_id: number | null
          status: Database["public"]["Enums"]["lead_status"] | null
          user_legacy_id: number | null
        }
        Insert: {
          created_at?: string | null
          general_leads_legacy_id?: number | null
          id?: string
          legacy_id?: number | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          user_legacy_id?: number | null
        }
        Update: {
          created_at?: string | null
          general_leads_legacy_id?: number | null
          id?: string
          legacy_id?: number | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          user_legacy_id?: number | null
        }
        Relationships: []
      }
      planner_subscriptions: {
        Row: {
          actual_remaining_days_counter: number | null
          actual_subscription_date: string | null
          actual_subscription_end_date: string | null
          created_at: string | null
          id: string
          legacy_id: number | null
          remaining_days: number | null
          remaining_month: number | null
          subscribed_month: string | null
          subscription_amount: number | null
          subscription_closed_on: string | null
          subscription_date: string | null
          subscription_tenure: string | null
          subscription_type: string | null
          team_legacy_id: number | null
          updated_at: string | null
          user_legacy_id: number | null
        }
        Insert: {
          actual_remaining_days_counter?: number | null
          actual_subscription_date?: string | null
          actual_subscription_end_date?: string | null
          created_at?: string | null
          id?: string
          legacy_id?: number | null
          remaining_days?: number | null
          remaining_month?: number | null
          subscribed_month?: string | null
          subscription_amount?: number | null
          subscription_closed_on?: string | null
          subscription_date?: string | null
          subscription_tenure?: string | null
          subscription_type?: string | null
          team_legacy_id?: number | null
          updated_at?: string | null
          user_legacy_id?: number | null
        }
        Update: {
          actual_remaining_days_counter?: number | null
          actual_subscription_date?: string | null
          actual_subscription_end_date?: string | null
          created_at?: string | null
          id?: string
          legacy_id?: number | null
          remaining_days?: number | null
          remaining_month?: number | null
          subscribed_month?: string | null
          subscription_amount?: number | null
          subscription_closed_on?: string | null
          subscription_date?: string | null
          subscription_tenure?: string | null
          subscription_type?: string | null
          team_legacy_id?: number | null
          updated_at?: string | null
          user_legacy_id?: number | null
        }
        Relationships: []
      }
      planners: {
        Row: {
          about: string | null
          account_number: string | null
          address1: string | null
          address2: string | null
          android_token: string | null
          api_token: string | null
          area_name: string | null
          bank_name: string | null
          branch_name: string | null
          business_name: string | null
          business_years: number | null
          chk_subscription: boolean | null
          city: string | null
          company_gst_image: string | null
          company_logo: string | null
          company_pancard_image: string | null
          company_website: string | null
          completed_events: number | null
          created_at: string | null
          delete_account: boolean | null
          email: string | null
          gst: string | null
          gst_number: string | null
          id: string
          ifsc: string | null
          image: string | null
          invoice_address: string | null
          invoice_address2: string | null
          invoice_address3: string | null
          invoice_business_name: string | null
          invoice_city: string | null
          invoice_gst: string | null
          invoice_gstin: string | null
          iphone_token: string | null
          ipm_amount: number | null
          ipm_date: string | null
          is_active: boolean | null
          is_admin: boolean | null
          is_partner: boolean | null
          last_login: string | null
          last_purchased: string | null
          last_wallet_date: string | null
          latest_logged_in: string | null
          legacy_id: number | null
          managed_by_role: string | null
          mobile: string | null
          name: string
          pan_number: string | null
          password_hash: string | null
          register_time: string | null
          registered_from: string | null
          remarks: string | null
          specialization: string | null
          subscribed_on: string | null
          subscribed_tenure: string | null
          terms_conditions: string | null
          th_code: string | null
          updated_at: string | null
          user_lead_state_name: string | null
          user_state: string | null
          user_state_capital: string | null
          username: string | null
          wallet_amount: number | null
        }
        Insert: {
          about?: string | null
          account_number?: string | null
          address1?: string | null
          address2?: string | null
          android_token?: string | null
          api_token?: string | null
          area_name?: string | null
          bank_name?: string | null
          branch_name?: string | null
          business_name?: string | null
          business_years?: number | null
          chk_subscription?: boolean | null
          city?: string | null
          company_gst_image?: string | null
          company_logo?: string | null
          company_pancard_image?: string | null
          company_website?: string | null
          completed_events?: number | null
          created_at?: string | null
          delete_account?: boolean | null
          email?: string | null
          gst?: string | null
          gst_number?: string | null
          id?: string
          ifsc?: string | null
          image?: string | null
          invoice_address?: string | null
          invoice_address2?: string | null
          invoice_address3?: string | null
          invoice_business_name?: string | null
          invoice_city?: string | null
          invoice_gst?: string | null
          invoice_gstin?: string | null
          iphone_token?: string | null
          ipm_amount?: number | null
          ipm_date?: string | null
          is_active?: boolean | null
          is_admin?: boolean | null
          is_partner?: boolean | null
          last_login?: string | null
          last_purchased?: string | null
          last_wallet_date?: string | null
          latest_logged_in?: string | null
          legacy_id?: number | null
          managed_by_role?: string | null
          mobile?: string | null
          name: string
          pan_number?: string | null
          password_hash?: string | null
          register_time?: string | null
          registered_from?: string | null
          remarks?: string | null
          specialization?: string | null
          subscribed_on?: string | null
          subscribed_tenure?: string | null
          terms_conditions?: string | null
          th_code?: string | null
          updated_at?: string | null
          user_lead_state_name?: string | null
          user_state?: string | null
          user_state_capital?: string | null
          username?: string | null
          wallet_amount?: number | null
        }
        Update: {
          about?: string | null
          account_number?: string | null
          address1?: string | null
          address2?: string | null
          android_token?: string | null
          api_token?: string | null
          area_name?: string | null
          bank_name?: string | null
          branch_name?: string | null
          business_name?: string | null
          business_years?: number | null
          chk_subscription?: boolean | null
          city?: string | null
          company_gst_image?: string | null
          company_logo?: string | null
          company_pancard_image?: string | null
          company_website?: string | null
          completed_events?: number | null
          created_at?: string | null
          delete_account?: boolean | null
          email?: string | null
          gst?: string | null
          gst_number?: string | null
          id?: string
          ifsc?: string | null
          image?: string | null
          invoice_address?: string | null
          invoice_address2?: string | null
          invoice_address3?: string | null
          invoice_business_name?: string | null
          invoice_city?: string | null
          invoice_gst?: string | null
          invoice_gstin?: string | null
          iphone_token?: string | null
          ipm_amount?: number | null
          ipm_date?: string | null
          is_active?: boolean | null
          is_admin?: boolean | null
          is_partner?: boolean | null
          last_login?: string | null
          last_purchased?: string | null
          last_wallet_date?: string | null
          latest_logged_in?: string | null
          legacy_id?: number | null
          managed_by_role?: string | null
          mobile?: string | null
          name?: string
          pan_number?: string | null
          password_hash?: string | null
          register_time?: string | null
          registered_from?: string | null
          remarks?: string | null
          specialization?: string | null
          subscribed_on?: string | null
          subscribed_tenure?: string | null
          terms_conditions?: string | null
          th_code?: string | null
          updated_at?: string | null
          user_lead_state_name?: string | null
          user_state?: string | null
          user_state_capital?: string | null
          username?: string | null
          wallet_amount?: number | null
        }
        Relationships: []
      }
      team_users: {
        Row: {
          created_at: string | null
          discount: number | null
          email: string
          email_verified_at: string | null
          id: string
          legacy_id: number | null
          mobile: string | null
          name: string
          password_hash: string | null
          thru_register: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          discount?: number | null
          email: string
          email_verified_at?: string | null
          id?: string
          legacy_id?: number | null
          mobile?: string | null
          name: string
          password_hash?: string | null
          thru_register?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          discount?: number | null
          email?: string
          email_verified_at?: string | null
          id?: string
          legacy_id?: number | null
          mobile?: string | null
          name?: string
          password_hash?: string | null
          thru_register?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_request_type: "Business APP" | "Couple APP"
      app_role:
        | "admin"
        | "vertical-head"
        | "manager"
        | "team-lead"
        | "associate"
      lead_status:
        | "not-purchased"
        | "purchased"
        | "active"
        | "converted"
        | "lost"
        | "follow-up"
        | "contacted"
        | "new"
      subscription_tenure:
        | "Free"
        | "onetime"
        | "monthly"
        | "quarterly"
        | "annual"
      subscription_type: "free" | "onetime" | "monthly" | "quarterly" | "annual"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_request_type: ["Business APP", "Couple APP"],
      app_role: ["admin", "vertical-head", "manager", "team-lead", "associate"],
      lead_status: [
        "not-purchased",
        "purchased",
        "active",
        "converted",
        "lost",
        "follow-up",
        "contacted",
        "new",
      ],
      subscription_tenure: [
        "Free",
        "onetime",
        "monthly",
        "quarterly",
        "annual",
      ],
      subscription_type: ["free", "onetime", "monthly", "quarterly", "annual"],
    },
  },
} as const
