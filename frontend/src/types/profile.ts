// Profile type definitions
export type MembershipTier = 'individual' | 'student' | 'organizational' | 'supporting';
export type MembershipStatus = 'active' | 'pending' | 'expired' | 'cancelled';
export type ProfileVisibility = 'public' | 'members_only' | 'private';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  country: string | null;
  
  membership_tier: MembershipTier;
  membership_status: MembershipStatus;
  joined_date: string;
  membership_expiry_date: string | null;
  
  job_title: string | null;
  company: string | null;
  industry: string | null;
  years_of_experience: number | null;
  
  resume_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  
  skills: string[] | null;
  interests: string[] | null;
  
  is_mentor: boolean;
  mentor_areas: string[] | null;
  seeking_mentor: boolean;
  seeking_mentor_in: string[] | null;
  
  open_to_opportunities: boolean;
  
  profile_visibility: ProfileVisibility;
  show_in_directory: boolean;
  show_resume_to_employers: boolean;
  show_phone_to_members: boolean;
  
  organization_name: string | null;
  organization_size: string | null;
  organization_industry: string | null;
  organization_website: string | null;
  
  is_admin: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface MemberProject {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  project_url: string | null;
  github_url: string | null;
  image_url: string | null;
  technologies: string[] | null;
  start_date: string | null;
  end_date: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string | null;
  created_at: string;
}
