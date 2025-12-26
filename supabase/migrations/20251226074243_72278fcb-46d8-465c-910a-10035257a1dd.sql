-- Drop unique constraint on custom_buyleads legacy_id to allow upserts
ALTER TABLE public.custom_buyleads DROP CONSTRAINT IF EXISTS custom_buyleads_legacy_id_key;