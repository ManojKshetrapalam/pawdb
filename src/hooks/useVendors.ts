import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vendor } from '@/types';
import { Tables } from '@/integrations/supabase/types';

type PlannerRow = Tables<'planners'>;

// Check if a name is valid (not empty, not HTML tags, not placeholder)
const isValidName = (name: string | null): boolean => {
  if (!name || name.trim() === '') return false;
  // Filter out HTML tags and placeholder text
  if (name.includes('<br') || name.includes('<BR')) return false;
  if (name.startsWith('(Ex')) return false;
  if (name.trim().length < 2) return false;
  return true;
};

// Get the best display name (prioritize business_name)
const getDisplayName = (row: PlannerRow): string => {
  if (isValidName(row.business_name)) return row.business_name!;
  if (isValidName(row.name)) return row.name;
  return 'Unknown Business';
};

// Map database row to Vendor type
const mapPlannerToVendor = (row: PlannerRow): Vendor => {
  return {
    id: row.id,
    legacyId: row.legacy_id ?? undefined,
    businessName: getDisplayName(row),
    contactName: isValidName(row.name) ? row.name : 'Unknown',
    email: row.email || '',
    phone: row.mobile || '',
    category: row.specialization || 'General',
    isSubscribed: row.chk_subscription || false,
    hasApp: !!row.android_token || !!row.iphone_token,
    joinedAt: row.created_at || new Date().toISOString(),
    location: row.city || 'Unknown',
  };
};

// Check if a record has at least one valid name
const hasValidDisplayName = (row: PlannerRow): boolean => {
  return isValidName(row.business_name) || isValidName(row.name);
};

interface UseVendorsOptions {
  page?: number;
  pageSize?: number;
  subscriptionFilter?: string;
  appFilter?: string;
}

export const useVendors = (options: UseVendorsOptions = {}) => {
  const { page = 1, pageSize = 50, subscriptionFilter, appFilter } = options;
  
  return useQuery({
    queryKey: ['planners', page, pageSize, subscriptionFilter, appFilter],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      let query = supabase
        .from('planners')
        .select('*', { count: 'exact' })
        .order('business_name', { ascending: true, nullsFirst: false })
        .range(from, to);
      
      // Apply subscription filter at DB level
      if (subscriptionFilter === 'subscribed') {
        query = query.eq('chk_subscription', true);
      } else if (subscriptionFilter === 'not-subscribed') {
        query = query.eq('chk_subscription', false);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Filter out invalid/placeholder records (client-side)
      let validRecords = (data || []).filter(row => hasValidDisplayName(row));
      
      // Apply app filter (client-side since it's computed)
      if (appFilter === 'has-app') {
        validRecords = validRecords.filter(row => !!row.android_token || !!row.iphone_token);
      } else if (appFilter === 'no-app') {
        validRecords = validRecords.filter(row => !row.android_token && !row.iphone_token);
      }
      
      return {
        vendors: validRecords.map(mapPlannerToVendor),
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
};

export const useVendorStats = () => {
  return useQuery({
    queryKey: ['vendor_stats'],
    queryFn: async () => {
      // Get all planners with valid names
      const { data } = await supabase
        .from('planners')
        .select('name, business_name, chk_subscription, android_token, iphone_token');
      
      const validRecords = (data || []).filter(row => 
        isValidName(row.business_name) || isValidName(row.name)
      );
      const subscribed = validRecords.filter(row => row.chk_subscription).length;
      const withApp = validRecords.filter(row => !!row.android_token || !!row.iphone_token).length;
      
      return {
        total: validRecords.length,
        subscribed,
        withApp,
      };
    },
  });
};
