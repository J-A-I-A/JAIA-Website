import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Video, Users, Clock, ExternalLink } from 'lucide-react';
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
      return <Video className="h-4 w-4 text-primary" />;
    }
    return <MapPin className="h-4 w-4 text-primary" />;
  };

  const getEventTypeColor = (eventType: string) => {
    const colors: Record<string, string> = {
      workshop: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
      meeting: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
      conference: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
      social: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
      other: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30'
    };
    return colors[eventType] || colors.other;
  };

  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => (
    <Card key={event.id} className={`hover:shadow-lg transition-all border-primary/10 hover:border-primary/30 flex flex-col ${isPast ? 'opacity-75' : ''}`}>
      {event.image_url && (
        <div className="h-48 w-full overflow-hidden rounded-t-lg relative">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {isPast && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary">Past Event</Badge>
            </div>
          )}
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          {event.is_featured && !isPast && (
            <Badge variant="default" className="shrink-0">Featured</Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {event.event_type && (
            <Badge variant="outline" className={`w-fit ${getEventTypeColor(event.event_type)}`}>
              {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
            </Badge>
          )}
          {event.category && (
            <Badge variant="secondary" className="w-fit">
              {event.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col">
        {event.short_description && (
          <CardDescription className="text-base line-clamp-3">
            {event.short_description}
          </CardDescription>
        )}
        <div className="space-y-2 mt-auto">
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="text-xs font-medium">{formatEventDate(event.start_date, event.end_date)}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            {getLocationIcon(event.location_type)}
            <span className="text-xs">{getLocationDisplay(event)}</span>
          </div>
          {event.max_attendees && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs">Max {event.max_attendees} attendees</span>
            </div>
          )}
          {event.organizer && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs">Organized by {event.organizer.full_name}</span>
            </div>
          )}
          {event.registration_deadline && !isPast && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">
                Register by {new Date(event.registration_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {event.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {event.registration_url && !isPast && (
          <Button
            asChild
            className="w-full mt-4"
            variant="default"
          >
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Register Now
              <ExternalLink className="h-4 w-4" />
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
              className="flex items-center justify-center gap-2"
            >
              Join Meeting
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
              className="flex items-center justify-center gap-2 text-xs"
            >
              View Location
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="pt-24 pb-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Events & Workshops</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join us at our upcoming events, workshops, and community gatherings. 
                Connect with fellow AI enthusiasts and expand your knowledge.
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-3 bg-card border rounded-lg px-4 py-3 shadow-sm">
                <Label htmlFor="past-events" className="text-sm font-medium cursor-pointer">
                  Show Past Events
                </Label>
                <Switch
                  id="past-events"
                  checked={showPastEvents}
                  onCheckedChange={setShowPastEvents}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center text-muted-foreground py-20">
              <div className="inline-block animate-pulse text-lg">Loading events...</div>
            </div>
          ) : (
            <>
              {/* Upcoming Events Section */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold">Upcoming Events</h2>
                  <Badge variant="secondary" className="text-sm">
                    {upcomingEvents.length} {upcomingEvents.length === 1 ? 'Event' : 'Events'}
                  </Badge>
                </div>

                {upcomingEvents.length === 0 ? (
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="bg-muted/30 rounded-lg p-12 border border-muted">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
                      <p className="text-muted-foreground mb-4">
                        We're currently planning our next events. Check back soon for exciting workshops,
                        meetups, and tech talks!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Want to stay updated? Follow us on social media or reach out to us.
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
                <div className="border-t pt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">Past Events</h2>
                    <Badge variant="secondary" className="text-sm">
                      {pastEvents.length} {pastEvents.length === 1 ? 'Event' : 'Events'}
                    </Badge>
                  </div>

                  {pastEvents.length === 0 ? (
                    <div className="text-center max-w-2xl mx-auto">
                      <div className="bg-muted/30 rounded-lg p-12 border border-muted">
                        <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Past Events</h3>
                        <p className="text-muted-foreground">
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

