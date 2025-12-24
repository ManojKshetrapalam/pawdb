export type Vertical = 
  | 'app-b2b' 
  | 'app-b2c' 
  | 'buy-leads' 
  | 'wedding-course' 
  | 'wedding-sip' 
  | 'honeymoon' 
  | 'hospitality';

export type LeadStatus = 'new' | 'contacted' | 'follow-up' | 'converted' | 'lost';

export type LeadSource = 'meta' | 'google' | 'organic' | 'referral';

export interface LeadNote {
  text: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  vertical: Vertical;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  notes: LeadNote[];
  followUpDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'agent';
  assignedLeads: number;
  convertedLeads: number;
}

export interface Vendor {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  isSubscribed: boolean;
  hasApp: boolean;
  joinedAt: string;
  location: string;
}

export interface VerticalConfig {
  id: Vertical;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const VERTICALS: VerticalConfig[] = [
  { id: 'app-b2b', name: 'App B2B', icon: 'Building2', color: 'info', description: 'Business to Business app leads' },
  { id: 'app-b2c', name: 'App B2C', icon: 'Users', color: 'primary', description: 'Business to Consumer app leads' },
  { id: 'buy-leads', name: 'Buy Leads', icon: 'ShoppingCart', color: 'success', description: 'Purchase intent leads' },
  { id: 'wedding-course', name: 'Wedding Course', icon: 'GraduationCap', color: 'warning', description: 'Wedding planning course leads' },
  { id: 'wedding-sip', name: 'Wedding SIP', icon: 'Heart', color: 'destructive', description: 'Wedding SIP investment leads' },
  { id: 'honeymoon', name: 'Honeymoon', icon: 'Plane', color: 'accent', description: 'Honeymoon package leads' },
  { id: 'hospitality', name: 'Hospitality', icon: 'Hotel', color: 'secondary', description: 'Hospitality service leads' },
];
