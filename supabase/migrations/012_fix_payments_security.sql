-- Fix critical security issues in payments table
-- 1. Fix foreign key reference to use proper schema
-- 2. Enable Row Level Security
-- 3. Add proper RLS policies

-- ============================================
-- 1. FIX FOREIGN KEY REFERENCE
-- ============================================

-- Drop existing foreign key constraint if it exists
ALTER TABLE public.payments
DROP CONSTRAINT IF EXISTS payments_user_id_fkey;

-- Add correct foreign key constraint with explicit schema reference
ALTER TABLE public.payments
ADD CONSTRAINT payments_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE RLS POLICIES
-- ============================================

-- Drop any existing policies (in case of re-running migration)
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can insert payments" ON public.payments;

-- Users can only view their own payment records
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all payment records
CREATE POLICY "Admins can view all payments"
    ON public.payments FOR SELECT
    USING (public.is_admin());

-- Only admins can insert payment records
-- (Alternatively, use service role key for automated webhook insertions)
CREATE POLICY "Admins can insert payments"
    ON public.payments FOR INSERT
    WITH CHECK (public.is_admin());

-- NOTE: No UPDATE or DELETE policies
-- Payment records should be immutable for audit/compliance purposes
-- If corrections are needed, insert a new record or have admins do manual DB operations

-- ============================================
-- 4. GRANT APPROPRIATE PERMISSIONS
-- ============================================

-- Grant SELECT to authenticated users (filtered by RLS)
GRANT SELECT ON public.payments TO authenticated;

-- Grant INSERT to authenticated users (but RLS restricts to admins only)
GRANT INSERT ON public.payments TO authenticated;

-- ============================================
-- 5. ADD INDEX FOR USER LOOKUPS (if not exists)
-- ============================================

-- These were in the original migration, but ensuring they exist
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- ============================================
-- 6. ADD DOCUMENTATION COMMENTS
-- ============================================

COMMENT ON TABLE public.payments IS 'Stores Fygaro membership payment records. RLS ensures users can only view their own payments. Payments are immutable (no updates/deletes).';
COMMENT ON COLUMN public.payments.transaction_id IS 'Unique transaction identifier from payment processor. Used for idempotency.';
COMMENT ON COLUMN public.payments.status IS 'Payment status: completed, pending, failed, refunded';
COMMENT ON COLUMN public.payments.user_id IS 'References the user who made the payment. NULL for guest/anonymous payments.';

