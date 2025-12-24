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

export type UserRole = 'admin' | 'vertical-head' | 'manager' | 'team-lead' | 'associate';

export interface UserPermissions {
  canAddLeads: boolean;
  canMoveLeadsToMembers: boolean;
  canMoveLeadsToVerticals: boolean;
  canCreateUsers: boolean;
  canManagePermissions: boolean;
  accessibleVerticals: Vertical[];
}

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  'admin': {
    canAddLeads: true,
    canMoveLeadsToMembers: true,
    canMoveLeadsToVerticals: true,
    canCreateUsers: true,
    canManagePermissions: true,
    accessibleVerticals: ['app-b2b', 'app-b2c', 'buy-leads', 'wedding-course', 'wedding-sip', 'honeymoon', 'hospitality'],
  },
  'vertical-head': {
    canAddLeads: true,
    canMoveLeadsToMembers: true,
    canMoveLeadsToVerticals: true,
    canCreateUsers: true,
    canManagePermissions: true,
    accessibleVerticals: [],
  },
  'manager': {
    canAddLeads: true,
    canMoveLeadsToMembers: true,
    canMoveLeadsToVerticals: false,
    canCreateUsers: false,
    canManagePermissions: false,
    accessibleVerticals: [],
  },
  'team-lead': {
    canAddLeads: true,
    canMoveLeadsToMembers: true,
    canMoveLeadsToVerticals: false,
    canCreateUsers: false,
    canManagePermissions: false,
    accessibleVerticals: [],
  },
  'associate': {
    canAddLeads: false,
    canMoveLeadsToMembers: false,
    canMoveLeadsToVerticals: false,
    canCreateUsers: false,
    canManagePermissions: false,
    accessibleVerticals: [],
  },
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  permissions: UserPermissions;
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
