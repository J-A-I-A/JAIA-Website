// Event type definitions
export type EventType = 'workshop' | 'meeting' | 'conference' | 'social' | 'other';
export type LocationType = 'in-person' | 'virtual' | 'hybrid';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  event_type: EventType;
  category: string | null;
  start_date: string;
  end_date: string | null;
  timezone: string;
  location_type: LocationType;
  location_name: string | null;
  location_address: string | null;
  location_url: string | null;
  meeting_platform: string | null;
  meeting_url: string | null;
  meeting_id: string | null;
  meeting_password: string | null;
  organizer_id: string | null;
  max_attendees: number | null;
  registration_required: boolean;
  registration_url: string | null;
  registration_deadline: string | null;
  is_published: boolean;
  is_featured: boolean;
  image_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  organizer?: {
    full_name: string | null;
  };
}

export interface CreateEventInput {
  title: string;
  description?: string;
  short_description?: string;
  event_type: EventType;
  category?: string;
  start_date: string;
  end_date?: string;
  timezone?: string;
  location_type: LocationType;
  location_name?: string;
  location_address?: string;
  location_url?: string;
  meeting_platform?: string;
  meeting_url?: string;
  meeting_id?: string;
  meeting_password?: string;
  organizer_id?: string;
  max_attendees?: number;
  registration_required?: boolean;
  registration_url?: string;
  registration_deadline?: string;
  is_published?: boolean;
  is_featured?: boolean;
  image_url?: string;
  tags?: string[];
}

