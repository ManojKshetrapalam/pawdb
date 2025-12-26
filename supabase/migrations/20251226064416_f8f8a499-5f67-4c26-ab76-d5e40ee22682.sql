-- Remove unique constraint on email column in team_users table
ALTER TABLE public.team_users DROP CONSTRAINT IF EXISTS team_users_email_key;