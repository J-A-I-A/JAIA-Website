-- Fix foreign key relationships in admin_audit_log table
-- admin_id should reference profiles(id), not auth.users(id)
-- This allows Supabase PostgREST to properly join with profiles table

-- Drop existing foreign key constraint on admin_id
ALTER TABLE public.admin_audit_log
DROP CONSTRAINT IF EXISTS admin_audit_log_admin_id_fkey;

-- Add correct foreign key constraint
ALTER TABLE public.admin_audit_log
ADD CONSTRAINT admin_audit_log_admin_id_fkey
FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Verify target_user_id constraint is correct (it should already be)
-- This is just to be explicit
ALTER TABLE public.admin_audit_log
DROP CONSTRAINT IF EXISTS admin_audit_log_target_user_id_fkey;

ALTER TABLE public.admin_audit_log
ADD CONSTRAINT admin_audit_log_target_user_id_fkey
FOREIGN KEY (target_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

