import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Video, Users, ArrowRight } from 'lucide-react';
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
        .limit(6);

      if (error) throw error;
      setEvents(data || []);
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

  return (
    <section id="events" className="py-20 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground">Join us at our upcoming events and workshops</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">
            <div className="inline-block animate-pulse">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-muted/30 rounded-lg p-12 border border-muted">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground mb-4">
                We're currently planning our next events. Check back soon for exciting workshops, 
                meetups, and tech talks!
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Want to stay updated? Follow us on social media or reach out to us in the contact section below.
              </p>
              <Button asChild variant="outline">
                <Link to="/events" className="flex items-center gap-2">
                  View All Events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow border-primary/10 hover:border-primary/30 flex flex-col">
                {event.image_url && (
                  <div className="h-48 w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    {event.is_featured && (
                      <Badge variant="default" className="shrink-0">Featured</Badge>
                    )}
                  </div>
                  {event.event_type && (
                    <Badge variant="outline" className="w-fit">
                      {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  {event.short_description && (
                    <CardDescription className="text-base line-clamp-2">
                      {event.short_description}
                    </CardDescription>
                  )}
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">{formatEventDate(event.start_date, event.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getLocationIcon(event.location_type)}
                      <span className="text-xs">{getLocationDisplay(event)}</span>
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-xs">Max {event.max_attendees} attendees</span>
                      </div>
                    )}
                  </div>
                  {event.registration_url && (
                    <a 
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm font-medium text-primary hover:underline mt-2"
                    >
                      Register Now →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {events.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/events" className="flex items-center gap-2">
                View All Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

