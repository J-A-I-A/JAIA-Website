import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    Users, Calendar, Clock, AlertCircle, Loader2, Shield,
    Brain, GraduationCap, Briefcase, Heart, Sparkles, ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Committee } from '@/types/committees';
import { Footer } from '@/components/sections/Footer';

interface CommitteeWithMembers extends Committee {
    member_count?: number;
    user_is_member?: boolean;
    user_has_pending_request?: boolean;
}

// Default committees
const DEFAULT_COMMITTEES: CommitteeWithMembers[] = [
    {
        id: '1',
        name: 'AI Ethics & Governance',
        description: 'Shaping responsible AI development and deployment in Jamaica',
        purpose: 'Develop ethical guidelines, policy recommendations, and governance frameworks for AI systems.',
        committee_type: 'standing',
        status: 'active',
        chair_id: null,
        co_chair_id: null,
        meeting_frequency: 'Monthly',
        meeting_day: 'First Tuesday',
        meeting_time: '6:00 PM',
        meeting_url: 'https://meet.jaia.ai/ethics',
        is_public: true,
        display_order: 1,
        formed_date: '2024-01-15',
        dissolved_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chair: { full_name: 'Dr. Sarah Chen' },
        member_count: 12,
    },
    {
        id: '2',
        name: 'Technical Research',
        description: 'Advancing AI research and development capabilities',
        purpose: 'Conduct cutting-edge research in machine learning, NLP, and computer vision.',
        committee_type: 'working-group',
        status: 'active',
        chair_id: null,
        co_chair_id: null,
        meeting_frequency: 'Bi-weekly',
        meeting_day: 'Wednesday',
        meeting_time: '7:00 PM',
        meeting_url: 'https://meet.jaia.ai/research',
        is_public: true,
        display_order: 2,
        formed_date: '2024-02-01',
        dissolved_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chair: { full_name: 'Marcus Thompson' },
        member_count: 18,
    },
    {
        id: '3',
        name: 'Education & Outreach',
        description: 'Democratizing AI education across Jamaica',
        purpose: 'Create educational programs, workshops, and resources to make AI accessible.',
        committee_type: 'standing',
        status: 'active',
        chair_id: null,
        co_chair_id: null,
        meeting_frequency: 'Monthly',
        meeting_day: 'Second Thursday',
        meeting_time: '5:30 PM',
        meeting_url: 'https://meet.jaia.ai/education',
        is_public: true,
        display_order: 3,
        formed_date: '2024-01-20',
        dissolved_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chair: { full_name: 'Prof. Lisa Morgan' },
        member_count: 15,
    },
    {
        id: '4',
        name: 'Industry Partnerships',
        description: 'Building bridges between AI innovation and business',
        purpose: 'Foster collaborations between JAIA members and industry partners.',
        committee_type: 'task-force',
        status: 'active',
        chair_id: null,
        co_chair_id: null,
        meeting_frequency: 'Monthly',
        meeting_day: 'Third Monday',
        meeting_time: '6:30 PM',
        meeting_url: null,
        is_public: true,
        display_order: 4,
        formed_date: '2024-03-01',
        dissolved_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chair: { full_name: 'James Williams' },
        member_count: 10,
    },
];

export function CommitteesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [committees] = useState<CommitteeWithMembers[]>(DEFAULT_COMMITTEES);
    const [requestingCommittee, setRequestingCommittee] = useState<string | null>(null);

    const handleJoinRequest = async (committeeId: string) => {
        if (!user) {
            navigate('/');
            return;
        }

        setRequestingCommittee(committeeId);

        try {
            const { error } = await supabase
                .from('committee_join_requests')
                .insert({
                    committee_id: committeeId,
                    user_id: user.id,
                    status: 'pending',
                    message: 'I would like to join this committee.',
                });

            if (error) throw error;

            alert('Your request to join has been submitted successfully!');
        } catch (error: any) {
            console.error('Error submitting join request:', error);
            alert(error.message || 'Failed to submit join request. Please try again.');
        } finally {
            setRequestingCommittee(null);
        }
    };

    const getCommitteeIcon = (name: string) => {
        if (name.includes('Ethics')) return Shield;
        if (name.includes('Research') || name.includes('Technical')) return Brain;
        if (name.includes('Education')) return GraduationCap;
        if (name.includes('Industry')) return Briefcase;
        if (name.includes('Community')) return Heart;
        if (name.includes('Student')) return Sparkles;
        return Users;
    };

    return (
        <div className="min-h-screen bg-charcoal text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-noise opacity-[0.03]" />
                <div className="absolute inset-0 bg-grid-white/[0.02]" />
            </div>

            <div className="relative z-10 pt-28 pb-12 px-6">
                <div className="container mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="mb-12 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-[1px] bg-lime" />
                                <span className="mono text-[10px] font-black uppercase tracking-[0.5em] text-lime">Active_Groups</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                                COMMITTEE<br />PROTOCOL
                            </h1>
                        </div>
                    </div>

                    {/* Security Alert / Login Warning */}
                    {!user && (
                        <div className="glass-panel p-6 mb-10 rounded-[1.5rem] border-lime/20 bg-lime/5 flex items-start gap-4 max-w-3xl mx-auto">
                            <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center border border-lime/30 shrink-0">
                                <AlertCircle className="text-lime w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">Authentication Required</h3>
                                <p className="text-white/60 mb-6 max-w-xl">
                                    Access to committee membership protocols requires a verified identity. Please identify yourself to proceed.
                                </p>
                                <Button
                                    onClick={() => navigate('/')}
                                    className="bg-lime text-black hover:bg-white hover:text-black font-black font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all"
                                >
                                    Login_System
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Committees List */}
                    <div className="space-y-4">
                        {committees.map((committee, idx) => {
                            const CommitteeIcon = getCommitteeIcon(committee.name);

                            return (
                                <motion.div
                                    key={committee.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="glass-panel p-6 md:p-8 rounded-[1.5rem] border-white/5 hover:border-lime/30 transition-all duration-500 overflow-hidden relative">
                                        {/* Hover Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-lime/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
                                            {/* Icon Identifier */}
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-lime group-hover:text-black group-hover:border-lime transition-all duration-500 text-white/20">
                                                    <CommitteeIcon strokeWidth={1} className="w-8 h-8" />
                                                </div>
                                                <div className="mt-4 mono text-[10px] text-white/20 uppercase tracking-widest group-hover:text-lime transition-colors">
                                                    ID: 00{idx + 1}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 justify-center md:justify-start">
                                                    <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] mono uppercase font-bold tracking-widest text-lime">
                                                        {committee.committee_type.replace('-', ' ')}
                                                    </div>
                                                    {committee.chair && (
                                                        <div className="mono text-[10px] text-white/40 uppercase tracking-widest">
                                                            Lead_Node: {committee.chair.full_name}
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter mb-3 group-hover:text-lime transition-colors">
                                                    {committee.name}
                                                </h3>

                                                <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8">
                                                    {committee.description}
                                                </p>

                                                <div className="flex flex-wrap justify-center md:justify-start gap-8 mono text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                    <span className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-lime" />
                                                        {committee.meeting_frequency}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <Clock size={14} className="text-lime" />
                                                        {committee.meeting_day} @ {committee.meeting_time}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <Users size={14} className="text-lime" />
                                                        {committee.member_count} Members
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <div className="shrink-0 w-full md:w-auto">
                                                <Button
                                                    onClick={() => handleJoinRequest(committee.id)}
                                                    disabled={!user || requestingCommittee === committee.id}
                                                    className="w-full md:w-auto bg-white/5 hover:bg-lime hover:text-black hover:border-lime border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-widest py-6 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                                                >
                                                    {requestingCommittee === committee.id ? (
                                                        <span className="flex items-center gap-2">
                                                            <Loader2 className="w-4 h-4 animate-spin" /> Process...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-4">
                                                            Request_Access <ArrowRight className="w-4 h-4 group-hover/btn:-rotate-45 transition-transform" />
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
