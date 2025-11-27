import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Terminal, Video, Users } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/events';

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .gte('start_date', now)
        .order('start_date', { ascending: true })
        .limit(3);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (startDate: string) => {
    const date = new Date(startDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getLocationDisplay = (event: Event) => {
    if (event.location_type === 'virtual') {
      return event.meeting_platform || 'Virtual Event';
    } else if (event.location_type === 'hybrid') {
      return event.location_name ? `${event.location_name} & Online` : 'Hybrid Event';
    } else {
      return event.location_name || event.location_address || 'TBA';
    }
  };

  const getEventType = (event: Event) => {
    return event.event_type?.toUpperCase() || 'EVENT';
  };

  return (
    <section id="events" className="py-24 bg-jaia-darkGrey relative scroll-mt-16">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="bg-jaia-green/10 p-3 border border-jaia-green/30">
            <Terminal className="text-jaia-green w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            SYSTEM_<span className="text-jaia-green">LOGS</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-jaia-gold font-mono text-sm animate-pulse">
            <span>&gt; FETCHING_DATA</span>
            <span className="inline-block w-2 h-4 bg-jaia-gold"></span>
          </div>
        ) : events.length === 0 ? (
          <div className="relative">
            <div className="bg-white/5 border-l-2 border-jaia-green/50 p-8 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-jaia-gold font-mono text-xs px-2 py-1 bg-jaia-gold/10 border border-jaia-gold/20">
                  STANDBY
                </span>
                <span className="text-gray-500 font-mono text-xs">NO_ACTIVE_EVENTS</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">Awaiting New Events</h3>
              <p className="text-gray-400 font-sans mb-6">
                We're currently planning our next events. Check back soon for exciting workshops, 
                meetups, and tech talks!
              </p>
              <Link to="/events">
                <NeonButton variant="secondary">
                  VIEW_ALL_LOGS
                </NeonButton>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Timeline Container */}
            <div className="relative">
              {/* Circuit Line */}
              <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-white/10 hidden md:block"></div>

              <div className="space-y-12">
                {events.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex flex-col md:flex-row gap-8 items-start group"
                  >
                    {/* Node Dot */}
                    <div className="hidden md:flex flex-none w-14 h-14 bg-jaia-black border-2 border-white/20 rounded-full items-center justify-center relative z-10 group-hover:border-jaia-gold transition-colors shadow-[0_0_15px_rgba(0,0,0,1)]">
                       <span className="font-mono text-xs text-gray-500 group-hover:text-jaia-gold">{`0${idx+1}`}</span>
                    </div>

                    {/* Event Data Block */}
                    <div className="flex-1 w-full">
                      <div className="bg-white/5 border-l-2 border-jaia-green/50 p-6 md:p-8 hover:bg-white/10 transition-colors relative overflow-hidden">
                        
                        {/* Hover Scanline */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-jaia-green/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000"></div>

                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4 relative z-10">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                               <span className="text-jaia-gold font-mono text-xs px-2 py-1 bg-jaia-gold/10 border border-jaia-gold/20">
                                 {getEventType(event)}
                               </span>
                               <span className="text-gray-500 font-mono text-xs">{formatEventDate(event.start_date)}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{event.title}</h3>
                          </div>
                          {event.registration_url && (
                            <a 
                              href={event.registration_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="self-start md:self-center px-4 py-2 bg-black border border-white/20 hover:border-jaia-green text-jaia-green font-mono text-xs flex items-center gap-2 transition-all"
                            >
                              REGISTER <ArrowRight size={14} />
                            </a>
                          )}
                        </div>

                        {event.short_description && (
                          <p className="text-gray-400 font-sans mb-4 max-w-2xl">{event.short_description}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-mono">
                          <div className="flex items-center gap-2">
                            {event.location_type === 'virtual' || event.location_type === 'hybrid' ? (
                              <Video size={14} />
                            ) : (
                              <MapPin size={14} />
                            )}
                            {getLocationDisplay(event)}
                          </div>
                          {event.max_attendees && (
                            <div className="flex items-center gap-2">
                              <Users size={14} />
                              <span>Max {event.max_attendees}</span>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* View All Link */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <Link to="/events">
                <NeonButton variant="secondary">
                  VIEW_ALL_LOGS
                </NeonButton>
              </Link>
            </motion.div>
          </>
        )}

      </div>
    </section>
  );
}
