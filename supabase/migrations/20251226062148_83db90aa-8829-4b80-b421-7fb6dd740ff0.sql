-- Create enum types
CREATE TYPE public.subscription_type AS ENUM ('free', 'onetime', 'monthly', 'quarterly', 'annual');
CREATE TYPE public.subscription_tenure AS ENUM ('Free', 'onetime', 'monthly', 'quarterly', 'annual');
CREATE TYPE public.lead_status AS ENUM ('not-purchased', 'purchased', 'active', 'converted', 'lost', 'follow-up', 'contacted', 'new');
CREATE TYPE public.app_request_type AS ENUM ('Business APP', 'Couple APP');

-- 1. Team/Admin Users table
CREATE TABLE public.team_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT,
  discount INTEGER DEFAULT 0,
  thru_register TEXT DEFAULT 'no',
  email_verified_at TIMESTAMPTZ,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Planners/Vendors table
CREATE TABLE public.planners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  username TEXT,
  email TEXT,
  mobile TEXT,
  api_token TEXT,
  android_token TEXT,
  iphone_token TEXT,
  account_number TEXT,
  bank_name TEXT,
  ifsc TEXT,
  branch_name TEXT,
  terms_conditions TEXT,
  image TEXT,
  about TEXT,
  business_name TEXT,
  address1 TEXT,
  address2 TEXT,
  area_name TEXT,
  city TEXT,
  specialization TEXT,
  gst_number TEXT,
  pan_number TEXT,
  company_website TEXT,
  business_years INTEGER DEFAULT 0,
  completed_events INTEGER DEFAULT 0,
  company_logo TEXT,
  company_gst_image TEXT,
  company_pancard_image TEXT,
  is_active BOOLEAN DEFAULT true,
  th_code TEXT,
  gst TEXT,
  ipm_amount DECIMAL(12,2) DEFAULT 0,
  ipm_date DATE,
  wallet_amount DECIMAL(12,2) DEFAULT 0,
  last_wallet_date TIMESTAMPTZ,
  last_purchased TIMESTAMPTZ,
  remarks TEXT,
  last_login TIMESTAMPTZ,
  managed_by_role TEXT,
  is_partner BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  invoice_business_name TEXT,
  invoice_address TEXT,
  invoice_address2 TEXT,
  invoice_address3 TEXT,
  invoice_city TEXT,
  invoice_gstin TEXT,
  invoice_gst TEXT,
  registered_from TEXT,
  register_time TIMESTAMPTZ,
  latest_logged_in TIMESTAMPTZ,
  delete_account BOOLEAN DEFAULT false,
  user_state_capital TEXT,
  user_state TEXT,
  chk_subscription BOOLEAN DEFAULT false,
  subscribed_tenure TEXT,
  subscribed_on TIMESTAMPTZ,
  user_lead_state_name TEXT,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. General Leads table
CREATE TABLE public.general_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER UNIQUE,
  custom_lead_id TEXT,
  name TEXT,
  email TEXT,
  mobile TEXT,
  executive_name TEXT,
  lead_time TIMESTAMPTZ,
  wedding_date_fixed TEXT,
  event_date DATE,
  approx_wedding TEXT,
  expiry_date DATE,
  package_type TEXT,
  event_category TEXT,
  lead_type TEXT,
  status lead_status DEFAULT 'not-purchased',
  lead_audio TEXT,
  lead_description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  payment_initiated BOOLEAN DEFAULT false,
  city TEXT,
  state_id INTEGER,
  state_name TEXT,
  state_capital TEXT,
  event_location TEXT,
  purchase_allowed BOOLEAN DEFAULT true,
  wedding_type TEXT,
  address TEXT,
  connected_by TEXT,
  followup TEXT,
  follow_done TEXT,
  team_remarks TEXT,
  sms_city TEXT,
  sms_category1 TEXT,
  sms_category2 TEXT,
  mute BOOLEAN DEFAULT false,
  lead_remarks TEXT,
  lead_status_text TEXT,
  buyleads_category_type TEXT,
  leads_link TEXT,
  status_added_on TIMESTAMPTZ,
  status_added_by TEXT,
  status_added_id INTEGER,
  mute_added_on TIMESTAMPTZ,
  mute_added_by TEXT,
  mute_added_id INTEGER,
  excel_data_id INTEGER,
  lead_enable_disable BOOLEAN DEFAULT true,
  enable_disable_added_on TIMESTAMPTZ,
  enable_disable_added_by TEXT,
  enable_disable_added_by_id INTEGER,
  wp_packages_form_id INTEGER,
  wp_package_id INTEGER,
  wp_package_user_id INTEGER,
  wp_package_name TEXT,
  package_image TEXT,
  package_amount DECIMAL(10,2),
  final_discount DECIMAL(10,2),
  package_city TEXT,
  package_description TEXT,
  additional_remarks TEXT,
  wedding_pax INTEGER,
  reception_pax INTEGER,
  engagement_pax INTEGER,
  honeymoon_sent BOOLEAN DEFAULT false,
  honeymoon_sent_added_by TEXT,
  honeymoon_sent_added_on TIMESTAMPTZ,
  lead_to_assign_detail TEXT,
  this_user_id INTEGER,
  package_id_number TEXT,
  lead_assign_wp_status TEXT,
  team_new_remarks TEXT,
  lead_moved_from TEXT,
  client_actual_id INTEGER,
  looking_for TEXT,
  request_from TEXT,
  lead_request_for TEXT,
  lead_request_id INTEGER,
  not_show_wp BOOLEAN DEFAULT false,
  actual_state_tbl_id INTEGER,
  actual_state_tbl_name TEXT,
  actual_state_id INTEGER,
  actual_city_tbl_id INTEGER,
  actual_city_tbl_names TEXT,
  lead_source TEXT,
  lead_source_show TEXT,
  other_leads_added BOOLEAN DEFAULT false,
  other_leads_id INTEGER,
  added_from_business BOOLEAN DEFAULT false,
  from_source TEXT,
  leadsource TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Custom Buy Leads table
CREATE TABLE public.custom_buyleads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER UNIQUE,
  customer_name TEXT,
  customer_email TEXT,
  customer_mobile TEXT,
  wedding_list_items TEXT,
  wedding_decoration_sublist_items TEXT,
  complete_wedding_budget TEXT,
  complete_guest_number TEXT,
  city TEXT,
  location TEXT,
  venue_fixed TEXT,
  venue_name TEXT,
  venue_allow_outside_vendors TEXT,
  venue_detail TEXT,
  wedding_date_fixed TEXT,
  wedding_date DATE,
  wedding_approx_period TEXT,
  buy_leads_description TEXT,
  buyleads_package_type TEXT,
  buyleads_purchase_allowed BOOLEAN DEFAULT true,
  buyleads_status lead_status DEFAULT 'not-purchased',
  buyleads_city TEXT,
  state_id INTEGER,
  state_name TEXT,
  state_capital TEXT,
  buyleads_event_category TEXT,
  buyleads_type TEXT,
  meeting_lead_type TEXT,
  meeting_address TEXT,
  buyleads_price TEXT,
  buyleads_amount DECIMAL(10,2),
  buyleads_executive_name TEXT,
  buyleads_lead_date TIMESTAMPTZ,
  buyleads_expiry_date DATE,
  wedding_type TEXT,
  move_to_leads BOOLEAN DEFAULT false,
  lead_remarks TEXT,
  followup TEXT,
  follow_done TEXT,
  connected_by TEXT,
  lead_status_text TEXT,
  followup_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Chat Lead Form table
CREATE TABLE public.chat_leadform (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER UNIQUE,
  enquiry_for TEXT,
  role_name TEXT,
  name TEXT,
  email TEXT,
  mobile TEXT,
  city TEXT,
  remarks TEXT,
  source_from TEXT,
  website_from TEXT,
  connected_by TEXT,
  followup TEXT,
  follow_done TEXT,
  lead_status TEXT,
  followup_count INTEGER DEFAULT 0,
  wedding_date DATE,
  otp_list TEXT,
  enquired_time TIMESTAMPTZ,
  website_source TEXT,
  wedding_fixed TEXT,
  approx_wedding TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. General Leads Buy (junction table)
CREATE TABLE public.general_leads_buy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER UNIQUE,
  general_leads_legacy_id INTEGER,
  user_legacy_id INTEGER,
  status lead_status DEFAULT 'purchased',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Client Subscriptions table
CREATE TABLE public.client_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER UNIQUE,
  client_legacy_id INTEGER,
  subscription_amount TEXT,
  subscription_type TEXT,
  subscription_date TIMESTAMPTZ,
  actual_subscription_date DATE,
  subscription_tenure TEXT,
  subscription_exist BOOLEAN DEFAULT false,
  subscription_closed BOOLEAN DEFAULT false,
  remaining_days INTEGER,
  remaining_month INTEGER,
  actual_subscription_start_date DATE,
  actual_subscription_end_date DATE,
  subscription_closed_on DATE,
  subscribed_month TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Planner Subscriptions table
CREATE TABLE public.planner_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER UNIQUE,
  user_legacy_id INTEGER,
  team_legacy_id INTEGER,
  subscription_amount DECIMAL(10,2),
  subscription_type TEXT,
  subscription_date TIMESTAMPTZ,
  actual_subscription_date DATE,
  actual_subscription_end_date DATE,
  subscription_tenure TEXT,
  subscribed_month TEXT,
  remaining_days INTEGER,
  actual_remaining_days_counter INTEGER,
  remaining_month INTEGER,
  subscription_closed_on DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. App Links table
CREATE TABLE public.app_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id INTEGER UNIQUE,
  name TEXT,
  mobile TEXT,
  type_request TEXT,
  enquired_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.team_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_buyleads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_leadform ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_leads_buy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_links ENABLE ROW LEVEL SECURITY;

-- Create app_role enum for role-based access
CREATE TYPE public.app_role AS ENUM ('admin', 'vertical-head', 'manager', 'team-lead', 'associate');

-- Create user_roles table (security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for team_users (admin only read)
CREATE POLICY "Authenticated users can view team users"
  ON public.team_users FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins can manage team users"
  ON public.team_users FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for planners
CREATE POLICY "Authenticated users can view planners"
  ON public.planners FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins can manage planners"
  ON public.planners FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for general_leads
CREATE POLICY "Authenticated users can view leads"
  ON public.general_leads FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage leads"
  ON public.general_leads FOR ALL
  TO authenticated USING (true);

-- RLS Policies for custom_buyleads
CREATE POLICY "Authenticated users can view custom buyleads"
  ON public.custom_buyleads FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage custom buyleads"
  ON public.custom_buyleads FOR ALL
  TO authenticated USING (true);

-- RLS Policies for chat_leadform
CREATE POLICY "Authenticated users can view chat leadform"
  ON public.chat_leadform FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage chat leadform"
  ON public.chat_leadform FOR ALL
  TO authenticated USING (true);

-- RLS Policies for general_leads_buy
CREATE POLICY "Authenticated users can view lead purchases"
  ON public.general_leads_buy FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage lead purchases"
  ON public.general_leads_buy FOR ALL
  TO authenticated USING (true);

-- RLS Policies for subscriptions
CREATE POLICY "Authenticated users can view client subscriptions"
  ON public.client_subscriptions FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins can manage client subscriptions"
  ON public.client_subscriptions FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view planner subscriptions"
  ON public.planner_subscriptions FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins can manage planner subscriptions"
  ON public.planner_subscriptions FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for app_links
CREATE POLICY "Authenticated users can view app links"
  ON public.app_links FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage app links"
  ON public.app_links FOR ALL
  TO authenticated USING (true);

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_general_leads_legacy_id ON public.general_leads(legacy_id);
CREATE INDEX idx_general_leads_status ON public.general_leads(status);
CREATE INDEX idx_general_leads_city ON public.general_leads(city);
CREATE INDEX idx_planners_legacy_id ON public.planners(legacy_id);
CREATE INDEX idx_planners_city ON public.planners(city);
CREATE INDEX idx_custom_buyleads_legacy_id ON public.custom_buyleads(legacy_id);
CREATE INDEX idx_chat_leadform_legacy_id ON public.chat_leadform(legacy_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_team_users_updated_at BEFORE UPDATE ON public.team_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_planners_updated_at BEFORE UPDATE ON public.planners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_general_leads_updated_at BEFORE UPDATE ON public.general_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_buyleads_updated_at BEFORE UPDATE ON public.custom_buyleads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_leadform_updated_at BEFORE UPDATE ON public.chat_leadform
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_subscriptions_updated_at BEFORE UPDATE ON public.client_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_planner_subscriptions_updated_at BEFORE UPDATE ON public.planner_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();