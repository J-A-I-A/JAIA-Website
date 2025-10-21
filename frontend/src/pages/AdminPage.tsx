import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Profile, MembershipTier, MembershipStatus } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Shield, UserCheck, UserX, Loader2, Users, Calendar, UsersRound } from 'lucide-react';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import { EventManagement } from '@/components/admin/EventManagement';
import { CommitteeManagement } from '@/components/admin/CommitteeManagement';

interface UserWithEmail extends Profile {
  email?: string;
}

/**
 * Admin Page - User Management Interface
 * 
 * SECURITY NOTE: Frontend checks (isAdmin state) are for UX only.
 * Real security is enforced at the database level via RLS policies.
 * All Supabase queries are protected by Row Level Security (RLS).
 * 
 * Protected by:
 * - Database RLS policies that verify admin status on every query
 * - Database triggers that prevent privilege escalation
 * - Audit logging of all admin actions
 */
export function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  // Frontend admin check - FOR UX ONLY, not a security boundary
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithEmail | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user emails from auth.users (requires service role in production)
      // For now, we'll just use the profiles data
      const usersWithEmails = profiles || [];
      
      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editingUser.full_name,
          membership_tier: editingUser.membership_tier,
          membership_status: editingUser.membership_status,
          is_admin: editingUser.is_admin,
          phone: editingUser.phone,
          location: editingUser.location,
          job_title: editingUser.job_title,
          company: editingUser.company,
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      // Update local state
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const getMembershipStatusBadge = (status: MembershipStatus) => {
    const colors = {
      active: 'bg-green-500 hover:bg-green-500',
      pending: 'bg-yellow-500 hover:bg-yellow-500',
      expired: 'bg-gray-500 hover:bg-gray-500',
      cancelled: 'bg-red-500 hover:bg-red-500',
    };
    return <Badge className={colors[status]}>{status}</Badge>;
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be logged in to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="container mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>Manage users, events, committees, and view audit logs</CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="committees" className="flex items-center gap-2">
              <UsersRound className="h-4 w-4" />
              Committees
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                {users.length} Total Users
              </Badge>
            </div>
            <div className="mt-4">
              <Input
                placeholder="Search by name, email, or ID..."
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || 'No name'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email || user.id.substring(0, 8) + '...'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.membership_tier}</Badge>
                        </TableCell>
                        <TableCell>
                          {getMembershipStatusBadge(user.membership_status)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.joined_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.is_admin ? (
                            <Badge className="bg-purple-500 hover:bg-purple-500">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          ) : (
                            <UserX className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventManagement />
          </TabsContent>

          <TabsContent value="committees" className="space-y-6">
            <CommitteeManagement />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLogViewer />
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Make changes to user account and permissions
              </DialogDescription>
            </DialogHeader>

            {editingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="user-id">User ID</Label>
                  <Input
                    id="user-id"
                    value={editingUser.id}
                    disabled
                    className="font-mono text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={editingUser.full_name || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, full_name: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editingUser.phone || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingUser.location || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, location: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    value={editingUser.job_title || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, job_title: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={editingUser.company || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, company: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="membership-tier">Membership Tier</Label>
                  <Select
                    value={editingUser.membership_tier}
                    onValueChange={(value) =>
                      setEditingUser({
                        ...editingUser,
                        membership_tier: value as MembershipTier,
                      })
                    }
                  >
                    <SelectTrigger id="membership-tier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="organizational">Organizational</SelectItem>
                      <SelectItem value="supporting">Supporting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="membership-status">Membership Status</Label>
                  <Select
                    value={editingUser.membership_status}
                    onValueChange={(value) =>
                      setEditingUser({
                        ...editingUser,
                        membership_status: value as MembershipStatus,
                      })
                    }
                  >
                    <SelectTrigger id="membership-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="is-admin">Admin Access</Label>
                    <div className="text-sm text-muted-foreground">
                      Grant this user administrator privileges
                    </div>
                  </div>
                  <Switch
                    id="is-admin"
                    checked={editingUser.is_admin || false}
                    onCheckedChange={(checked) =>
                      setEditingUser({ ...editingUser, is_admin: checked })
                    }
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingUser(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveUser} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

