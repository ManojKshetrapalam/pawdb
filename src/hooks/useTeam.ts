import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, DEFAULT_PERMISSIONS } from '@/types';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type TeamUserRow = Tables<'team_users'>;

export interface TeamUser extends User {
  isActive: boolean;
}

// Map database row to User type
const mapTeamUserToUser = (row: TeamUserRow): TeamUser => {
  // Default role mapping based on legacy data
  const role: UserRole = 'associate';
  
  return {
    id: row.id,
    name: row.name || 'Unknown',
    email: row.email || '',
    role,
    permissions: { ...DEFAULT_PERMISSIONS[role] },
    assignedLeads: 0,
    convertedLeads: 0,
    isActive: row.is_active ?? true,
  };
};

// Fetch only active team users (for dropdowns)
export const useActiveTeamUsers = () => {
  return useQuery({
    queryKey: ['team_users', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_users')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(mapTeamUserToUser);
    },
  });
};

// Fetch all team users (for team management page)
export const useTeamUsers = () => {
  return useQuery({
    queryKey: ['team_users', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_users')
        .select('*')
        .order('is_active', { ascending: false })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(mapTeamUserToUser);
    },
  });
};

export const useToggleTeamUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('team_users')
        .update({ is_active: isActive })
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['team_users'] });
      toast.success(`Team member ${isActive ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      toast.error('Failed to update team member status');
      console.error(error);
    },
  });
};

export const useTeamStats = () => {
  return useQuery({
    queryKey: ['team_stats'],
    queryFn: async () => {
      const { count: totalMembers } = await supabase
        .from('team_users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      return {
        totalMembers: totalMembers || 0,
      };
    },
  });
};
