-- Admin Security Hardening Migration
-- This migration addresses critical security vulnerabilities in the admin system

-- ============================================
-- 1. CREATE AUDIT LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_user_id UUID REFERENCES public.profiles(id),
    target_table TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient audit log queries
CREATE INDEX IF NOT EXISTS admin_audit_log_admin_id_idx ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_target_user_id_idx ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON public.admin_audit_log(created_at);

-- RLS for audit log (only admins can view audit logs)
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;
CREATE POLICY "Admins can view audit logs"
    ON public.admin_audit_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Grant permissions
GRANT SELECT ON public.admin_audit_log TO authenticated;

-- ============================================
-- 2. PREVENT SELF-ADMIN MODIFICATION
-- ============================================

-- This trigger prevents users from modifying their own admin status
-- and ensures only admins can grant/revoke admin privileges
CREATE OR REPLACE FUNCTION prevent_admin_privilege_escalation()
RETURNS TRIGGER AS $$
DECLARE
    is_current_user_admin BOOLEAN;
    is_self_modification BOOLEAN;
BEGIN
    -- Check if is_admin field is being changed
    IF OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
        
        -- Check if user is trying to modify their own admin status
        is_self_modification := (NEW.id = auth.uid());
        
        -- Check if the current user is an admin
        SELECT is_admin INTO is_current_user_admin
        FROM public.profiles 
        WHERE id = auth.uid();
        
        -- Prevent self-modification of admin status
        IF is_self_modification THEN
            RAISE EXCEPTION 'Security violation: Users cannot modify their own admin status';
        END IF;
        
        -- Ensure only admins can modify admin status of others
        IF NOT is_current_user_admin THEN
            RAISE EXCEPTION 'Security violation: Only admins can modify admin privileges';
        END IF;
        
        -- Log the admin privilege change
        INSERT INTO public.admin_audit_log (
            admin_id, 
            action, 
            target_user_id, 
            target_table,
            old_values, 
            new_values
        ) VALUES (
            auth.uid(),
            CASE 
                WHEN NEW.is_admin THEN 'GRANT_ADMIN'
                ELSE 'REVOKE_ADMIN'
            END,
            NEW.id,
            'profiles',
            jsonb_build_object('is_admin', OLD.is_admin),
            jsonb_build_object('is_admin', NEW.is_admin)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS enforce_admin_security ON public.profiles;
CREATE TRIGGER enforce_admin_security
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_admin_privilege_escalation();

-- ============================================
-- 3. ADD WITH CHECK CLAUSE TO PREVENT PRIVILEGE ESCALATION
-- ============================================

-- Update the "Users can update own profile" policy to prevent privilege escalation
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        -- Users cannot grant themselves admin privileges
        -- The is_admin field must remain unchanged from what it currently is
        auth.uid() = id 
        AND is_admin = (
            SELECT is_admin 
            FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

-- ============================================
-- 4. LOG ALL ADMIN UPDATES TO PROFILES
-- ============================================

-- Log when admins make changes to user profiles
CREATE OR REPLACE FUNCTION log_admin_profile_changes()
RETURNS TRIGGER AS $$
DECLARE
    is_admin_user BOOLEAN;
    changes JSONB;
BEGIN
    -- Check if the current user is an admin
    SELECT is_admin INTO is_admin_user
    FROM public.profiles 
    WHERE id = auth.uid();
    
    -- Only log if the user is an admin AND modifying someone else's profile
    IF is_admin_user AND auth.uid() != NEW.id THEN
        -- Build a changes object with only the fields that changed
        changes := jsonb_build_object(
            'full_name', CASE WHEN OLD.full_name IS DISTINCT FROM NEW.full_name 
                THEN jsonb_build_object('old', OLD.full_name, 'new', NEW.full_name) 
                ELSE NULL END,
            'membership_tier', CASE WHEN OLD.membership_tier IS DISTINCT FROM NEW.membership_tier 
                THEN jsonb_build_object('old', OLD.membership_tier, 'new', NEW.membership_tier) 
                ELSE NULL END,
            'membership_status', CASE WHEN OLD.membership_status IS DISTINCT FROM NEW.membership_status 
                THEN jsonb_build_object('old', OLD.membership_status, 'new', NEW.membership_status) 
                ELSE NULL END,
            'phone', CASE WHEN OLD.phone IS DISTINCT FROM NEW.phone 
                THEN jsonb_build_object('old', OLD.phone, 'new', NEW.phone) 
                ELSE NULL END,
            'location', CASE WHEN OLD.location IS DISTINCT FROM NEW.location 
                THEN jsonb_build_object('old', OLD.location, 'new', NEW.location) 
                ELSE NULL END
        );
        
        -- Remove null values from changes object
        changes := (SELECT jsonb_object_agg(key, value) 
                    FROM jsonb_each(changes) 
                    WHERE value IS NOT NULL);
        
        -- Only log if there were actual changes
        IF changes IS NOT NULL AND changes != '{}'::jsonb THEN
            INSERT INTO public.admin_audit_log (
                admin_id, 
                action, 
                target_user_id, 
                target_table,
                old_values, 
                new_values
            ) VALUES (
                auth.uid(),
                'UPDATE_PROFILE',
                NEW.id,
                'profiles',
                changes,
                changes
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for logging admin profile changes
DROP TRIGGER IF EXISTS log_admin_changes ON public.profiles;
CREATE TRIGGER log_admin_changes
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_admin_profile_changes();

-- ============================================
-- 5. CREATE HELPER FUNCTION FOR ADMIN COUNT
-- ============================================

-- Function to check total number of admins (useful for preventing lockout)
CREATE OR REPLACE FUNCTION count_admins()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.profiles WHERE is_admin = true)::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. ADD COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.admin_audit_log IS 'Audit trail for all admin actions. Records who did what and when.';
COMMENT ON COLUMN public.profiles.is_admin IS 'Admin flag. Can only be modified by other admins, never by the user themselves.';
COMMENT ON FUNCTION prevent_admin_privilege_escalation() IS 'Security function: Prevents users from elevating their own privileges or removing their own admin status.';
COMMENT ON FUNCTION log_admin_profile_changes() IS 'Audit function: Logs all profile changes made by administrators.';
COMMENT ON FUNCTION count_admins() IS 'Utility function: Returns total number of admin users in the system.';


