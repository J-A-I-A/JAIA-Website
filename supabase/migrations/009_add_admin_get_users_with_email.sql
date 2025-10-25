-- Create a function for admins to get user profiles with email addresses
-- This function joins profiles with auth.users to include email
-- SECURITY: Only callable by admins due to RLS check at the start

CREATE OR REPLACE FUNCTION public.admin_get_users_with_email()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  country TEXT,
  membership_tier membership_tier,
  membership_status membership_status,
  joined_date TIMESTAMPTZ,
  membership_expiry_date TIMESTAMPTZ,
  job_title TEXT,
  company TEXT,
  industry TEXT,
  years_of_experience INTEGER,
  resume_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  skills TEXT[],
  interests TEXT[],
  is_mentor BOOLEAN,
  mentor_areas TEXT[],
  seeking_mentor BOOLEAN,
  seeking_mentor_in TEXT[],
  open_to_opportunities BOOLEAN,
  profile_visibility profile_visibility,
  show_in_directory BOOLEAN,
  show_resume_to_employers BOOLEAN,
  show_phone_to_members BOOLEAN,
  organization_name TEXT,
  organization_size TEXT,
  organization_industry TEXT,
  organization_website TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  email TEXT
) AS $$
BEGIN
  -- Check if the current user is an admin
  -- If not, this function will return no rows (secure by default)
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can access this function';
  END IF;

  -- Return all profiles joined with email from auth.users
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.phone,
    p.location,
    p.country,
    p.membership_tier,
    p.membership_status,
    p.joined_date,
    p.membership_expiry_date,
    p.job_title,
    p.company,
    p.industry,
    p.years_of_experience,
    p.resume_url,
    p.linkedin_url,
    p.github_url,
    p.portfolio_url,
    p.skills,
    p.interests,
    p.is_mentor,
    p.mentor_areas,
    p.seeking_mentor,
    p.seeking_mentor_in,
    p.open_to_opportunities,
    p.profile_visibility,
    p.show_in_directory,
    p.show_resume_to_employers,
    p.show_phone_to_members,
    p.organization_name,
    p.organization_size,
    p.organization_industry,
    p.organization_website,
    p.is_admin,
    p.created_at,
    p.updated_at,
    au.email::TEXT as email
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
-- (The function itself checks for admin status)
GRANT EXECUTE ON FUNCTION public.admin_get_users_with_email() TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.admin_get_users_with_email() IS 
'Returns all user profiles with email addresses. Only accessible by admin users. Used by the admin dashboard.';

