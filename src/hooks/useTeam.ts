import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, DEFAULT_PERMISSIONS } from '@/types';
import { Tables } from '@/integrations/supabase/types';

type TeamUserRow = Tables<'team_users'>;

// Map database row to User type
const mapTeamUserToUser = (row: TeamUserRow): User => {
  // Default role mapping based on legacy data
  const role: UserRole = 'associate';
  
  return {
    id: row.id,
    name: row.name || 'Unknown',
    email: row.email || '',
    role,
    permissions: { ...DEFAULT_PERMISSIONS[role] },
    assignedLeads: 0, // Will be calculated from leads data
    convertedLeads: 0, // Will be calculated from leads data
  };
};

export const useTeamUsers = () => {
  return useQuery({
    queryKey: ['team_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_users')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(mapTeamUserToUser);
    },
  });
};

export const useTeamStats = () => {
  return useQuery({
    queryKey: ['team_stats'],
    queryFn: async () => {
      const { count: totalMembers } = await supabase
        .from('team_users')
        .select('*', { count: 'exact', head: true });
      
      return {
        totalMembers: totalMembers || 0,
      };
    },
  });
};
