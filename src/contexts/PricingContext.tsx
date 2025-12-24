import { createContext, useContext, useState, ReactNode } from 'react';

export interface SubscriptionPricing {
  quarterly: { price: number; enabled: boolean };
  halfYearly: { price: number; enabled: boolean };
  annual: { price: number; enabled: boolean };
}

export interface RenewalPricing {
  quarterly: { price: number; duration: number; enabled: boolean };
  halfYearly: { price: number; duration: number; enabled: boolean };
  annual: { price: number; duration: number; enabled: boolean };
}

export interface AppPricing {
  subscription: SubscriptionPricing;
  renewal: RenewalPricing;
}

export interface ConvertedSubscription {
  id: string;
  leadId: string;
  leadName: string;
  appType: 'app-b2b' | 'app-b2c';
  subscriptionType: 'quarterly' | 'halfYearly' | 'annual';
  isRenewal: boolean;
  price: number;
  duration: number;
  convertedAt: string;
}

interface PricingContextType {
  b2bPricing: AppPricing;
  b2cPricing: AppPricing;
  updateB2BPricing: (pricing: AppPricing) => void;
  updateB2CPricing: (pricing: AppPricing) => void;
  convertedSubscriptions: ConvertedSubscription[];
  addConvertedSubscription: (subscription: Omit<ConvertedSubscription, 'id' | 'convertedAt'>) => void;
  getRevenueByType: () => { buyLeads: number; b2b: number; b2c: number };
}

const defaultPricing: AppPricing = {
  subscription: {
    quarterly: { price: 2999, enabled: true },
    halfYearly: { price: 4999, enabled: true },
    annual: { price: 7999, enabled: true },
  },
  renewal: {
    quarterly: { price: 2499, duration: 3, enabled: true },
    halfYearly: { price: 3999, duration: 6, enabled: true },
    annual: { price: 5999, duration: 12, enabled: true },
  },
};

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [b2bPricing, setB2BPricing] = useState<AppPricing>(defaultPricing);
  const [b2cPricing, setB2CPricing] = useState<AppPricing>({
    subscription: {
      quarterly: { price: 1999, enabled: true },
      halfYearly: { price: 2999, enabled: true },
      annual: { price: 4999, enabled: true },
    },
    renewal: {
      quarterly: { price: 1499, duration: 3, enabled: true },
      halfYearly: { price: 2499, duration: 6, enabled: true },
      annual: { price: 3999, duration: 12, enabled: true },
    },
  });
  const [convertedSubscriptions, setConvertedSubscriptions] = useState<ConvertedSubscription[]>([
    // Mock data
    { id: '1', leadId: '1', leadName: 'Sample B2B Lead', appType: 'app-b2b', subscriptionType: 'annual', isRenewal: false, price: 7999, duration: 12, convertedAt: '2024-01-10T10:00:00Z' },
    { id: '2', leadId: '2', leadName: 'Sample B2C Lead', appType: 'app-b2c', subscriptionType: 'quarterly', isRenewal: false, price: 1999, duration: 3, convertedAt: '2024-01-12T14:00:00Z' },
    { id: '3', leadId: '3', leadName: 'Another B2B', appType: 'app-b2b', subscriptionType: 'halfYearly', isRenewal: true, price: 3999, duration: 6, convertedAt: '2024-01-14T09:00:00Z' },
  ]);

  const addConvertedSubscription = (subscription: Omit<ConvertedSubscription, 'id' | 'convertedAt'>) => {
    const newSubscription: ConvertedSubscription = {
      ...subscription,
      id: String(Date.now()),
      convertedAt: new Date().toISOString(),
    };
    setConvertedSubscriptions((prev) => [newSubscription, ...prev]);
  };

  const getRevenueByType = () => {
    const b2b = convertedSubscriptions
      .filter((s) => s.appType === 'app-b2b')
      .reduce((sum, s) => sum + s.price, 0);
    const b2c = convertedSubscriptions
      .filter((s) => s.appType === 'app-b2c')
      .reduce((sum, s) => sum + s.price, 0);
    // Mock buy leads revenue
    const buyLeads = 45000;
    return { buyLeads, b2b, b2c };
  };

  return (
    <PricingContext.Provider
      value={{
        b2bPricing,
        b2cPricing,
        updateB2BPricing: setB2BPricing,
        updateB2CPricing: setB2CPricing,
        convertedSubscriptions,
        addConvertedSubscription,
        getRevenueByType,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
}
