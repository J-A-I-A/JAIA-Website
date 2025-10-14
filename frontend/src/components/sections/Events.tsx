import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  location: string;
  description: string;
  date: string;
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section id="events" className="py-20 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground">Join us at our upcoming events and workshops</p>
        </div>

        {loading ? (
          <div className="text-center">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow border-primary/10 hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {event.location}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">{event.description}</CardDescription>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

