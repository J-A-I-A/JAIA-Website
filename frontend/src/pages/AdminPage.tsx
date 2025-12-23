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
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Pencil, Shield, UserCheck, UserX, Loader2, Users, Calendar, UsersRound, Download, Trash2, Filter, X, CheckSquare, Mail } from 'lucide-react';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import { EventManagement } from '@/components/admin/EventManagement';
import { CommitteeManagement } from '@/components/admin/CommitteeManagement';

interface UserWithEmail extends Profile {
  email?: string;
}

interface UserFilters {
  membershipTiers: MembershipTier[];
  membershipStatuses: MembershipStatus[];
  adminStatus: 'all' | 'admin' | 'non-admin';
  dateFrom: string;
  dateTo: string;
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
  
  // Bulk selection and filtering state
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<UserFilters>({
    membershipTiers: [],
    membershipStatuses: [],
    adminStatus: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  
  // Bulk action confirmation state
  const [bulkActionConfirm, setBulkActionConfirm] = useState<{
    open: boolean;
    action: 'tier' | 'status' | 'admin' | 'delete' | null;
    value?: string;
    affectedUsers: string[];
  }>({
    open: false,
    action: null,
    value: undefined,
    affectedUsers: [],
  });

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
      // Call the admin function that joins profiles with auth.users to get email
      const { data, error } = await supabase
        .rpc('admin_get_users_with_email');

      if (error) throw error;

      setUsers(data || []);
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

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const toggleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  const clearSelection = () => {
    setSelectedUserIds(new Set());
  };

  // Copy emails to clipboard
  const copyEmails = async () => {
    const usersForEmails = selectedUserIds.size > 0 
      ? users.filter(u => selectedUserIds.has(u.id))
      : filteredUsers;

    if (usersForEmails.length === 0) {
      alert('No users found');
      return;
    }

    const emails = usersForEmails
      .map(u => u.email)
      .filter(email => email) // Remove null/undefined emails
      .join(', ');

    if (!emails) {
      alert('No email addresses found');
      return;
    }

    try {
      await navigator.clipboard.writeText(emails);
      alert(`Copied ${usersForEmails.filter(u => u.email).length} email address(es) to clipboard`);
    } catch (error) {
      console.error('Failed to copy emails:', error);
      alert('Failed to copy emails to clipboard');
    }
  };

  // CSV Export function
  const exportToCSV = () => {
    const usersToExport = selectedUserIds.size > 0 
      ? users.filter(u => selectedUserIds.has(u.id))
      : filteredUsers;

    if (usersToExport.length === 0) {
      alert('No users to export');
      return;
    }

    // CSV headers
    const headers = [
      'Name',
      'Email',
      'Membership Tier',
      'Membership Status',
      'Joined Date',
      'Admin Status',
      'Phone',
      'Location',
      'Company',
      'Job Title'
    ];

    // CSV rows
    const rows = usersToExport.map(user => [
      user.full_name || '',
      user.email || '',
      user.membership_tier,
      user.membership_status,
      new Date(user.joined_date).toLocaleDateString(),
      user.is_admin ? 'Yes' : 'No',
      user.phone || '',
      user.location || '',
      user.company || '',
      user.job_title || ''
    ]);

    // Escape and quote CSV fields
    const escapeCSV = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    // Build CSV content
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const today = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `jaia-users-export-${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show bulk action confirmation
  const showBulkActionConfirm = (action: 'tier' | 'status' | 'admin' | 'delete', value?: string) => {
    if (selectedUserIds.size === 0) return;
    
    const affectedUsers = users
      .filter(u => selectedUserIds.has(u.id))
      .map(u => u.full_name || u.email || u.id);
    
    setBulkActionConfirm({
      open: true,
      action,
      value,
      affectedUsers,
    });
  };

  // Execute bulk action after confirmation
  const executeBulkAction = async () => {
    const { action, value } = bulkActionConfirm;
    
    setBulkActionConfirm({ open: false, action: null, value: undefined, affectedUsers: [] });
    setBulkActionLoading(true);

    try {
      if (action === 'tier' && value) {
        const { error } = await supabase
          .from('profiles')
          .update({ membership_tier: value as MembershipTier })
          .in('id', Array.from(selectedUserIds));

        if (error) throw error;
        await fetchUsers();
        clearSelection();
        alert(`Successfully updated ${selectedUserIds.size} user(s) membership tier`);
        
      } else if (action === 'status' && value) {
        const { error } = await supabase
          .from('profiles')
          .update({ membership_status: value as MembershipStatus })
          .in('id', Array.from(selectedUserIds));

        if (error) throw error;
        await fetchUsers();
        clearSelection();
        alert(`Successfully updated ${selectedUserIds.size} user(s) membership status`);
        
      } else if (action === 'admin') {
        const selectedUsers = users.filter(u => selectedUserIds.has(u.id));
        
        for (const selectedUser of selectedUsers) {
          const { error } = await supabase
            .from('profiles')
            .update({ is_admin: !selectedUser.is_admin })
            .eq('id', selectedUser.id);

          if (error) throw error;
        }

        await fetchUsers();
        clearSelection();
        alert(`Successfully toggled admin status for ${selectedUserIds.size} user(s)`);
        
      } else if (action === 'delete') {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .in('id', Array.from(selectedUserIds));

        if (error) throw error;
        await fetchUsers();
        clearSelection();
        alert(`Successfully deleted ${selectedUserIds.size} user(s)`);
      }
    } catch (error) {
      console.error(`Error executing bulk action ${action}:`, error);
      alert(`Failed to execute bulk action. Please try again.`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Get action description for confirmation dialog
  const getActionDescription = () => {
    const { action, value, affectedUsers } = bulkActionConfirm;
    const count = affectedUsers.length;
    
    switch (action) {
      case 'tier':
        return {
          title: 'Change Membership Tier',
          description: `Change membership tier to "${value}" for ${count} user${count !== 1 ? 's' : ''}?`,
          actionText: 'Change Tier',
        };
      case 'status':
        return {
          title: 'Change Membership Status',
          description: `Change membership status to "${value}" for ${count} user${count !== 1 ? 's' : ''}?`,
          actionText: 'Change Status',
        };
      case 'admin':
        return {
          title: 'Toggle Admin Status',
          description: `Toggle admin privileges for ${count} user${count !== 1 ? 's' : ''}? This is a sensitive operation.`,
          actionText: 'Toggle Admin',
        };
      case 'delete':
        return {
          title: 'Delete Users',
          description: `Permanently delete ${count} user${count !== 1 ? 's' : ''}? This action cannot be undone.`,
          actionText: 'Delete Users',
        };
      default:
        return {
          title: 'Confirm Action',
          description: 'Are you sure you want to proceed?',
          actionText: 'Confirm',
        };
    }
  };

  // Clear a specific filter
  const clearFilter = (filterType: keyof UserFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: filterType === 'adminStatus' ? 'all' : 
                    filterType === 'dateFrom' || filterType === 'dateTo' ? '' : []
    }));
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.membershipTiers.length > 0 ||
    filters.membershipStatuses.length > 0 ||
    filters.adminStatus !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  const filteredUsers = users.filter(user => {
    // Search query filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query)
    );
    
    // Membership tier filter
    const matchesTier = filters.membershipTiers.length === 0 || 
      filters.membershipTiers.includes(user.membership_tier);
    
    // Membership status filter
    const matchesStatus = filters.membershipStatuses.length === 0 || 
      filters.membershipStatuses.includes(user.membership_status);
    
    // Admin status filter
    const matchesAdmin = filters.adminStatus === 'all' ||
      (filters.adminStatus === 'admin' && user.is_admin) ||
      (filters.adminStatus === 'non-admin' && !user.is_admin);
    
    // Date range filter
    const userDate = new Date(user.joined_date);
    const matchesDateFrom = !filters.dateFrom || userDate >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || userDate <= new Date(filters.dateTo);
    
    return matchesSearch && matchesTier && matchesStatus && matchesAdmin && matchesDateFrom && matchesDateTo;
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyEmails}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Copy Emails
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={exportToCSV}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Badge variant="outline" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {filteredUsers.length} / {users.length} Users
                </Badge>
                {selectedUserIds.size > 0 && (
                  <Badge className="flex items-center gap-2 bg-primary">
                    <CheckSquare className="h-4 w-4" />
                    {selectedUserIds.size} Selected
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
                
                {/* Filter Popovers */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Membership Tier
                      {filters.membershipTiers.length > 0 && (
                        <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {filters.membershipTiers.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Membership Tier</h4>
                      {(['individual', 'student', 'organizational', 'supporting'] as MembershipTier[]).map(tier => (
                        <div key={tier} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tier-${tier}`}
                            checked={filters.membershipTiers.includes(tier)}
                            onCheckedChange={(checked) => {
                              setFilters(prev => ({
                                ...prev,
                                membershipTiers: checked
                                  ? [...prev.membershipTiers, tier]
                                  : prev.membershipTiers.filter(t => t !== tier)
                              }));
                            }}
                          />
                          <label htmlFor={`tier-${tier}`} className="text-sm capitalize cursor-pointer">
                            {tier}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Status
                      {filters.membershipStatuses.length > 0 && (
                        <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {filters.membershipStatuses.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Membership Status</h4>
                      {(['active', 'pending', 'expired', 'cancelled'] as MembershipStatus[]).map(status => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.membershipStatuses.includes(status)}
                            onCheckedChange={(checked) => {
                              setFilters(prev => ({
                                ...prev,
                                membershipStatuses: checked
                                  ? [...prev.membershipStatuses, status]
                                  : prev.membershipStatuses.filter(s => s !== status)
                              }));
                            }}
                          />
                          <label htmlFor={`status-${status}`} className="text-sm capitalize cursor-pointer">
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                      {filters.adminStatus !== 'all' && (
                        <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Admin Status</h4>
                      {[
                        { value: 'all', label: 'All Users' },
                        { value: 'admin', label: 'Admins Only' },
                        { value: 'non-admin', label: 'Non-Admins Only' }
                      ].map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`admin-${option.value}`}
                            checked={filters.adminStatus === option.value}
                            onCheckedChange={() => {
                              setFilters(prev => ({
                                ...prev,
                                adminStatus: option.value as 'all' | 'admin' | 'non-admin'
                              }));
                            }}
                          />
                          <label htmlFor={`admin-${option.value}`} className="text-sm cursor-pointer">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Date Range
                      {(filters.dateFrom || filters.dateTo) && (
                        <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Joined Date Range</h4>
                      <div className="space-y-2">
                        <Label htmlFor="date-from" className="text-sm">From</Label>
                        <Input
                          id="date-from"
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-to" className="text-sm">To</Label>
                        <Input
                          id="date-to"
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      membershipTiers: [],
                      membershipStatuses: [],
                      adminStatus: 'all',
                      dateFrom: '',
                      dateTo: '',
                    })}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {filters.membershipTiers.map(tier => (
                    <Badge key={tier} variant="secondary" className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80" onClick={() => clearFilter('membershipTiers')}>
                      <span className="capitalize">Tier: {tier}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                  {filters.membershipStatuses.map(status => (
                    <Badge key={status} variant="secondary" className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80" onClick={() => clearFilter('membershipStatuses')}>
                      <span className="capitalize">Status: {status}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                  {filters.adminStatus !== 'all' && (
                    <Badge variant="secondary" className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80" onClick={() => clearFilter('adminStatus')}>
                      <span>Admin: {filters.adminStatus.replace('-', ' ')}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {(filters.dateFrom || filters.dateTo) && (
                    <Badge variant="secondary" className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80" onClick={() => {
                      clearFilter('dateFrom');
                      clearFilter('dateTo');
                    }}>
                      <span>Date: {filters.dateFrom || '...'} to {filters.dateTo || '...'}</span>
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Bulk Action Toolbar */}
            {selectedUserIds.size > 0 && (
              <div className="mt-4 p-4 bg-muted/50 border rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">
                      {selectedUserIds.size} user{selectedUserIds.size !== 1 ? 's' : ''} selected
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      disabled={bulkActionLoading}
                    >
                      Clear
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select onValueChange={(value) => showBulkActionConfirm('tier', value)} disabled={bulkActionLoading}>
                      <SelectTrigger className="w-[160px] h-9">
                        <SelectValue placeholder="Change Tier..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="organizational">Organizational</SelectItem>
                        <SelectItem value="supporting">Supporting</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => showBulkActionConfirm('status', value)} disabled={bulkActionLoading}>
                      <SelectTrigger className="w-[160px] h-9">
                        <SelectValue placeholder="Change Status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showBulkActionConfirm('admin')}
                      disabled={bulkActionLoading}
                      className="gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Toggle Admin
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => showBulkActionConfirm('delete')}
                      disabled={bulkActionLoading}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all users"
                      />
                    </TableHead>
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
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUserIds.has(user.id)}
                            onCheckedChange={() => toggleSelectUser(user.id)}
                            aria-label={`Select ${user.full_name || 'user'}`}
                          />
                        </TableCell>
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

        {/* Bulk Action Confirmation Dialog */}
        <Dialog open={bulkActionConfirm.open} onOpenChange={(open) => !open && setBulkActionConfirm({ open: false, action: null, value: undefined, affectedUsers: [] })}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{getActionDescription().title}</DialogTitle>
              <DialogDescription>
                {getActionDescription().description}
              </DialogDescription>
            </DialogHeader>

            {bulkActionConfirm.affectedUsers.length > 0 && (
              <div className="my-4">
                <Label className="text-sm font-medium">Affected Users ({bulkActionConfirm.affectedUsers.length})</Label>
                <div className="mt-2 max-h-60 overflow-y-auto rounded-md border bg-muted/30 p-4">
                  <div className="space-y-1">
                    {bulkActionConfirm.affectedUsers.slice(0, 10).map((userName, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <UserCheck className="h-3 w-3" />
                        {userName}
                      </div>
                    ))}
                    {bulkActionConfirm.affectedUsers.length > 10 && (
                      <div className="text-sm text-muted-foreground italic pt-2">
                        ...and {bulkActionConfirm.affectedUsers.length - 10} more user{bulkActionConfirm.affectedUsers.length - 10 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {bulkActionConfirm.action === 'delete' && (
              <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20">
                <div className="flex items-start gap-2">
                  <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">Warning: This action is permanent</p>
                    <p className="text-sm text-muted-foreground">
                      Deleted users cannot be recovered. All associated data will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {bulkActionConfirm.action === 'admin' && (
              <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Sensitive Operation</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Changing admin privileges affects system access and security permissions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBulkActionConfirm({ open: false, action: null, value: undefined, affectedUsers: [] })}
                disabled={bulkActionLoading}
              >
                Cancel
              </Button>
              <Button
                variant={bulkActionConfirm.action === 'delete' ? 'destructive' : 'default'}
                onClick={executeBulkAction}
                disabled={bulkActionLoading}
              >
                {bulkActionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  getActionDescription().actionText
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

