-- Drop existing restrictive SELECT policies and recreate as permissive

-- team_users
DROP POLICY IF EXISTS "Authenticated users can view team users" ON public.team_users;
CREATE POLICY "Anyone can view team users" ON public.team_users FOR SELECT USING (true);

-- planners
DROP POLICY IF EXISTS "Authenticated users can view planners" ON public.planners;
CREATE POLICY "Anyone can view planners" ON public.planners FOR SELECT USING (true);

-- general_leads
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.general_leads;
CREATE POLICY "Anyone can view leads" ON public.general_leads FOR SELECT USING (true);

-- custom_buyleads
DROP POLICY IF EXISTS "Authenticated users can view custom buyleads" ON public.custom_buyleads;
CREATE POLICY "Anyone can view custom buyleads" ON public.custom_buyleads FOR SELECT USING (true);

-- chat_leadform
DROP POLICY IF EXISTS "Authenticated users can view chat leadform" ON public.chat_leadform;
CREATE POLICY "Anyone can view chat leadform" ON public.chat_leadform FOR SELECT USING (true);

-- general_leads_buy
DROP POLICY IF EXISTS "Authenticated users can view lead purchases" ON public.general_leads_buy;
CREATE POLICY "Anyone can view lead purchases" ON public.general_leads_buy FOR SELECT USING (true);

-- client_subscriptions
DROP POLICY IF EXISTS "Authenticated users can view client subscriptions" ON public.client_subscriptions;
CREATE POLICY "Anyone can view client subscriptions" ON public.client_subscriptions FOR SELECT USING (true);

-- planner_subscriptions
DROP POLICY IF EXISTS "Authenticated users can view planner subscriptions" ON public.planner_subscriptions;
CREATE POLICY "Anyone can view planner subscriptions" ON public.planner_subscriptions FOR SELECT USING (true);

-- app_links
DROP POLICY IF EXISTS "Authenticated users can view app links" ON public.app_links;
CREATE POLICY "Anyone can view app links" ON public.app_links FOR SELECT USING (true);