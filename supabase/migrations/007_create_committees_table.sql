-- Create committees table for managing JAIA committees and working groups
-- This table stores all committees and their members

CREATE TABLE IF NOT EXISTS public.committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Committee information
    name TEXT NOT NULL,
    description TEXT,
    purpose TEXT,
    
    -- Committee type and status
    committee_type TEXT CHECK (committee_type IN ('standing', 'ad-hoc', 'working-group', 'task-force', 'board')) DEFAULT 'standing',
    status TEXT CHECK (status IN ('active', 'inactive', 'archived')) DEFAULT 'active',
    
    -- Leadership
    chair_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    co_chair_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Committee details
    meeting_frequency TEXT,
    meeting_day TEXT,
    meeting_time TIME,
    meeting_url TEXT,
    
    -- Display settings
    is_public BOOLEAN DEFAULT TRUE,
    display_order INTEGER,
    
    -- Metadata
    formed_date DATE,
    dissolved_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create committee members junction table
CREATE TABLE IF NOT EXISTS public.committee_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_id UUID NOT NULL REFERENCES public.committees(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Member role in committee
    role TEXT CHECK (role IN ('chair', 'co-chair', 'member', 'secretary', 'advisor')) DEFAULT 'member',
    
    -- Membership details
    joined_date DATE DEFAULT CURRENT_DATE,
    left_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique member per committee
    UNIQUE(committee_id, member_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS committees_status_idx ON public.committees(status);
CREATE INDEX IF NOT EXISTS committees_committee_type_idx ON public.committees(committee_type);
CREATE INDEX IF NOT EXISTS committees_is_public_idx ON public.committees(is_public);
CREATE INDEX IF NOT EXISTS committees_display_order_idx ON public.committees(display_order);

CREATE INDEX IF NOT EXISTS committee_members_committee_id_idx ON public.committee_members(committee_id);
CREATE INDEX IF NOT EXISTS committee_members_member_id_idx ON public.committee_members(member_id);
CREATE INDEX IF NOT EXISTS committee_members_is_active_idx ON public.committee_members(is_active);

-- Enable Row Level Security
ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for committees
DROP POLICY IF EXISTS "Public committees are viewable by everyone" ON public.committees;
DROP POLICY IF EXISTS "Admins can view all committees" ON public.committees;
DROP POLICY IF EXISTS "Admins can manage committees" ON public.committees;

CREATE POLICY "Public committees are viewable by everyone"
    ON public.committees FOR SELECT
    USING (is_public = true AND status = 'active');

CREATE POLICY "Admins can view all committees"
    ON public.committees FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can manage committees"
    ON public.committees FOR ALL
    USING (public.is_admin());

-- RLS Policies for committee_members
DROP POLICY IF EXISTS "Public committee members are viewable" ON public.committee_members;
DROP POLICY IF EXISTS "Members can view their own memberships" ON public.committee_members;
DROP POLICY IF EXISTS "Admins can manage committee members" ON public.committee_members;

CREATE POLICY "Public committee members are viewable"
    ON public.committee_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.committees 
            WHERE committees.id = committee_members.committee_id 
            AND committees.is_public = true
            AND committees.status = 'active'
        )
    );

CREATE POLICY "Members can view their own memberships"
    ON public.committee_members FOR SELECT
    USING (member_id = auth.uid());

CREATE POLICY "Admins can manage committee members"
    ON public.committee_members FOR ALL
    USING (public.is_admin());

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_committees_updated_at ON public.committees;
CREATE TRIGGER set_committees_updated_at
    BEFORE UPDATE ON public.committees
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_committee_members_updated_at ON public.committee_members;
CREATE TRIGGER set_committee_members_updated_at
    BEFORE UPDATE ON public.committee_members
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT SELECT ON public.committees TO authenticated, anon;
GRANT ALL ON public.committees TO authenticated;
GRANT SELECT ON public.committee_members TO authenticated, anon;
GRANT ALL ON public.committee_members TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.committees IS 'Stores JAIA committees, working groups, and task forces';
COMMENT ON TABLE public.committee_members IS 'Junction table linking members to committees';
COMMENT ON COLUMN public.committees.committee_type IS 'Type of committee: standing, ad-hoc, working-group, task-force, or board';
COMMENT ON COLUMN public.committees.is_public IS 'Whether committee information is publicly visible';
COMMENT ON COLUMN public.committee_members.role IS 'Member''s role within the committee';

