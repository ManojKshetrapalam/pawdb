import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lead, Vertical, LeadStatus, LeadSource } from '@/types';
import { Tables } from '@/integrations/supabase/types';

type ChatLeadFormRow = Tables<'chat_leadform'>;

// Map database row to Lead type
const mapChatLeadToLead = (row: ChatLeadFormRow): Lead => {
  // Map enquiry_for to vertical
  const verticalMap: Record<string, Vertical> = {
    'App B2B': 'app-b2b',
    'App B2C': 'app-b2c',
    'Buy Leads': 'buy-leads',
  };
  
  const vertical = verticalMap[row.enquiry_for || ''] || 'buy-leads';
  
  // Map lead_status to our status type
  const statusMap: Record<string, LeadStatus> = {
    'new': 'new',
    'contacted': 'contacted',
    'follow-up': 'follow-up',
    'converted': 'converted',
    'lost': 'lost',
  };
  
  const status = statusMap[row.lead_status || ''] || 'new';
  
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

export const useLeads = (limit?: number) => {
  return useQuery({
    queryKey: ['chat_leadform', limit],
    queryFn: async () => {
      let query = supabase
        .from('chat_leadform')
        .select('*')
        .not('name', 'is', null) // Only get records with names
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter out records with empty names
      const validRecords = (data || []).filter(row => row.name && row.name.trim() !== '');
      return validRecords.map(mapChatLeadToLead);
    },
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: ['lead_stats'],
    queryFn: async () => {
      // Get total count
      const { count: total } = await supabase
        .from('chat_leadform')
        .select('*', { count: 'exact', head: true });
      
      // Get counts by enquiry_for
      const { data: enquiryData } = await supabase
        .from('chat_leadform')
        .select('enquiry_for');
      
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
