import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ArrowRight, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/events';
import { Footer } from '@/components/sections/Footer';

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*, organizer:profiles!organizer_id(full_name)')
        .eq('is_published', true)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start_date);
    const now = new Date();

    if (selectedFilter === 'upcoming') return eventDate >= now;
    if (selectedFilter === 'past') return eventDate < now;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear()
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-lime border-t-transparent animate-spin" />
          <div className="mono text-xs text-lime uppercase tracking-widest">Loading_Protocol...</div>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-[1px] bg-lime" />
                <span className="mono text-[10px] font-bold uppercase tracking-[0.3em] text-lime">Active_Transmissions</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                EVENT<br />PROTOCOL
              </h1>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 p-1 glass-panel rounded-full border-white/5">
              {(['upcoming', 'past', 'all'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-5 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${selectedFilter === filter
                    ? 'bg-lime text-black shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="glass-panel p-12 rounded-[1.5rem] text-center border-white/5">
                <p className="text-white/30 text-lg font-bold uppercase tracking-widest">No signals detected.</p>
              </div>
            ) : (
              filteredEvents.map((event, idx) => {
                const dateInfo = formatDate(event.start_date);
                const timeStr = formatTime(event.start_date);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative"
                  >
                    <div className="glass-panel p-6 md:p-8 rounded-[1.5rem] border-white/5 hover:border-lime/30 transition-all duration-300 overflow-hidden relative">
                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-lime/5 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
                        {/* Date */}
                        <div className="flex flex-col items-center shrink-0">
                          <span className="text-2xl md:text-4xl font-black text-transparent text-stroke-white group-hover:text-lime group-hover:text-stroke-0 transition-colors duration-300">
                            {dateInfo.day}
                          </span>
                          <span className="mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                            {dateInfo.month}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                          {event.organizer && (
                            <div className="mono text-[10px] text-lime uppercase tracking-widest mb-2">
                              Transmission_By: {event.organizer.full_name}
                            </div>
                          )}
                          <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter mb-3 group-hover:text-lime transition-colors">
                            {event.title}
                          </h3>

                          <div className="flex flex-wrap justify-center md:justify-start gap-6 mono text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <span className="flex items-center gap-2">
                              <MapPin size={14} className="text-lime" />
                              {/* TODO: Add location field to DB or assume Kingston for now if missing */}
                              Kingston_HQ
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock size={14} className="text-lime" />
                              {timeStr}
                            </span>
                            {event.max_attendees && (
                              <span className="flex items-center gap-2">
                                <Users size={14} className="text-lime" />
                                {event.max_attendees} slots
                              </span>
                            )}
                          </div>

                          {/* Description on Expand (Optional) or just always show brief */}
                          {event.description && (
                            <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-2xl line-clamp-2 group-hover:text-white/70 transition-colors">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* Action */}
                        <div className="shrink-0">
                          <Button
                            className="w-16 h-16 rounded-full bg-white/5 hover:bg-lime hover:text-black border border-white/10 flex items-center justify-center transition-all group/btn"
                          >
                            <ArrowRight className="w-6 h-6 group-hover/btn:-rotate-45 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
