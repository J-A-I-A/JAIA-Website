import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../types/profile';
import {
  User, MapPin, Search, Filter, Award,
  ExternalLink, Linkedin, Github,
  Edit, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
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
      case 'supporting': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'organizational': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'student': return 'bg-lime text-black';
      default: return 'bg-white/10 text-white/60';
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
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-lime animate-spin" />
          <div className="mono text-lime/50 text-[10px] uppercase tracking-widest animate-pulse">
            Accessing_Directory...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-white relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      <div className="relative z-10 flex-1 pt-28 pb-12">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[1px] bg-lime" />
              <span className="mono text-[10px] font-bold uppercase tracking-[0.3em] text-lime">Member_Database</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              MEMBER<br />DIRECTORY
            </h1>
            <p className="mono text-xs text-white/50 tracking-widest">
              Active_Nodes: <span className="text-lime">{profiles.length}</span>
            </p>
          </div>

          {/* Profile Settings Banner for Logged-in Users */}
          {user && currentUserProfile && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="glass-panel p-6 border-lime/20 bg-lime/5 rounded-[1.5rem] flex flex-col md:flex-row gap-6 items-center">
                <div className="flex items-center gap-4 flex-grow w-full md:w-auto">
                  <div className="flex-shrink-0">
                    {currentUserProfile.avatar_url ? (
                      <img
                        src={currentUserProfile.avatar_url}
                        alt={currentUserProfile.full_name || 'Profile'}
                        className="w-14 h-14 object-cover rounded-full ring-2 ring-lime/30"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-lime/10 flex items-center justify-center border border-lime/30">
                        <User size={24} className="text-lime" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-lg text-white uppercase tracking-tight">
                      {currentUserProfile.full_name || 'Complete your profile'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono tracking-widest mt-1">
                      {currentUserProfile.show_in_directory ? (
                        <span className="flex items-center gap-1 text-lime">
                          <CheckCircle2 size={12} />
                          VISIBLE
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-white/40">
                          <EyeOff size={12} />
                          HIDDEN
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    onClick={toggleDirectoryVisibility}
                    className="flex-1 md:flex-none border-lime/30 text-lime hover:bg-lime/10 font-mono text-[10px] uppercase tracking-widest h-10"
                  >
                    {currentUserProfile.show_in_directory ? (
                      <><EyeOff size={14} className="mr-2" /> HIDE_PROFILE</>
                    ) : (
                      <><Eye size={14} className="mr-2" /> SHOW_PROFILE</>
                    )}
                  </Button>
                  <Button
                    onClick={() => navigate('/profile/edit')}
                    className="flex-1 md:flex-none bg-lime text-black hover:bg-white hover:text-black font-mono text-[10px] uppercase tracking-widest h-10 font-bold"
                  >
                    <Edit size={14} className="mr-2" /> EDIT_DATA
                  </Button>
                </div>
              </div>

              {(!currentUserProfile.full_name || !currentUserProfile.bio || !currentUserProfile.job_title || (currentUserProfile.skills?.length || 0) === 0) && (
                <div className="mt-4 p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-400 mt-0.5" />
                  <div className="text-xs font-mono text-red-400/80">
                    <span className="font-bold text-red-400">INCOMPLETE_DATA:</span>
                    missing details may affect visibility.
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Filters */}
          <div className="glass-panel p-6 mb-8 rounded-[1.5rem] border-white/5">
            <div className="flex items-center gap-2 mb-6">
              <Filter size={16} className="text-lime" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">FILTER_DATABASE</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <Input
                    type="text"
                    placeholder="Search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-lime rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:border-lime outline-none appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <option value="all" className="bg-charcoal">ALL_TIERS</option>
                  <option value="individual" className="bg-charcoal">INDIVIDUAL</option>
                  <option value="student" className="bg-charcoal">STUDENT</option>
                  <option value="organizational" className="bg-charcoal">ORGANIZATIONAL</option>
                  <option value="supporting" className="bg-charcoal">SUPPORTING</option>
                </select>
              </div>

              <div>
                <select
                  value={filterMentor}
                  onChange={(e) => setFilterMentor(e.target.value)}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:border-lime outline-none appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <option value="all" className="bg-charcoal">ALL_MEMBERS</option>
                  <option value="mentor" className="bg-charcoal">MENTORS</option>
                  <option value="seeking" className="bg-charcoal">SEEKING_MENTOR</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/5">
              <label className="flex items-center gap-3 text-xs font-mono text-white/60 cursor-pointer hover:text-white transition-colors select-none">
                <input
                  type="checkbox"
                  checked={filterOpportunities === 'open'}
                  onChange={(e) => setFilterOpportunities(e.target.checked ? 'open' : 'all')}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-lime checked:border-lime accent-lime"
                />
                OPEN_TO_OPPORTUNITIES
              </label>

              {(searchQuery || filterTier !== 'all' || filterMentor !== 'all' || filterOpportunities !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="ml-auto text-[10px] font-mono text-white/40 hover:text-lime underline decoration-lime/30 underline-offset-4 uppercase tracking-widest"
                >
                  RESET_FILTERS
                </button>
              )}
            </div>
          </div>

          {/* Profile Grid */}
          {filteredProfiles.length === 0 ? (
            <div className="glass-panel p-12 text-center border-white/5 rounded-[1.5rem]">
              <p className="text-white/30 font-mono text-sm uppercase tracking-widest">NO_DATA_FOUND</p>
              <button onClick={clearFilters} className="mt-4 text-lime text-xs font-bold uppercase tracking-widest hover:underline">
                RESET_FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile, idx) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="glass-panel p-6 bg-white/5 hover:bg-white/[0.07] border-white/5 hover:border-lime/30 transition-all duration-300 rounded-[1.5rem] group h-full flex flex-col relative overflow-hidden">
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-lime/5 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          {profile.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.full_name || 'Profile'}
                              className="w-14 h-14 object-cover rounded-full ring-1 ring-white/10 group-hover:ring-lime/50 transition-all"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-lime/30 transition-colors">
                              <User size={20} className="text-white/20 group-hover:text-lime transition-colors" />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow min-w-0 pt-1">
                          <h3 className="font-bold text-lg text-white truncate group-hover:text-lime transition-colors leading-tight mb-1">
                            {profile.full_name || 'Anonymous Member'}
                          </h3>
                          {profile.job_title && (
                            <p className="text-xs text-white/40 line-clamp-2 md:line-clamp-1">
                              {profile.job_title}
                              {profile.company && <span className="text-white/20"> @ {profile.company}</span>}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider font-bold ${getMembershipBadgeColor(profile.membership_tier)}`}>
                          {profile.membership_tier.slice(0, 3).toUpperCase()}
                        </span>
                        {profile.is_mentor && (
                          <span className="px-2 py-1 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                            <Award size={10} />
                            MENTOR
                          </span>
                        )}
                        {profile.open_to_opportunities && (
                          <span className="px-2 py-1 rounded text-[10px] font-mono bg-lime/10 text-lime border border-lime/20">
                            OPEN
                          </span>
                        )}
                      </div>

                      {profile.location && (
                        <p className="text-xs text-white/40 flex items-center gap-1 mb-4 font-mono uppercase tracking-wider">
                          <MapPin size={12} />
                          {profile.location}
                        </p>
                      )}

                      {profile.bio && (
                        <p className="text-xs text-white/50 line-clamp-3 mb-6 leading-relaxed flex-grow">
                          {profile.bio}
                        </p>
                      )}

                      <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-2">
                          {profile.linkedin_url && (
                            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[#0077b5] transition-colors"><Linkedin size={16} /></a>
                          )}
                          {profile.github_url && (
                            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors"><Github size={16} /></a>
                          )}
                          {profile.portfolio_url && (
                            <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-lime transition-colors"><ExternalLink size={16} /></a>
                          )}
                        </div>

                        {/* Skills Count */}
                        {profile.skills && profile.skills.length > 0 && (
                          <div className="text-[10px] mono text-white/20">
                            {profile.skills.length} SKILLS
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
