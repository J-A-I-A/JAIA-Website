import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event, CreateEventInput, EventType, LocationType } from '@/types/events';
import { Button } from '@/components/ui/button';
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
      workshop: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      meeting: 'bg-green-500/20 text-green-400 border-green-500/30',
      conference: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      social: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return <Badge variant="outline" className={`border ${colors[type]}`}>{type}</Badge>;
  };

  const getLocationBadge = (type: LocationType) => {
    const colors: Record<LocationType, string> = {
      virtual: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'in-person': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      hybrid: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };
    return <Badge variant="outline" className={`border ${colors[type]}`}>{type}</Badge>;
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
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header and Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            Event Management
          </h3>
          <p className="text-gray-400 text-sm">Create and coordinate JAIA events, workshops, and meetups.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
            />
          </div>
          <Button onClick={handleCreate} className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
        <Table>
          <TableHeader className="bg-white/5 hover:bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase">Event Details</TableHead>
              <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase">Type</TableHead>
              <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase">Date</TableHead>
              <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase">Location</TableHead>
              <TableHead className="text-gray-400 font-semibold text-xs tracking-wider uppercase">Status</TableHead>
              <TableHead className="text-right text-gray-400 font-semibold text-xs tracking-wider uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow className="hover:bg-transparent border-white/5">
                <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell>
                    <div className="flex items-start gap-3">
                      {event.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mt-1 shrink-0" />}
                      <div>
                        <div className="font-medium text-white group-hover:text-purple-400 transition-colors">{event.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {event.short_description || 'No description'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getEventTypeBadge(event.event_type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-xs font-mono opacity-70">{new Date(event.start_date).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getLocationBadge(event.location_type)}</TableCell>
                  <TableCell>
                    {event.is_published ? (
                      <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-white/10 text-gray-500 bg-white/5">
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(event)}
                        className="h-8 w-8 hover:bg-white/10 text-gray-400 hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                        className="h-8 w-8 hover:bg-red-500/10 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Event Dialog */}
      <Dialog open={isCreating || !!editingEvent} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0F0F0F] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingEvent ? 'Update event details' : 'Create a new JAIA event'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Basic Details
              </h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-gray-300">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="JAIA General Meeting"
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="short_description" className="text-gray-300">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief one-line description"
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-gray-300">Full Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed event description..."
                    rows={4}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="event_type" className="text-gray-300">Event Type</Label>
                    <Select
                      value={formData.event_type}
                      onValueChange={(value) => setFormData({ ...formData, event_type: value as EventType })}
                    >
                      <SelectTrigger id="event_type" className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
                        <SelectItem value="workshop" className="focus:bg-white/10">Workshop</SelectItem>
                        <SelectItem value="meeting" className="focus:bg-white/10">Meeting</SelectItem>
                        <SelectItem value="conference" className="focus:bg-white/10">Conference</SelectItem>
                        <SelectItem value="social" className="focus:bg-white/10">Social</SelectItem>
                        <SelectItem value="other" className="focus:bg-white/10">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-gray-300">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Technical"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-white/5" />

            {/* Date & Time */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Time & Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date" className="text-gray-300">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="bg-white/5 border-white/10 text-white [color-scheme:dark]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="end_date" className="text-gray-300">End Date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="bg-white/5 border-white/10 text-white [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location_type" className="text-gray-300">Location Type</Label>
                <Select
                  value={formData.location_type}
                  onValueChange={(value) => setFormData({ ...formData, location_type: value as LocationType })}
                >
                  <SelectTrigger id="location_type" className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.location_type === 'in-person' || formData.location_type === 'hybrid') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location_name" className="text-gray-300">Venue Name</Label>
                    <Input
                      id="location_name"
                      value={formData.location_name}
                      onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location_address" className="text-gray-300">Address</Label>
                    <Input
                      id="location_address"
                      value={formData.location_address}
                      onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              )}

              {(formData.location_type === 'virtual' || formData.location_type === 'hybrid') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="meeting_url" className="text-gray-300">Meeting Link</Label>
                    <Input
                      id="meeting_url"
                      value={formData.meeting_url}
                      onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                      placeholder="https://zoom.us/..."
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="meeting_platform" className="text-gray-300">Platform</Label>
                    <Input
                      id="meeting_platform"
                      value={formData.meeting_platform}
                      onChange={(e) => setFormData({ ...formData, meeting_platform: e.target.value })}
                      placeholder="Zoom"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="h-px w-full bg-white/5" />

            {/* Publishing */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Settings
              </h3>

              <div className="flex items-center justify-between border border-white/10 rounded-lg p-3 bg-white/[0.02]">
                <div className="space-y-0.5">
                  <Label htmlFor="is_published" className="text-white text-sm">Publish Event</Label>
                  <div className="text-xs text-gray-500">Visible to public</div>
                </div>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
              </div>

              <div className="flex items-center justify-between border border-white/10 rounded-lg p-3 bg-white/[0.02]">
                <div className="space-y-0.5">
                  <Label htmlFor="is_featured" className="text-white text-sm">Featured</Label>
                  <div className="text-xs text-gray-500">Promote on homepage</div>
                </div>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image_url" className="text-gray-300">Cover Image</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={handleClose} disabled={saving} className="text-gray-400 hover:text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-purple-500 hover:bg-purple-600 text-white">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
