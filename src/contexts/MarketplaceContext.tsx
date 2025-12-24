import { createContext, useContext, useState, ReactNode } from 'react';
import { Lead } from '@/types';
import { VendorConfig } from '@/components/leads/PostLeadDialog';

export interface PostedLead {
  id: string;
  lead: Lead;
  vendorConfigs: Record<string, VendorConfig>;
  postedAt: string;
  buyers: Record<string, string[]>; // category -> vendor ids who bought
}

interface MarketplaceContextType {
  postedLeads: PostedLead[];
  postLead: (lead: Lead, vendorConfigs: Record<string, VendorConfig>) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [postedLeads, setPostedLeads] = useState<PostedLead[]>([]);

  const postLead = (lead: Lead, vendorConfigs: Record<string, VendorConfig>) => {
    const newPostedLead: PostedLead = {
      id: `posted-${Date.now()}`,
      lead,
      vendorConfigs,
      postedAt: new Date().toISOString(),
      buyers: {},
    };
    setPostedLeads((prev) => [newPostedLead, ...prev]);
  };

  return (
    <MarketplaceContext.Provider value={{ postedLeads, postLead }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
