-- Fix planners table: change legacy_id to bigint and remove unique constraint
ALTER TABLE public.planners DROP CONSTRAINT IF EXISTS planners_legacy_id_key;
ALTER TABLE public.planners ALTER COLUMN legacy_id TYPE bigint;