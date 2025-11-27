import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile, MemberProject } from '../types/profile';
import { 
  User, MapPin, Briefcase, GraduationCap, Link as LinkIcon, 
  Github, Linkedin, FileText, Mail, Phone, Edit, Sparkles,
  Building, Users, Calendar, Award, CreditCard, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<MemberProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchProfile();
    fetchProjects();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchProjects = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('member_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  const getMembershipBadgeColor = (tier: string) => {
    switch (tier) {
      case 'supporting': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'organizational': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'student': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || 'Profile'} 
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User size={48} className="text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile.full_name || 'No name set'}</h1>
                  {profile.job_title && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Briefcase size={18} />
                      {profile.job_title}
                      {profile.company && ` at ${profile.company}`}
                    </p>
                  )}
                </div>
                <Button onClick={() => navigate('/profile/edit')} className="flex items-center gap-2">
                  <Edit size={16} />
                  Edit Profile
                </Button>
              </div>

              {/* Membership Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-4 py-1 rounded-full text-white text-sm font-medium ${getMembershipBadgeColor(profile.membership_tier)}`}>
                  {profile.membership_tier.charAt(0).toUpperCase() + profile.membership_tier.slice(1)} Member
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  profile.membership_status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {profile.membership_status.charAt(0).toUpperCase() + profile.membership_status.slice(1)}
                </span>
                {profile.is_mentor && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1">
                    <Award size={14} />
                    Mentor
                  </span>
                )}
              </div>

              {/* Location & Contact */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {profile.location}
                  </span>
                )}
                {user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={16} />
                    {user.email}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={16} />
                    {profile.phone}
                  </span>
                )}
                {profile.joined_date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    Joined {new Date(profile.joined_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
            </div>
          )}

          {/* Links */}
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <Linkedin size={18} />
                LinkedIn
              </a>
            )}
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Github size={18} />
                GitHub
              </a>
            )}
            {profile.portfolio_url && (
              <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                <LinkIcon size={18} />
                Portfolio
              </a>
            )}
            {profile.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                <FileText size={18} />
                Resume
              </a>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={20} />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Projects</h2>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3">
                        {project.project_url && (
                          <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            View Project →
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            GitHub →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Mentorship */}
            {(profile.is_mentor || profile.seeking_mentor) && (
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <GraduationCap size={20} />
                  Mentorship
                </h2>
                {profile.is_mentor && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                      Available as Mentor
                    </p>
                    {profile.mentor_areas && profile.mentor_areas.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profile.mentor_areas.map((area, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {profile.seeking_mentor && (
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                      Seeking Mentor
                    </p>
                    {profile.seeking_mentor_in && profile.seeking_mentor_in.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profile.seeking_mentor_in.map((area, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* Membership Payment */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Membership
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {profile.membership_status === 'active' ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <AlertCircle size={16} className="text-yellow-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    profile.membership_status === 'active' 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {profile.membership_status === 'active' ? 'Active' : 'Pending Payment'}
                  </span>
                </div>
                {profile.membership_expiry_date && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expires: {new Date(profile.membership_expiry_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Annual membership: 100 JMD
                </p>
                {profile.membership_status !== 'active' && (
                  <Button
                    asChild
                    className="w-full mt-2"
                    variant="default"
                  >
                    <a
                      href={`${import.meta.env.VITE_FYGARO_PAYMENT_URL || '#'}?email=${encodeURIComponent(user?.email || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <CreditCard size={16} />
                      Pay Membership Dues
                    </a>
                  </Button>
                )}
                {profile.membership_status === 'active' && profile.membership_expiry_date && 
                  new Date(profile.membership_expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                  <Button
                    asChild
                    className="w-full mt-2"
                    variant="outline"
                  >
                    <a
                      href={`${import.meta.env.VITE_FYGARO_PAYMENT_URL || '#'}?email=${encodeURIComponent(user?.email || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <CreditCard size={16} />
                      Renew Membership
                    </a>
                  </Button>
                )}
              </div>
            </Card>

            {/* Career Status */}
            {profile.open_to_opportunities && (
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                  Open to Opportunities
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This member is actively seeking new opportunities
                </p>
              </Card>
            )}

            {/* Organization Info (if applicable) */}
            {profile.membership_tier === 'organizational' && profile.organization_name && (
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Building size={20} />
                  Organization
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{profile.organization_name}</p>
                  {profile.organization_industry && (
                    <p className="text-gray-600 dark:text-gray-400">{profile.organization_industry}</p>
                  )}
                  {profile.organization_size && (
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Users size={14} />
                      {profile.organization_size}
                    </p>
                  )}
                  {profile.organization_website && (
                    <a href={profile.organization_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      <LinkIcon size={14} />
                      Website
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

