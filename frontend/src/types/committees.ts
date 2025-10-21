// Committee type definitions
export type CommitteeType = 'standing' | 'ad-hoc' | 'working-group' | 'task-force' | 'board';
export type CommitteeStatus = 'active' | 'inactive' | 'archived';
export type CommitteeMemberRole = 'chair' | 'co-chair' | 'member' | 'secretary' | 'advisor';

export interface Committee {
  id: string;
  name: string;
  description: string | null;
  purpose: string | null;
  committee_type: CommitteeType;
  status: CommitteeStatus;
  chair_id: string | null;
  co_chair_id: string | null;
  meeting_frequency: string | null;
  meeting_day: string | null;
  meeting_time: string | null;
  meeting_url: string | null;
  is_public: boolean;
  display_order: number | null;
  formed_date: string | null;
  dissolved_date: string | null;
  created_at: string;
  updated_at: string;
  chair?: {
    full_name: string | null;
  };
  co_chair?: {
    full_name: string | null;
  };
}

export interface CommitteeMember {
  id: string;
  committee_id: string;
  member_id: string;
  role: CommitteeMemberRole;
  joined_date: string;
  left_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  member?: {
    full_name: string | null;
    email?: string;
  };
}

export interface CreateCommitteeInput {
  name: string;
  description?: string;
  purpose?: string;
  committee_type: CommitteeType;
  status?: CommitteeStatus;
  chair_id?: string;
  co_chair_id?: string;
  meeting_frequency?: string;
  meeting_day?: string;
  meeting_time?: string;
  meeting_url?: string;
  is_public?: boolean;
  display_order?: number;
  formed_date?: string;
}

export interface AddCommitteeMemberInput {
  committee_id: string;
  member_id: string;
  role?: CommitteeMemberRole;
  joined_date?: string;
}

