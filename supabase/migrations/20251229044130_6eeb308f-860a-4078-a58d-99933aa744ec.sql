-- Add is_active column to team_users table
ALTER TABLE public.team_users ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Update existing records to be active
UPDATE public.team_users SET is_active = true WHERE is_active IS NULL;