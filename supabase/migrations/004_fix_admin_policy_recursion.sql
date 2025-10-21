-- Fix infinite recursion in admin RLS policies
-- The issue: Admin policies were checking profiles table to see if user is admin,
-- but checking profiles table requires running through RLS policies (infinite loop)

-- Solution: Use a security definer function that bypasses RLS

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Recreate is_admin function with proper security settings to bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND is_admin = true
    );
END;
$$;

-- Create new admin policies using the security definer function
-- This avoids recursion because the function bypasses RLS
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

-- Also update the admin audit log policies to use the same pattern
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;

CREATE POLICY "Admins can view audit logs"
    ON public.admin_audit_log FOR SELECT
    USING (public.is_admin());

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

