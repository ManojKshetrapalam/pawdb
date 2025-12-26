import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RevenueStats {
  totalRevenue: number;
  totalLeadsSold: number;
  uniqueBuyers: number;
  avgLeadPrice: number;
  topBuyers: Array<{
    legacy_id: number;
    total_spent: number;
    leads_purchased: number;
  }>;
}

interface PlannerSpending {
  totalSpent: number;
  leadsPurchased: number;
  purchases: Array<{
    id: string;
    lead_id: number;
    price: number;
    status: string;
    purchased_at: string;
    lead_name: string | null;
    lead_city: string | null;
    lead_category: string | null;
  }>;
}

export const useRevenueStats = () => {
  return useQuery({
    queryKey: ['revenue_stats'],
    queryFn: async (): Promise<RevenueStats> => {
      // Get all lead purchases with lead prices
      const { data: purchases, error: purchasesError } = await supabase
        .from('general_leads_buy')
        .select('user_legacy_id, general_leads_legacy_id');
      
      if (purchasesError) throw purchasesError;

      // Get all general leads with prices
      const { data: leads, error: leadsError } = await supabase
        .from('general_leads')
        .select('legacy_id, price, status');
      
      if (leadsError) throw leadsError;

      // Create a map of lead prices
      const leadPriceMap = new Map<number, number>();
      (leads || []).forEach(lead => {
        if (lead.legacy_id && lead.price) {
          leadPriceMap.set(lead.legacy_id, Number(lead.price) || 0);
        }
      });

      // Calculate stats
      let totalRevenue = 0;
      const buyerSpending = new Map<number, { total: number; count: number }>();

      (purchases || []).forEach(purchase => {
        const price = leadPriceMap.get(purchase.general_leads_legacy_id || 0) || 0;
        totalRevenue += price;

        if (purchase.user_legacy_id) {
          const current = buyerSpending.get(purchase.user_legacy_id) || { total: 0, count: 0 };
          buyerSpending.set(purchase.user_legacy_id, {
            total: current.total + price,
            count: current.count + 1,
          });
        }
      });

      // Get top buyers
      const topBuyers = Array.from(buyerSpending.entries())
        .map(([legacy_id, data]) => ({
          legacy_id,
          total_spent: data.total,
          leads_purchased: data.count,
        }))
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 10);

      return {
        totalRevenue,
        totalLeadsSold: purchases?.length || 0,
        uniqueBuyers: buyerSpending.size,
        avgLeadPrice: purchases?.length ? totalRevenue / purchases.length : 0,
        topBuyers,
      };
    },
  });
};

export const usePlannerSpending = (plannerLegacyId: number | null) => {
  return useQuery({
    queryKey: ['planner_spending', plannerLegacyId],
    queryFn: async (): Promise<PlannerSpending | null> => {
      if (!plannerLegacyId) return null;

      // Get all purchases by this planner
      const { data: purchases, error: purchasesError } = await supabase
        .from('general_leads_buy')
        .select('id, general_leads_legacy_id, status, created_at')
        .eq('user_legacy_id', plannerLegacyId);
      
      if (purchasesError) throw purchasesError;
      if (!purchases || purchases.length === 0) {
        return { totalSpent: 0, leadsPurchased: 0, purchases: [] };
      }

      // Get lead details for these purchases
      const leadIds = purchases.map(p => p.general_leads_legacy_id).filter(Boolean) as number[];
      
      const { data: leads, error: leadsError } = await supabase
        .from('general_leads')
        .select('legacy_id, price, name, city, event_category')
        .in('legacy_id', leadIds);
      
      if (leadsError) throw leadsError;

      // Create a map of lead details
      const leadMap = new Map<number, { price: number; name: string | null; city: string | null; category: string | null }>();
      (leads || []).forEach(lead => {
        if (lead.legacy_id) {
          leadMap.set(lead.legacy_id, {
            price: Number(lead.price) || 0,
            name: lead.name,
            city: lead.city,
            category: lead.event_category,
          });
        }
      });

      // Calculate total and build purchase list
      let totalSpent = 0;
      const purchaseDetails = purchases.map(purchase => {
        const leadInfo = leadMap.get(purchase.general_leads_legacy_id || 0);
        const price = leadInfo?.price || 0;
        totalSpent += price;

        return {
          id: purchase.id,
          lead_id: purchase.general_leads_legacy_id || 0,
          price,
          status: purchase.status || 'purchased',
          purchased_at: purchase.created_at || '',
          lead_name: leadInfo?.name || null,
          lead_city: leadInfo?.city || null,
          lead_category: leadInfo?.category || null,
        };
      });

      return {
        totalSpent,
        leadsPurchased: purchases.length,
        purchases: purchaseDetails.sort((a, b) => 
          new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime()
        ),
      };
    },
    enabled: !!plannerLegacyId,
  });
};

export const useBuyLeadsStats = () => {
  return useQuery({
    queryKey: ['buy_leads_stats'],
    queryFn: async () => {
      // Get all general leads
      const { data: leads, error: leadsError } = await supabase
        .from('general_leads')
        .select('legacy_id, price, status, final_discount');
      
      if (leadsError) throw leadsError;

      // Get all purchases
      const { data: purchases, error: purchasesError } = await supabase
        .from('general_leads_buy')
        .select('general_leads_legacy_id');
      
      if (purchasesError) throw purchasesError;

      // Create set of sold lead IDs
      const soldLeadIds = new Set(
        (purchases || []).map(p => p.general_leads_legacy_id).filter(Boolean)
      );

      // Calculate stats
      const allLeads = leads || [];
      const leadsGenerated = allLeads.length;
      
      // Leads that are purchasable (have a price > 0)
      const leadsPosted = allLeads.filter(l => Number(l.price) > 0).length;
      
      let totalRevenue = 0;
      let fullPriceSold = 0;
      let discountSold = 0;
      let freeSold = 0;

      allLeads.forEach(lead => {
        if (soldLeadIds.has(lead.legacy_id)) {
          const price = Number(lead.price) || 0;
          const discount = Number(lead.final_discount) || 0;
          
          totalRevenue += price;
          
          if (price === 0) {
            freeSold++;
          } else if (discount > 0) {
            discountSold++;
          } else {
            fullPriceSold++;
          }
        }
      });

      return {
        leadsGenerated,
        leadsPosted,
        leadsSold: soldLeadIds.size,
        fullPriceSold,
        discountSold,
        freeSold,
        totalRevenue,
      };
    },
  });
};
