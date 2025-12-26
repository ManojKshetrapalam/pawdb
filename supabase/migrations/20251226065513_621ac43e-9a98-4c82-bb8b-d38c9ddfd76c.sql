-- Fix chat_leadform table: change legacy_id to bigint, remove unique constraint, and fix mobile column type
ALTER TABLE public.chat_leadform DROP CONSTRAINT IF EXISTS chat_leadform_legacy_id_key;
ALTER TABLE public.chat_leadform ALTER COLUMN legacy_id TYPE bigint;

-- Change mobile column to text to handle phone numbers properly (they were being parsed as integers)
ALTER TABLE public.chat_leadform ALTER COLUMN mobile TYPE text;