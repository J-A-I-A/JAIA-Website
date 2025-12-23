import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event, CreateEventInput, EventType, LocationType } from '@/types/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function EventManagement() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState<CreateEventInput>({
    title: '',
    description: '',
    short_description: '',
    event_type: 'meeting',
    category: '',
    start_date: '',
    end_date: '',
    timezone: 'America/Jamaica',
    location_type: 'virtual',
    location_name: '',
    location_address: '',
    location_url: '',
    meeting_platform: '',
    meeting_url: '',
    meeting_id: '',
    meeting_password: '',
    max_attendees: undefined,
    registration_required: false,
    registration_url: '',
    registration_deadline: '',
    is_published: false,
    is_featured: false,
    image_url: '',
    tags: [],
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, organizer:profiles!organizer_id(full_name)')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      short_description: '',
      event_type: 'meeting',
      category: '',
      start_date: '',
      end_date: '',
      timezone: 'America/Jamaica',
      location_type: 'virtual',
      location_name: '',
      location_address: '',
      location_url: '',
      meeting_platform: '',
      meeting_url: '',
      meeting_id: '',
      meeting_password: '',
      max_attendees: undefined,
      registration_required: false,
      registration_url: '',
      registration_deadline: '',
      is_published: false,
      is_featured: false,
      image_url: '',
      tags: [],
    });
    setIsCreating(true);
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      short_description: event.short_description || '',
      event_type: event.event_type,
      category: event.category || '',
      start_date: event.start_date,
      end_date: event.end_date || '',
      timezone: event.timezone,
      location_type: event.location_type,
      location_name: event.location_name || '',
      location_address: event.location_address || '',
      location_url: event.location_url || '',
      meeting_platform: event.meeting_platform || '',
      meeting_url: event.meeting_url || '',
      meeting_id: event.meeting_id || '',
      meeting_password: event.meeting_password || '',
      max_attendees: event.max_attendees || undefined,
      registration_required: event.registration_required,
      registration_url: event.registration_url || '',
      registration_deadline: event.registration_deadline || '',
      is_published: event.is_published,
      is_featured: event.is_featured,
      image_url: event.image_url || '',
      tags: event.tags || [],
    });
    setEditingEvent(event);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.start_date) {
      alert('Title and start date are required');
      return;
    }

    setSaving(true);
    try {
      // Convert empty strings to null for optional timestamp fields
      const eventData = {
        ...formData,
        end_date: formData.end_date || null,
        registration_deadline: formData.registration_deadline || null,
        created_by: user?.id,
        organizer_id: user?.id,
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;
      }

      await fetchEvents();
      handleClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleClose = () => {
    setEditingEvent(null);
    setIsCreating(false);
  };

  const getEventTypeBadge = (type: EventType) => {
    const colors: Record<EventType, string> = {
      workshop: 'bg-blue-500',
      meeting: 'bg-green-500',
      conference: 'bg-purple-500',
      social: 'bg-pink-500',
      other: 'bg-gray-500',
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  const getLocationBadge = (type: LocationType) => {
    const colors: Record<LocationType, string> = {
      virtual: 'bg-cyan-500',
      'in-person': 'bg-orange-500',
      hybrid: 'bg-indigo-500',
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  const filteredEvents = events.filter(event => {
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.event_type.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Event Management</CardTitle>
              <CardDescription>Create and manage JAIA events and workshops</CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No events found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {event.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.short_description?.substring(0, 60)}
                              {event.short_description && event.short_description.length > 60 ? '...' : ''}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getEventTypeBadge(event.event_type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.start_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{getLocationBadge(event.location_type)}</TableCell>
                      <TableCell>
                        {event.is_published ? (
                          <Badge className="bg-green-500">
                            <Eye className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(event)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Event Dialog */}
      <Dialog open={isCreating || !!editingEvent} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update event details' : 'Create a new JAIA event'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="JAIA General Meeting"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief one-line description"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed event description..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event_type">Event Type</Label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(value) => setFormData({ ...formData, event_type: value as EventType })}
                  >
                    <SelectTrigger id="event_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Technical, Community"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Date & Time</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date & Time *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="end_date">End Date & Time</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="location_type">Location Type</Label>
                <Select
                  value={formData.location_type}
                  onValueChange={(value) => setFormData({ ...formData, location_type: value as LocationType })}
                >
                  <SelectTrigger id="location_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.location_type === 'in-person' || formData.location_type === 'hybrid') && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="location_name">Location Name</Label>
                    <Input
                      id="location_name"
                      value={formData.location_name}
                      onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                      placeholder="Building or venue name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location_address">Address</Label>
                    <Input
                      id="location_address"
                      value={formData.location_address}
                      onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                      placeholder="Full address"
                    />
                  </div>
                </>
              )}

              {(formData.location_type === 'virtual' || formData.location_type === 'hybrid') && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="meeting_platform">Meeting Platform</Label>
                    <Input
                      id="meeting_platform"
                      value={formData.meeting_platform}
                      onChange={(e) => setFormData({ ...formData, meeting_platform: e.target.value })}
                      placeholder="Zoom, Discord, Google Meet, etc."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="meeting_url">Meeting URL</Label>
                    <Input
                      id="meeting_url"
                      value={formData.meeting_url}
                      onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="meeting_id">Meeting ID</Label>
                      <Input
                        id="meeting_id"
                        value={formData.meeting_id}
                        onChange={(e) => setFormData({ ...formData, meeting_id: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="meeting_password">Meeting Password</Label>
                      <Input
                        id="meeting_password"
                        value={formData.meeting_password}
                        onChange={(e) => setFormData({ ...formData, meeting_password: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Registration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Registration</h3>
              
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="registration_required">Require Registration</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable if attendees need to register
                  </div>
                </div>
                <Switch
                  id="registration_required"
                  checked={formData.registration_required}
                  onCheckedChange={(checked) => setFormData({ ...formData, registration_required: checked })}
                />
              </div>

              {formData.registration_required && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="registration_url">Registration URL</Label>
                    <Input
                      id="registration_url"
                      value={formData.registration_url}
                      onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="registration_deadline">Registration Deadline</Label>
                      <Input
                        id="registration_deadline"
                        type="datetime-local"
                        value={formData.registration_deadline}
                        onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="max_attendees">Max Attendees</Label>
                      <Input
                        id="max_attendees"
                        type="number"
                        value={formData.max_attendees}
                        onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) || undefined })}
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Publishing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Publishing</h3>
              
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is_published">Publish Event</Label>
                  <div className="text-sm text-muted-foreground">
                    Make this event visible to the public
                  </div>
                </div>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
              </div>

              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is_featured">Featured Event</Label>
                  <div className="text-sm text-muted-foreground">
                    Show prominently on the homepage
                  </div>
                </div>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image_url">Event Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingEvent ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

