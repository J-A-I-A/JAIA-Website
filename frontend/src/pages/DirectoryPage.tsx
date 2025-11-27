import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../types/profile';
import { 
  User, MapPin, Search, Filter, Award, 
  ExternalLink, Linkedin, Github, Sparkles,
  Edit, Eye, EyeOff, CheckCircle2, AlertCircle, Users
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Footer } from '../components/sections/Footer';

export function DirectoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterMentor, setFilterMentor] = useState<string>('all');
  const [filterOpportunities, setFilterOpportunities] = useState<string>('all');
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
    if (user) {
      fetchCurrentUserProfile();
    }
  }, [user]);

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

  const fetchCurrentUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setCurrentUserProfile(data);
    } catch (error) {
      console.error('Error fetching current user profile:', error);
    }
  };

  const toggleDirectoryVisibility = async () => {
    if (!user || !currentUserProfile) return;
    
    try {
      const newVisibility = !currentUserProfile.show_in_directory;
      const { error } = await supabase
        .from('profiles')
        .update({ show_in_directory: newVisibility })
        .eq('id', user.id);

      if (error) throw error;
      
      setCurrentUserProfile({ ...currentUserProfile, show_in_directory: newVisibility });
      fetchProfiles();
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...profiles];

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

    if (filterTier !== 'all') {
      filtered = filtered.filter(profile => profile.membership_tier === filterTier);
    }

    if (filterMentor === 'mentor') {
      filtered = filtered.filter(profile => profile.is_mentor);
    } else if (filterMentor === 'seeking') {
      filtered = filtered.filter(profile => profile.seeking_mentor);
    }

    if (filterOpportunities === 'open') {
      filtered = filtered.filter(profile => profile.open_to_opportunities);
    }

    setFilteredProfiles(filtered);
  };

  const getMembershipBadgeColor = (tier: string) => {
    switch (tier) {
      case 'supporting': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'organizational': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'student': return 'bg-gradient-to-r from-jaia-green to-emerald-500';
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
      <div className="min-h-screen bg-jaia-black pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center gap-2 text-jaia-gold font-mono text-sm animate-pulse justify-center">
            <span>&gt; FETCHING_MEMBER_DATA</span>
            <span className="inline-block w-2 h-4 bg-jaia-gold"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jaia-black flex flex-col">
      <div className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-jaia-green" />
              <span className="font-mono text-jaia-green text-xs tracking-widest">MEMBER_DATABASE</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
              MEMBER <span className="text-jaia-green">DIRECTORY</span>
            </h1>
            <p className="text-lg text-gray-400 font-sans">
              Connect with <span className="text-jaia-gold font-mono">{profiles.length}</span> active members of the JAIA community
            </p>
          </div>

          {/* Profile Settings Banner for Logged-in Users */}
          {user && currentUserProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 mb-8 bg-jaia-green/5 border-jaia-green/30">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-grow">
                    <div className="flex-shrink-0">
                      {currentUserProfile.avatar_url ? (
                        <img 
                          src={currentUserProfile.avatar_url} 
                          alt={currentUserProfile.full_name || 'Profile'} 
                          className="w-14 h-14 object-cover ring-2 ring-jaia-green/30 clip-corner"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-jaia-gold to-jaia-green flex items-center justify-center clip-corner">
                          <User size={24} className="text-jaia-black" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="font-display font-bold text-lg text-white">
                        {currentUserProfile.full_name || 'Complete your profile'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
                        {currentUserProfile.show_in_directory ? (
                          <span className="flex items-center gap-1 text-jaia-green text-xs">
                            <CheckCircle2 size={14} />
                            VISIBLE
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-jaia-gold text-xs">
                            <EyeOff size={14} />
                            HIDDEN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleDirectoryVisibility}
                      className="flex items-center gap-2 border-jaia-green/30 text-jaia-green hover:bg-jaia-green/10 font-mono text-xs"
                    >
                      {currentUserProfile.show_in_directory ? (
                        <>
                          <EyeOff size={14} />
                          HIDE
                        </>
                      ) : (
                        <>
                          <Eye size={14} />
                          SHOW
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => navigate('/profile/edit')}
                      className="flex items-center gap-2 bg-jaia-gold hover:bg-jaia-neonGold text-jaia-black font-mono text-xs"
                    >
                      <Edit size={14} />
                      EDIT_PROFILE
                    </Button>
                  </div>
                </div>

                {(!currentUserProfile.full_name || !currentUserProfile.bio || !currentUserProfile.job_title || (currentUserProfile.skills?.length || 0) === 0) && (
                  <div className="mt-4 pt-4 border-t border-jaia-green/20">
                    <div className="flex items-start gap-2 text-sm text-jaia-gold font-mono">
                      <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-bold">INCOMPLETE_PROFILE:</span>
                        <span className="text-gray-400 ml-1">
                          Missing: 
                          {!currentUserProfile.full_name && ' name,'}
                          {!currentUserProfile.bio && ' bio,'}
                          {!currentUserProfile.job_title && ' job_title,'}
                          {(currentUserProfile.skills?.length || 0) === 0 && ' skills'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Filters */}
          <Card className="p-6 mb-8 bg-white/5 border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={18} className="text-jaia-gold" />
              <h2 className="text-lg font-display font-bold text-white">FILTER_MEMBERS</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    type="text"
                    placeholder="Search by name, skills, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-jaia-black border-white/20 text-white placeholder:text-gray-500 focus:border-jaia-green font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="w-full h-10 px-3 bg-jaia-black border border-white/20 text-white text-sm font-mono focus:border-jaia-green outline-none"
                >
                  <option value="all">ALL_TIERS</option>
                  <option value="individual">INDIVIDUAL</option>
                  <option value="student">STUDENT</option>
                  <option value="organizational">ORGANIZATIONAL</option>
                  <option value="supporting">SUPPORTING</option>
                </select>
              </div>

              <div>
                <select
                  value={filterMentor}
                  onChange={(e) => setFilterMentor(e.target.value)}
                  className="w-full h-10 px-3 bg-jaia-black border border-white/20 text-white text-sm font-mono focus:border-jaia-green outline-none"
                >
                  <option value="all">ALL_MEMBERS</option>
                  <option value="mentor">MENTORS</option>
                  <option value="seeking">SEEKING_MENTOR</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <label className="flex items-center gap-2 text-sm font-mono text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOpportunities === 'open'}
                  onChange={(e) => setFilterOpportunities(e.target.checked ? 'open' : 'all')}
                  className="rounded bg-jaia-black border-white/20"
                />
                OPEN_TO_OPPORTUNITIES
              </label>
              
              {(searchQuery || filterTier !== 'all' || filterMentor !== 'all' || filterOpportunities !== 'all') && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="ml-auto border-white/20 text-gray-400 hover:text-white hover:border-white/40 font-mono text-xs"
                >
                  CLEAR_FILTERS
                </Button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm font-mono text-gray-500">
                SHOWING <span className="text-jaia-green">{filteredProfiles.length}</span> OF <span className="text-jaia-gold">{profiles.length}</span> MEMBERS
              </p>
            </div>
          </Card>

          {/* Profile Grid */}
          {filteredProfiles.length === 0 ? (
            <Card className="p-12 text-center bg-white/5 border-white/10">
              <p className="text-gray-400 font-mono">NO_MEMBERS_FOUND</p>
              <Button onClick={clearFilters} variant="outline" className="mt-4 border-jaia-green/30 text-jaia-green font-mono text-xs">
                CLEAR_FILTERS
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile, idx) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-6 bg-jaia-darkGrey/50 border-white/10 hover:border-jaia-green/30 transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {profile.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt={profile.full_name || 'Profile'} 
                            className="w-16 h-16 object-cover clip-corner"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-jaia-gold to-jaia-green flex items-center justify-center clip-corner">
                            <User size={28} className="text-jaia-black" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <h3 className="font-display font-bold text-lg text-white truncate group-hover:text-jaia-green transition-colors">
                          {profile.full_name || 'Anonymous Member'}
                        </h3>
                        {profile.job_title && (
                          <p className="text-sm text-gray-400 line-clamp-2 font-sans">
                            {profile.job_title}
                            {profile.company && ` @ ${profile.company}`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 text-white text-xs font-mono ${getMembershipBadgeColor(profile.membership_tier)}`}>
                        {profile.membership_tier.toUpperCase()}
                      </span>
                      {profile.is_mentor && (
                        <span className="px-2 py-1 text-xs font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                          <Award size={12} />
                          MENTOR
                        </span>
                      )}
                      {profile.open_to_opportunities && (
                        <span className="px-2 py-1 text-xs font-mono bg-jaia-green/20 text-jaia-green border border-jaia-green/30">
                          OPEN
                        </span>
                      )}
                    </div>

                    {profile.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-3 font-mono">
                        <MapPin size={14} />
                        {profile.location}
                      </p>
                    )}

                    {profile.bio && (
                      <p className="text-sm text-gray-400 line-clamp-3 mb-4 font-sans">
                        {profile.bio}
                      </p>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-1 mb-2">
                          <Sparkles size={12} className="text-jaia-gold" />
                          <span className="text-xs font-mono text-gray-500">SKILLS</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.slice(0, 5).map((skill, index) => (
                            <span key={index} className="px-2 py-0.5 bg-jaia-gold/10 text-jaia-gold text-xs font-mono">
                              {skill}
                            </span>
                          ))}
                          {profile.skills.length > 5 && (
                            <span className="px-2 py-0.5 text-xs text-gray-500 font-mono">
                              +{profile.skills.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
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
                          className="p-2 bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
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
                          className="p-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                          title="Portfolio"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
