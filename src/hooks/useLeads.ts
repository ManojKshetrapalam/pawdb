import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lead, Vertical, LeadStatus, LeadSource } from '@/types';
import { Tables } from '@/integrations/supabase/types';

type ChatLeadFormRow = Tables<'chat_leadform'>;

// Map database lead_status to our LeadStatus type
const mapLeadStatus = (dbStatus: string | null): LeadStatus => {
  if (!dbStatus) return 'new';
  
  const status = dbStatus.toLowerCase().trim();
  
  // Direct matches
  if (status === 'new') return 'new';
  if (status === 'contacted') return 'contacted';
  if (status === 'follow-up' || status === 'follow up') return 'follow-up';
  if (status === 'converted') return 'converted';
  if (status === 'lost') return 'lost';
  
  // Map database-specific statuses
  if (status === 'cold') return 'new';
  if (status === 'hot') return 'contacted';
  if (status.includes('converted')) return 'converted'; // Converted BuyLeads, Converted IPM
  if (status.includes('not able to connect')) return 'follow-up';
  
  return 'new';
};

// Map database row to Lead type
const mapChatLeadToLead = (row: ChatLeadFormRow): Lead => {
  // Map enquiry_for to vertical
  const verticalMap: Record<string, Vertical> = {
    'App B2B': 'app-b2b',
    'App B2C': 'app-b2c',
    'Buy Leads': 'buy-leads',
  };
  
  const vertical = verticalMap[row.enquiry_for || ''] || 'buy-leads';
  const status = mapLeadStatus(row.lead_status);
  
  return {
    id: row.id,
    name: row.name || 'Unknown',
    email: row.email || '',
    phone: row.mobile || '',
    vertical,
    status,
    source: (row.source_from as LeadSource) || 'organic',
    assignedTo: row.connected_by || null,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    notes: row.remarks ? [{ text: row.remarks, timestamp: row.updated_at || new Date().toISOString() }] : [],
    followUpDate: row.followup || undefined,
  };
};

interface UseLeadsOptions {
  page?: number;
  pageSize?: number;
  status?: string;
  vertical?: string;
}

export const useLeads = (options: UseLeadsOptions = {}) => {
  const { page = 1, pageSize = 50, status, vertical } = options;
  
  return useQuery({
    queryKey: ['chat_leadform', page, pageSize, status, vertical],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      let query = supabase
        .from('chat_leadform')
        .select('*', { count: 'exact' })
        .not('name', 'is', null)
        .neq('name', '')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      // Filter by vertical (enquiry_for)
      if (vertical && vertical !== 'all') {
        const verticalDbMap: Record<string, string> = {
          'app-b2b': 'App B2B',
          'app-b2c': 'App B2C',
          'buy-leads': 'Buy Leads',
        };
        if (verticalDbMap[vertical]) {
          query = query.eq('enquiry_for', verticalDbMap[vertical]);
        }
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Filter out records with empty names (client-side backup)
      const validRecords = (data || []).filter(row => row.name && row.name.trim() !== '');
      const leads = validRecords.map(mapChatLeadToLead);
      
      // Filter by status (client-side since DB status needs mapping)
      const filteredLeads = status && status !== 'all'
        ? leads.filter(l => l.status === status)
        : leads;
      
      return {
        leads: filteredLeads,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
};

// Simple hook for dashboard (just get recent leads)
export const useRecentLeads = (limit: number = 5) => {
  return useQuery({
    queryKey: ['chat_leadform_recent', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_leadform')
        .select('*')
        .not('name', 'is', null)
        .neq('name', '')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      const validRecords = (data || []).filter(row => row.name && row.name.trim() !== '');
      return validRecords.map(mapChatLeadToLead);
    },
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: ['lead_stats'],
    queryFn: async () => {
      // Get total count of valid records
      const { count: total } = await supabase
        .from('chat_leadform')
        .select('*', { count: 'exact', head: true })
        .not('name', 'is', null)
        .neq('name', '');
      
      // Get counts by enquiry_for
      const { data: enquiryData } = await supabase
        .from('chat_leadform')
        .select('enquiry_for')
        .not('name', 'is', null)
        .neq('name', '');
      
      const enquiryCounts = (enquiryData || []).reduce((acc: Record<string, number>, row) => {
        const key = row.enquiry_for || 'Unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      
      return {
        total: total || 0,
        byEnquiry: enquiryCounts,
        appB2B: enquiryCounts['App B2B'] || 0,
        appB2C: enquiryCounts['App B2C'] || 0,
        buyLeads: enquiryCounts['Buy Leads'] || 0,
      };
    },
  });
};
