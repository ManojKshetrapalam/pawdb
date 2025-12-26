import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vendor } from '@/types';
import { Tables } from '@/integrations/supabase/types';

type PlannerRow = Tables<'planners'>;

// Map database row to Vendor type
const mapPlannerToVendor = (row: PlannerRow): Vendor => {
  return {
    id: row.id,
    businessName: row.business_name || row.name || 'Unknown Business',
    contactName: row.name || 'Unknown',
    email: row.email || '',
    phone: row.mobile || '',
    category: row.specialization || 'General',
    isSubscribed: row.chk_subscription || false,
    hasApp: !!row.android_token || !!row.iphone_token,
    joinedAt: row.created_at || new Date().toISOString(),
    location: row.city || 'Unknown',
  };
};

export const useVendors = () => {
  return useQuery({
    queryKey: ['planners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('planners')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(mapPlannerToVendor);
    },
  });
};

export const useVendorStats = () => {
  return useQuery({
    queryKey: ['vendor_stats'],
    queryFn: async () => {
      const { count: total } = await supabase
        .from('planners')
        .select('*', { count: 'exact', head: true });
      
      const { count: subscribed } = await supabase
        .from('planners')
        .select('*', { count: 'exact', head: true })
        .eq('chk_subscription', true);
      
      return {
        total: total || 0,
        subscribed: subscribed || 0,
      };
    },
  });
};
