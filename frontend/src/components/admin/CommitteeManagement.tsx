import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Committee, CommitteeMember, CreateCommitteeInput, AddCommitteeMemberInput, CommitteeType, CommitteeStatus, CommitteeMemberRole } from '@/types/committees';
import { Profile } from '@/types/profile';
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
import { UsersRound, Plus, Pencil, Trash2, User, UserPlus, Loader2, Shield } from 'lucide-react';

export function CommitteeManagement() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [members, setMembers] = useState<Record<string, CommitteeMember[]>>({});
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateCommitteeInput>({
    name: '',
    description: '',
    purpose: '',
    committee_type: 'standing',
    status: 'active',
    chair_id: undefined,
    co_chair_id: undefined,
    meeting_frequency: '',
    meeting_day: '',
    meeting_time: '',
    meeting_url: '',
    is_public: true,
    display_order: undefined,
    formed_date: '',
  });

  const [memberFormData, setMemberFormData] = useState<AddCommitteeMemberInput>({
    committee_id: '',
    member_id: '',
    role: 'member',
    joined_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchCommittees();
    fetchAllProfiles();
  }, []);

  const fetchCommittees = async () => {
    try {
      const { data, error } = await supabase
        .from('committees')
        .select('*, chair:profiles!chair_id(full_name), co_chair:profiles!co_chair_id(full_name)')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCommittees(data || []);
      
      // Fetch members for each committee
      if (data) {
        for (const committee of data) {
          await fetchCommitteeMembers(committee.id);
        }
      }
    } catch (error) {
      console.error('Error fetching committees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommitteeMembers = async (committeeId: string) => {
    try {
      const { data, error } = await supabase
        .from('committee_members')
        .select('*, member:profiles!member_id(full_name, email)')
        .eq('committee_id', committeeId)
        .eq('is_active', true)
        .order('joined_date', { ascending: false });

      if (error) throw error;
      setMembers(prev => ({ ...prev, [committeeId]: data || [] }));
    } catch (error) {
      console.error('Error fetching committee members:', error);
    }
  };

  const fetchAllProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setAllProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      purpose: '',
      committee_type: 'standing',
      status: 'active',
      chair_id: undefined,
      co_chair_id: undefined,
      meeting_frequency: '',
      meeting_day: '',
      meeting_time: '',
      meeting_url: '',
      is_public: true,
      display_order: undefined,
      formed_date: '',
    });
    setIsCreating(true);
  };

  const handleEdit = (committee: Committee) => {
    setFormData({
      name: committee.name,
      description: committee.description || '',
      purpose: committee.purpose || '',
      committee_type: committee.committee_type,
      status: committee.status,
      chair_id: committee.chair_id || undefined,
      co_chair_id: committee.co_chair_id || undefined,
      meeting_frequency: committee.meeting_frequency || '',
      meeting_day: committee.meeting_day || '',
      meeting_time: committee.meeting_time || '',
      meeting_url: committee.meeting_url || '',
      is_public: committee.is_public,
      display_order: committee.display_order || undefined,
      formed_date: committee.formed_date || '',
    });
    setEditingCommittee(committee);
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert('Committee name is required');
      return;
    }

    setSaving(true);
    try {
      if (editingCommittee) {
        const { error } = await supabase
          .from('committees')
          .update(formData)
          .eq('id', editingCommittee.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('committees')
          .insert([formData]);

        if (error) throw error;
      }

      await fetchCommittees();
      handleClose();
    } catch (error) {
      console.error('Error saving committee:', error);
      alert('Failed to save committee');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this committee? All member associations will be removed.')) return;

    try {
      const { error } = await supabase
        .from('committees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCommittees();
    } catch (error) {
      console.error('Error deleting committee:', error);
      alert('Failed to delete committee');
    }
  };

  const handleAddMember = (committeeId: string) => {
    setMemberFormData({
      committee_id: committeeId,
      member_id: '',
      role: 'member',
      joined_date: new Date().toISOString().split('T')[0],
    });
    setShowAddMember(true);
  };

  const handleSaveMember = async () => {
    if (!memberFormData.member_id) {
      alert('Please select a member');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('committee_members')
        .insert([memberFormData]);

      if (error) throw error;
      
      await fetchCommitteeMembers(memberFormData.committee_id);
      setShowAddMember(false);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string, committeeId: string) => {
    if (!confirm('Remove this member from the committee?')) return;

    try {
      const { error } = await supabase
        .from('committee_members')
        .update({ is_active: false, left_date: new Date().toISOString().split('T')[0] })
        .eq('id', memberId);

      if (error) throw error;
      await fetchCommitteeMembers(committeeId);
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    }
  };

  const handleClose = () => {
    setEditingCommittee(null);
    setIsCreating(false);
  };

  const getCommitteeTypeBadge = (type: CommitteeType) => {
    const colors: Record<CommitteeType, string> = {
      standing: 'bg-blue-500',
      'ad-hoc': 'bg-purple-500',
      'working-group': 'bg-green-500',
      'task-force': 'bg-orange-500',
      board: 'bg-red-500',
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  const getStatusBadge = (status: CommitteeStatus) => {
    const colors: Record<CommitteeStatus, string> = {
      active: 'bg-green-500',
      inactive: 'bg-yellow-500',
      archived: 'bg-gray-500',
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const getRoleBadge = (role: CommitteeMemberRole) => {
    const colors: Record<CommitteeMemberRole, string> = {
      chair: 'bg-purple-500',
      'co-chair': 'bg-indigo-500',
      secretary: 'bg-blue-500',
      advisor: 'bg-green-500',
      member: 'bg-gray-500',
    };
    return <Badge className={colors[role]}>{role}</Badge>;
  };

  const filteredCommittees = committees.filter(committee => {
    const query = searchQuery.toLowerCase();
    return (
      committee.name.toLowerCase().includes(query) ||
      committee.description?.toLowerCase().includes(query) ||
      committee.committee_type.toLowerCase().includes(query)
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
              <CardTitle className="text-2xl">Committee Management</CardTitle>
              <CardDescription>Manage committees and member assignments</CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Committee
            </Button>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search committees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCommittees.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <UsersRound className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No committees found</p>
              </div>
            ) : (
              filteredCommittees.map((committee) => (
                <Card key={committee.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{committee.name}</CardTitle>
                          {getCommitteeTypeBadge(committee.committee_type)}
                          {getStatusBadge(committee.status)}
                          {!committee.is_public && <Badge variant="outline">Private</Badge>}
                        </div>
                        {committee.description && (
                          <CardDescription>{committee.description}</CardDescription>
                        )}
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          {committee.chair && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Chair: {committee.chair.full_name}
                            </div>
                          )}
                          {committee.meeting_frequency && (
                            <div>Meets: {committee.meeting_frequency}</div>
                          )}
                          {members[committee.id] && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {members[committee.id].length} members
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddMember(committee.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add Member
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(committee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(committee.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {members[committee.id] && members[committee.id].length > 0 && (
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Member</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Joined</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {members[committee.id].map((member) => (
                              <TableRow key={member.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{member.member?.full_name || 'Unknown'}</div>
                                    <div className="text-sm text-muted-foreground">{member.member?.email}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{getRoleBadge(member.role)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {new Date(member.joined_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveMember(member.id, committee.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Committee Dialog */}
      <Dialog open={isCreating || !!editingCommittee} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCommittee ? 'Edit Committee' : 'Create Committee'}</DialogTitle>
            <DialogDescription>
              {editingCommittee ? 'Update committee details' : 'Create a new committee'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Committee Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Technical Committee"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the committee..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Detailed purpose and objectives..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="committee_type">Committee Type</Label>
                <Select
                  value={formData.committee_type}
                  onValueChange={(value) => setFormData({ ...formData, committee_type: value as CommitteeType })}
                >
                  <SelectTrigger id="committee_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standing">Standing</SelectItem>
                    <SelectItem value="ad-hoc">Ad-hoc</SelectItem>
                    <SelectItem value="working-group">Working Group</SelectItem>
                    <SelectItem value="task-force">Task Force</SelectItem>
                    <SelectItem value="board">Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as CommitteeStatus })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="chair_id">Chair</Label>
                <Select
                  value={formData.chair_id}
                  onValueChange={(value) => setFormData({ ...formData, chair_id: value })}
                >
                  <SelectTrigger id="chair_id">
                    <SelectValue placeholder="Select chair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {allProfiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.full_name || profile.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="co_chair_id">Co-Chair</Label>
                <Select
                  value={formData.co_chair_id}
                  onValueChange={(value) => setFormData({ ...formData, co_chair_id: value })}
                >
                  <SelectTrigger id="co_chair_id">
                    <SelectValue placeholder="Select co-chair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {allProfiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.full_name || profile.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meeting_frequency">Meeting Frequency</Label>
                <Input
                  id="meeting_frequency"
                  value={formData.meeting_frequency}
                  onChange={(e) => setFormData({ ...formData, meeting_frequency: e.target.value })}
                  placeholder="e.g., Weekly, Monthly"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meeting_day">Meeting Day</Label>
                <Input
                  id="meeting_day"
                  value={formData.meeting_day}
                  onChange={(e) => setFormData({ ...formData, meeting_day: e.target.value })}
                  placeholder="e.g., Monday"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meeting_time">Meeting Time</Label>
                <Input
                  id="meeting_time"
                  type="time"
                  value={formData.meeting_time}
                  onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
                />
              </div>
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
                <Label htmlFor="formed_date">Formed Date</Label>
                <Input
                  id="formed_date"
                  type="date"
                  value={formData.formed_date}
                  onChange={(e) => setFormData({ ...formData, formed_date: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || undefined })}
                  placeholder="Lower numbers appear first"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-0.5">
                <Label htmlFor="is_public">Public Committee</Label>
                <div className="text-sm text-muted-foreground">
                  Make this committee visible to the public
                </div>
              </div>
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
              />
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
                editingCommittee ? 'Update Committee' : 'Create Committee'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={() => setShowAddMember(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Committee Member</DialogTitle>
            <DialogDescription>Add a member to this committee</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="member_id">Select Member *</Label>
              <Select
                value={memberFormData.member_id}
                onValueChange={(value) => setMemberFormData({ ...memberFormData, member_id: value })}
              >
                <SelectTrigger id="member_id">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {allProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.full_name || profile.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={memberFormData.role}
                onValueChange={(value) => setMemberFormData({ ...memberFormData, role: value as CommitteeMemberRole })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chair">Chair</SelectItem>
                  <SelectItem value="co-chair">Co-Chair</SelectItem>
                  <SelectItem value="secretary">Secretary</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="joined_date">Joined Date</Label>
              <Input
                id="joined_date"
                type="date"
                value={memberFormData.joined_date}
                onChange={(e) => setMemberFormData({ ...memberFormData, joined_date: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMember(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveMember} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

