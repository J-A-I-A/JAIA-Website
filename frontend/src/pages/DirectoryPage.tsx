import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile';
import { 
  User, MapPin, Briefcase, Search, Filter, Award, 
  ExternalLink, Linkedin, Github, Mail, Sparkles
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';

export function DirectoryPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterMentor, setFilterMentor] = useState<string>('all');
  const [filterOpportunities, setFilterOpportunities] = useState<string>('all');

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [profiles, searchQuery, filterTier, filterMentor, filterOpportunities]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('show_in_directory', true)
        .eq('membership_status', 'active')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...profiles];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(profile => {
        const searchFields = [
          profile.full_name,
          profile.job_title,
          profile.company,
          profile.bio,
          profile.location,
          ...(profile.skills || []),
          ...(profile.interests || [])
        ].filter(Boolean).map(field => field?.toLowerCase());

        return searchFields.some(field => field?.includes(query));
      });
    }

    // Membership tier filter
    if (filterTier !== 'all') {
      filtered = filtered.filter(profile => profile.membership_tier === filterTier);
    }

    // Mentor filter
    if (filterMentor === 'mentor') {
      filtered = filtered.filter(profile => profile.is_mentor);
    } else if (filterMentor === 'seeking') {
      filtered = filtered.filter(profile => profile.seeking_mentor);
    }

    // Opportunities filter
    if (filterOpportunities === 'open') {
      filtered = filtered.filter(profile => profile.open_to_opportunities);
    }

    setFilteredProfiles(filtered);
  };

  const getMembershipBadgeColor = (tier: string) => {
    switch (tier) {
      case 'supporting': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'organizational': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'student': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterTier('all');
    setFilterMentor('all');
    setFilterOpportunities('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <p>Loading member directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Member Directory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Connect with {profiles.length} active members of the JAIA community
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h2 className="text-lg font-semibold">Filter Members</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search by name, skills, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Membership Tier */}
            <div>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Tiers</option>
                <option value="individual">Individual</option>
                <option value="student">Student</option>
                <option value="organizational">Organizational</option>
                <option value="supporting">Supporting</option>
              </select>
            </div>

            {/* Mentorship */}
            <div>
              <select
                value={filterMentor}
                onChange={(e) => setFilterMentor(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Members</option>
                <option value="mentor">Mentors</option>
                <option value="seeking">Seeking Mentors</option>
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filterOpportunities === 'open'}
                onChange={(e) => setFilterOpportunities(e.target.checked ? 'open' : 'all')}
                className="rounded"
              />
              Open to Opportunities
            </label>
            
            {(searchQuery || filterTier !== 'all' || filterMentor !== 'all' || filterOpportunities !== 'all') && (
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredProfiles.length} of {profiles.length} members
            </p>
          </div>
        </Card>

        {/* Profile Grid */}
        {filteredProfiles.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No members found matching your criteria.</p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Avatar & Name */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || 'Profile'} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <User size={28} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-lg truncate">
                      {profile.full_name || 'Anonymous Member'}
                    </h3>
                    {profile.job_title && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {profile.job_title}
                        {profile.company && ` at ${profile.company}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getMembershipBadgeColor(profile.membership_tier)}`}>
                    {profile.membership_tier.charAt(0).toUpperCase() + profile.membership_tier.slice(1)}
                  </span>
                  {profile.is_mentor && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1">
                      <Award size={12} />
                      Mentor
                    </span>
                  )}
                  {profile.open_to_opportunities && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Open to Opportunities
                    </span>
                  )}
                </div>

                {/* Location */}
                {profile.location && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-3">
                    <MapPin size={14} />
                    {profile.location}
                  </p>
                )}

                {/* Bio */}
                {profile.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {profile.bio}
                  </p>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Sparkles size={14} className="text-primary" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {profile.skills.length > 5 && (
                        <span className="px-2 py-0.5 text-xs text-gray-500">
                          +{profile.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Links */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="GitHub"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {profile.portfolio_url && (
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                      title="Portfolio"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

