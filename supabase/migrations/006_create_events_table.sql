-- Create events table for managing JAIA events and workshops
-- This table stores all events that will be displayed on the website

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic event information
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    
    -- Event type and category
    event_type TEXT CHECK (event_type IN ('workshop', 'meeting', 'conference', 'social', 'other')),
    category TEXT,
    
    -- Date and time
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    timezone TEXT DEFAULT 'America/Jamaica',
    
    -- Location details
    location_type TEXT CHECK (location_type IN ('in-person', 'virtual', 'hybrid')) DEFAULT 'virtual',
    location_name TEXT,
    location_address TEXT,
    location_url TEXT,
    
    -- Virtual meeting details
    meeting_platform TEXT,
    meeting_url TEXT,
    meeting_id TEXT,
    meeting_password TEXT,
    
    -- Event management
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    max_attendees INTEGER,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_url TEXT,
    registration_deadline TIMESTAMPTZ,
    
    -- Display settings
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    tags TEXT[],
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS events_start_date_idx ON public.events(start_date);
CREATE INDEX IF NOT EXISTS events_is_published_idx ON public.events(is_published);
CREATE INDEX IF NOT EXISTS events_is_featured_idx ON public.events(is_featured);
CREATE INDEX IF NOT EXISTS events_event_type_idx ON public.events(event_type);
CREATE INDEX IF NOT EXISTS events_organizer_id_idx ON public.events(organizer_id);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
DROP POLICY IF EXISTS "Published events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

-- Everyone can view published events
CREATE POLICY "Published events are viewable by everyone"
    ON public.events FOR SELECT
    USING (is_published = true);

-- Admins can view all events (including unpublished)
CREATE POLICY "Admins can view all events"
    ON public.events FOR SELECT
    USING (public.is_admin());

-- Admins can insert events
CREATE POLICY "Admins can insert events"
    ON public.events FOR INSERT
    WITH CHECK (public.is_admin());

-- Admins can update events
CREATE POLICY "Admins can update events"
    ON public.events FOR UPDATE
    USING (public.is_admin());

-- Admins can delete events
CREATE POLICY "Admins can delete events"
    ON public.events FOR DELETE
    USING (public.is_admin());

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT SELECT ON public.events TO authenticated, anon;
GRANT ALL ON public.events TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.events IS 'Stores JAIA events, workshops, meetings, and other activities';
COMMENT ON COLUMN public.events.location_type IS 'Whether the event is in-person, virtual, or hybrid';
COMMENT ON COLUMN public.events.is_published IS 'Only published events are visible to the public';
COMMENT ON COLUMN public.events.is_featured IS 'Featured events appear prominently on the homepage';

