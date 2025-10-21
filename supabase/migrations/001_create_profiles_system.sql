-- Create enum for membership tiers (if not exists)
DO $$ BEGIN
    CREATE TYPE membership_tier AS ENUM ('individual', 'student', 'organizational', 'supporting');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for membership status (if not exists)
DO $$ BEGIN
    CREATE TYPE membership_status AS ENUM ('active', 'pending', 'expired', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for profile visibility (if not exists)
DO $$ BEGIN
    CREATE TYPE profile_visibility AS ENUM ('public', 'members_only', 'private');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
    -- Primary identifiers
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    location TEXT,
    country TEXT,
    
    -- Membership Information
    membership_tier membership_tier DEFAULT 'individual',
    membership_status membership_status DEFAULT 'pending',
    joined_date TIMESTAMPTZ DEFAULT NOW(),
    membership_expiry_date TIMESTAMPTZ,
    
    -- Professional Information
    job_title TEXT,
    company TEXT,
    industry TEXT,
    years_of_experience INTEGER,
    
    -- Career & Portfolio Links
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    
    -- Skills & Interests (stored as arrays for simplicity, can be normalized later)
    skills TEXT[],
    interests TEXT[],
    
    -- Mentorship
    is_mentor BOOLEAN DEFAULT FALSE,
    mentor_areas TEXT[],
    seeking_mentor BOOLEAN DEFAULT FALSE,
    seeking_mentor_in TEXT[],
    
    -- Career Opportunities
    open_to_opportunities BOOLEAN DEFAULT FALSE,
    
    -- Visibility Settings
    profile_visibility profile_visibility DEFAULT 'members_only',
    show_in_directory BOOLEAN DEFAULT TRUE,
    show_resume_to_employers BOOLEAN DEFAULT FALSE,
    show_phone_to_members BOOLEAN DEFAULT FALSE,
    
    -- Organization-specific fields (for organizational tier members)
    organization_name TEXT,
    organization_size TEXT,
    organization_industry TEXT,
    organization_website TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create skills reference table (for autocomplete and standardization)
CREATE TABLE IF NOT EXISTS public.skills (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table (for showcasing member projects)
CREATE TABLE IF NOT EXISTS public.member_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    project_url TEXT,
    github_url TEXT,
    image_url TEXT,
    technologies TEXT[],
    start_date DATE,
    end_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS profiles_membership_tier_idx ON public.profiles(membership_tier);
CREATE INDEX IF NOT EXISTS profiles_membership_status_idx ON public.profiles(membership_status);
CREATE INDEX IF NOT EXISTS profiles_is_mentor_idx ON public.profiles(is_mentor);
CREATE INDEX IF NOT EXISTS profiles_open_to_opportunities_idx ON public.profiles(open_to_opportunities);
CREATE INDEX IF NOT EXISTS profiles_show_in_directory_idx ON public.profiles(show_in_directory);
CREATE INDEX IF NOT EXISTS profiles_show_phone_idx ON public.profiles(show_phone_to_members);
CREATE INDEX IF NOT EXISTS member_projects_user_id_idx ON public.member_projects(user_id);
CREATE INDEX IF NOT EXISTS skills_name_idx ON public.skills(name);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles (drop and recreate to avoid duplicates)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Members can view member profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Everyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (profile_visibility = 'public');

-- Authenticated users can view members_only profiles
CREATE POLICY "Members can view member profiles"
    ON public.profiles FOR SELECT
    USING (
        profile_visibility = 'members_only' 
        AND auth.role() = 'authenticated'
    );

-- Users can view their own profile regardless of visibility
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile (for manual creation if trigger fails)
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- RLS Policies for member_projects (drop and recreate to avoid duplicates)
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.member_projects;
DROP POLICY IF EXISTS "Members can view member projects" ON public.member_projects;
DROP POLICY IF EXISTS "Users can manage own projects" ON public.member_projects;

-- Public projects visible to all
CREATE POLICY "Public projects are viewable by everyone"
    ON public.member_projects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = member_projects.user_id 
            AND profiles.profile_visibility = 'public'
        )
    );

-- Members can view other members' projects
CREATE POLICY "Members can view member projects"
    ON public.member_projects FOR SELECT
    USING (auth.role() = 'authenticated');

-- Users can manage their own projects
CREATE POLICY "Users can manage own projects"
    ON public.member_projects FOR ALL
    USING (auth.uid() = user_id);

-- RLS Policies for skills (drop and recreate to avoid duplicates)
DROP POLICY IF EXISTS "Anyone can view skills" ON public.skills;
DROP POLICY IF EXISTS "Authenticated users can insert skills" ON public.skills;

-- Everyone can read skills (for autocomplete)
CREATE POLICY "Anyone can view skills"
    ON public.skills FOR SELECT
    TO authenticated, anon
    USING (true);

-- Only authenticated users can suggest new skills
CREATE POLICY "Authenticated users can insert skills"
    ON public.skills FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at (drop and recreate to avoid duplicates)
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS set_member_projects_updated_at ON public.member_projects;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_member_projects_updated_at
    BEFORE UPDATE ON public.member_projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create profile on signup (without setting email as name)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create profile on user signup (drop and recreate to avoid duplicates)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Insert some common skills for autocomplete (only if not already present)
INSERT INTO public.skills (name, category) VALUES
    -- AI/ML Skills
    ('Machine Learning', 'AI/ML'),
    ('Deep Learning', 'AI/ML'),
    ('Natural Language Processing', 'AI/ML'),
    ('Computer Vision', 'AI/ML'),
    ('TensorFlow', 'AI/ML'),
    ('PyTorch', 'AI/ML'),
    ('scikit-learn', 'AI/ML'),
    
    -- Programming Languages
    ('Python', 'Programming'),
    ('JavaScript', 'Programming'),
    ('TypeScript', 'Programming'),
    ('Java', 'Programming'),
    ('C++', 'Programming'),
    ('R', 'Programming'),
    ('SQL', 'Programming'),
    
    -- Web Development
    ('React', 'Web Development'),
    ('Node.js', 'Web Development'),
    ('Next.js', 'Web Development'),
    ('Vue.js', 'Web Development'),
    ('Angular', 'Web Development'),
    ('HTML/CSS', 'Web Development'),
    ('Tailwind CSS', 'Web Development'),
    
    -- Data Science
    ('Data Analysis', 'Data Science'),
    ('Data Visualization', 'Data Science'),
    ('Statistical Modeling', 'Data Science'),
    ('Pandas', 'Data Science'),
    ('NumPy', 'Data Science'),
    
    -- Cloud & DevOps
    ('AWS', 'Cloud/DevOps'),
    ('Azure', 'Cloud/DevOps'),
    ('Google Cloud', 'Cloud/DevOps'),
    ('Docker', 'Cloud/DevOps'),
    ('Kubernetes', 'Cloud/DevOps'),
    ('CI/CD', 'Cloud/DevOps'),
    
    -- Databases
    ('PostgreSQL', 'Databases'),
    ('MongoDB', 'Databases'),
    ('MySQL', 'Databases'),
    ('Redis', 'Databases'),
    
    -- Other
    ('API Development', 'Backend'),
    ('Mobile Development', 'Mobile'),
    ('UI/UX Design', 'Design'),
    ('Project Management', 'Management'),
    ('Agile/Scrum', 'Management')
ON CONFLICT (name) DO NOTHING;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.member_projects TO authenticated;
GRANT SELECT ON public.skills TO authenticated, anon;
GRANT INSERT ON public.skills TO authenticated;

