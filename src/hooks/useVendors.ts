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
      
      // Filter out invalid/placeholder records
      const validRecords = (data || []).filter(row => isValidName(row.name));
      return validRecords.map(mapPlannerToVendor);
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
        .select('name, chk_subscription');
      
      const validRecords = (data || []).filter(row => isValidName(row.name));
      const subscribed = validRecords.filter(row => row.chk_subscription).length;
      
      return {
        total: validRecords.length,
        subscribed,
      };
    },
  });
};
