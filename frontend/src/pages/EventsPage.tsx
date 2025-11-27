import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Video, Users, Clock, ExternalLink, Terminal, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/events';
import { Footer } from '@/components/sections/Footer';

export function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const now = new Date().toISOString();

      // Fetch upcoming events
      const { data: upcoming, error: upcomingError } = await supabase
        .from('events')
        .select('*, organizer:profiles!organizer_id(full_name)')
        .eq('is_published', true)
        .gte('start_date', now)
        .order('start_date', { ascending: true });

      if (upcomingError) throw upcomingError;
      setUpcomingEvents(upcoming || []);

      // Fetch past events
      const { data: past, error: pastError } = await supabase
        .from('events')
        .select('*, organizer:profiles!organizer_id(full_name)')
        .eq('is_published', true)
        .lt('start_date', now)
        .order('start_date', { ascending: false })
        .limit(50);

      if (pastError) throw pastError;
      setPastEvents(past || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };

    if (endDate) {
      const end = new Date(endDate);
      const startStr = start.toLocaleDateString('en-US', options);
      const endStr = end.toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit' });
      return `${startStr} - ${endStr}`;
    }

    return start.toLocaleDateString('en-US', options);
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

  const getLocationIcon = (locationType: string) => {
    if (locationType === 'virtual' || locationType === 'hybrid') {
      return <Video className="h-4 w-4 text-jaia-green" />;
    }
    return <MapPin className="h-4 w-4 text-jaia-green" />;
  };

  const getEventTypeColor = (eventType: string) => {
    const colors: Record<string, string> = {
      workshop: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      meeting: 'bg-jaia-green/10 text-jaia-green border-jaia-green/30',
      conference: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      social: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      other: 'bg-gray-500/10 text-gray-400 border-gray-500/30'
    };
    return colors[eventType] || colors.other;
  };

  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card 
        className={`bg-jaia-darkGrey/50 border-white/10 hover:border-jaia-green/30 transition-all duration-300 flex flex-col h-full ${isPast ? 'opacity-60' : ''}`}
      >
        {event.image_url && (
          <div className="h-48 w-full overflow-hidden relative">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jaia-black to-transparent"></div>
            {isPast && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gray-800 text-gray-300 border-gray-600">Past Event</Badge>
              </div>
            )}
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-xl text-white font-display group-hover:text-jaia-green transition-colors">{event.title}</CardTitle>
            {event.is_featured && !isPast && (
              <Badge className="shrink-0 bg-jaia-gold/20 text-jaia-gold border-jaia-gold/30">Featured</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {event.event_type && (
              <Badge variant="outline" className={`w-fit font-mono text-xs ${getEventTypeColor(event.event_type)}`}>
                {event.event_type.toUpperCase()}
              </Badge>
            )}
            {event.category && (
              <Badge variant="outline" className="w-fit bg-white/5 text-gray-400 border-white/10 font-mono text-xs">
                {event.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 flex-1 flex flex-col">
          {event.short_description && (
            <CardDescription className="text-base text-gray-400 line-clamp-3 font-sans">
              {event.short_description}
            </CardDescription>
          )}
          <div className="space-y-2 mt-auto">
            <div className="flex items-start gap-2 text-sm">
              <Calendar className="h-4 w-4 text-jaia-gold shrink-0 mt-0.5" />
              <span className="text-xs font-mono text-gray-300">{formatEventDate(event.start_date, event.end_date)}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              {getLocationIcon(event.location_type)}
              <span className="text-xs font-mono">{getLocationDisplay(event)}</span>
            </div>
            {event.max_attendees && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                <span className="text-xs font-mono">Max {event.max_attendees} attendees</span>
              </div>
            )}
            {event.organizer && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                <span className="text-xs font-mono">Organized by {event.organizer.full_name}</span>
              </div>
            )}
            {event.registration_deadline && !isPast && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-mono">
                  Register by {new Date(event.registration_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {event.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-white/5 text-gray-500 border-white/10">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {event.registration_url && !isPast && (
            <Button
              asChild
              className="w-full mt-4 bg-jaia-green hover:bg-jaia-neonGreen text-jaia-black font-mono"
            >
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                REGISTER_NOW
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          {event.meeting_url && !isPast && (
            <Button
              asChild
              className="w-full mt-2"
              variant="outline"
            >
              <a
                href={event.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-jaia-green/30 text-jaia-green hover:bg-jaia-green/10"
              >
                JOIN_MEETING
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          {event.location_url && event.location_type !== 'virtual' && (
            <Button
              asChild
              className="w-full mt-2"
              variant="outline"
              size="sm"
            >
              <a
                href={event.location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs border-white/20 text-gray-400 hover:bg-white/5"
              >
                VIEW_LOCATION
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-jaia-black">
      <div className="flex-1">
        {/* Hero Section */}
        <div className="pt-32 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-jaia-green/5 to-transparent"></div>
          <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-jaia-green/10 p-3 border border-jaia-green/30">
                <Terminal className="text-jaia-green w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-jaia-gold rounded-full animate-pulse"></span>
                  <span className="font-mono text-jaia-gold text-xs tracking-widest">EVENT_LOGS</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                  EVENTS & <span className="text-jaia-green">WORKSHOPS</span>
                </h1>
              </div>
            </div>
            
            <p className="text-lg text-gray-400 max-w-2xl font-sans mb-8">
              Join us at our upcoming events, workshops, and community gatherings. 
              Connect with fellow AI enthusiasts and expand your knowledge.
            </p>

            <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-3 w-fit">
              <Label htmlFor="past-events" className="text-sm font-mono cursor-pointer text-gray-400">
                SHOW_PAST_EVENTS
              </Label>
              <Switch
                id="past-events"
                checked={showPastEvents}
                onCheckedChange={setShowPastEvents}
                className="data-[state=checked]:bg-jaia-green"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {loading ? (
            <div className="flex items-center gap-2 text-jaia-gold font-mono text-sm animate-pulse py-20 justify-center">
              <span>&gt; FETCHING_EVENT_DATA</span>
              <span className="inline-block w-2 h-4 bg-jaia-gold"></span>
            </div>
          ) : (
            <>
              {/* Upcoming Events Section */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8 border-b border-jaia-green/20 pb-4">
                  <h2 className="text-2xl font-display font-bold text-white">
                    UPCOMING_<span className="text-jaia-green">EVENTS</span>
                  </h2>
                  <Badge className="bg-jaia-green/10 text-jaia-green border-jaia-green/30 font-mono">
                    {upcomingEvents.length} {upcomingEvents.length === 1 ? 'Event' : 'Events'}
                  </Badge>
                </div>

                {upcomingEvents.length === 0 ? (
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="bg-white/5 border border-white/10 p-12">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                      <h3 className="text-xl font-display font-bold text-white mb-2">No Upcoming Events</h3>
                      <p className="text-gray-400 mb-4 font-sans">
                        We're currently planning our next events. Check back soon for exciting workshops,
                        meetups, and tech talks!
                      </p>
                      <p className="text-sm text-gray-500 font-mono">
                        &gt; STATUS: AWAITING_NEW_EVENTS
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>

              {/* Past Events Section */}
              {showPastEvents && (
                <div className="border-t border-white/10 pt-12">
                  <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-display font-bold text-white">
                      PAST_<span className="text-gray-500">EVENTS</span>
                    </h2>
                    <Badge className="bg-gray-800 text-gray-400 border-gray-700 font-mono">
                      {pastEvents.length} {pastEvents.length === 1 ? 'Event' : 'Events'}
                    </Badge>
                  </div>

                  {pastEvents.length === 0 ? (
                    <div className="text-center max-w-2xl mx-auto">
                      <div className="bg-white/5 border border-white/10 p-12">
                        <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-display font-bold text-white mb-2">No Past Events</h3>
                        <p className="text-gray-400 font-sans">
                          We haven't hosted any events yet, but we're excited to start soon!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastEvents.map((event) => (
                        <EventCard key={event.id} event={event} isPast />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
