import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Profile, MembershipTier, MembershipStatus } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pencil, Shield, UserCheck, Loader2, Users, Calendar, Download,
  CheckSquare, Mail, Activity, ArrowRight, ArrowLeft, Search,
  Zap, Layers, Globe, TrendingUp, Sparkles
} from 'lucide-react';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import { EventManagement } from '@/components/admin/EventManagement';
import { CommitteeManagement } from '@/components/admin/CommitteeManagement';

interface UserWithEmail extends Profile {
  email?: string;
}

// --- Bespoke Artistic Stat Card ---

const BespokeStatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  trend,
  accentColor,
  index
}: {
  title: string;
  value: string;
  icon: any;
  gradient: string;
  trend?: string;
  accentColor: string;
  index: number;
}) => {
  const tilts = ['rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[-1deg]', 'rotate-[2deg]'];
  const tilt = tilts[index % tilts.length];

  return (
    <div className={`group relative ${tilt} hover:rotate-0 transition-all duration-700 ease-out`}>
      {/* Artistic Container */}
      <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0D0D0D] via-[#0A0A0A] to-black group-hover:border-white/20 transition-all duration-500">

        {/* Diagonal Color Wash */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.04] group-hover:opacity-[0.12] transition-opacity duration-700`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)' }}
        />

        {/* Floating Orbs */}
        <div className={`absolute top-[15%] right-[20%] w-2 h-2 rounded-full ${accentColor.replace('text-', 'bg-')} opacity-30 blur-sm animate-pulse`} />
        <div className={`absolute top-[55%] right-[12%] w-1.5 h-1.5 rounded-full ${accentColor.replace('text-', 'bg-')} opacity-20 blur-sm animate-pulse`} style={{ animationDelay: '1.5s' }} />
        <div className={`absolute bottom-[25%] right-[30%] w-1 h-1 rounded-full ${accentColor.replace('text-', 'bg-')} opacity-15 blur-sm animate-pulse`} style={{ animationDelay: '3s' }} />

        {/* Organic SVG Shape */}
        <svg className="absolute -bottom-6 -right-6 w-28 h-28 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" viewBox="0 0 200 200">
          <path
            d="M100,20 Q160,40 180,100 T140,180 Q80,170 40,140 T20,80 Q40,40 100,20 Z"
            className={`fill-current ${accentColor}`}
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 p-5 h-full flex flex-col">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            {/* Hexagon Icon */}
            <div className="relative group/icon">
              <div
                className={`
                  relative w-12 h-12 flex items-center justify-center
                  bg-gradient-to-br from-white/10 via-white/5 to-transparent
                  backdrop-blur-xl border border-white/10
                  group-hover/icon:scale-110 group-hover/icon:rotate-12
                  transition-all duration-500
                  ${accentColor}
                `}
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                <Icon size={20} strokeWidth={2.5} />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-500`} />
            </div>

            {/* Trend Pill */}
            {trend && (
              <div className={`
                flex items-center gap-1.5 px-3 py-1 rounded-full 
                bg-gradient-to-r ${gradient} 
                text-[10px] font-mono font-bold text-white uppercase tracking-wider
                shadow-lg shadow-black/20
              `}>
                <Sparkles size={10} />
                {trend}
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="mt-auto space-y-3">
            {/* Title with Custom Underline */}
            <div>
              <h3 className="text-gray-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-1.5">
                {title}
              </h3>
              <div className="flex gap-1">
                <div className={`h-[2px] w-12 bg-gradient-to-r ${gradient} rounded-full`} />
                <div className={`h-[2px] w-6 bg-gradient-to-r ${gradient} rounded-full opacity-60`} />
                <div className={`h-[2px] w-3 bg-gradient-to-r ${gradient} rounded-full opacity-30`} />
              </div>
            </div>

            {/* Massive Number */}
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-white tracking-tighter leading-none group-hover:tracking-tight transition-all duration-500" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {value}
              </span>
              <div className={`mb-2 p-1 rounded-lg ${accentColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                <TrendingUp size={14} strokeWidth={3} />
              </div>
            </div>

            {/* Decorative Bars */}
            <div className="flex gap-1 pt-1">
              <div className={`h-1 rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`} style={{ width: '45%' }} />
              <div className={`h-1 rounded-full bg-gradient-to-r ${gradient} opacity-60 transition-all duration-700 delay-100`} style={{ width: '28%' }} />
              <div className={`h-1 rounded-full bg-gradient-to-r ${gradient} opacity-30 transition-all duration-700 delay-200`} style={{ width: '18%' }} />
            </div>
          </div>
        </div>

        {/* Corner Glow */}
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-tl ${gradient} opacity-10 group-hover:opacity-20 rounded-full blur-3xl transition-all duration-700`} />
      </div>
    </div>
  );
};

// --- Background ---

const CyberBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
    <div className="absolute top-[-25%] left-[-15%] w-[700px] h-[700px] bg-jaia-green/[0.03] rounded-full blur-[140px] animate-pulse" />
    <div className="absolute bottom-[-25%] right-[-15%] w-[700px] h-[700px] bg-purple-500/[0.03] rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
  </div>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative rounded-2xl overflow-hidden backdrop-blur-md bg-[#0A0A0A]/40 border border-white/5 ${className}`}>
    {children}
  </div>
);

// --- Main Component ---

export function AdminPage() {
  const auth = useAuth();
  const user = auth?.user;

  const [users, setUsers] = useState<UserWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithEmail | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user === undefined) return;
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      setIsAdmin(data?.is_admin || false);
    } catch { setIsAdmin(false); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isAdmin) fetchUsers(); }, [isAdmin]);

  const fetchUsers = async () => {
    const { data } = await supabase.rpc('admin_get_users_with_email');
    setUsers(data || []);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update({
        full_name: editingUser.full_name,
        membership_tier: editingUser.membership_tier,
        membership_status: editingUser.membership_status,
        is_admin: editingUser.is_admin,
      }).eq('id', editingUser.id);
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    } catch { alert('Failed to update'); }
    finally { setSaving(false); }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const toggleSelectAll = () => setSelectedUserIds(selectedUserIds.size === paginatedUsers.length ? new Set() : new Set(paginatedUsers.map(u => u.id)));
  const toggleSelectUser = (id: string) => {
    const newSet = new Set(selectedUserIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedUserIds(newSet);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">INITIALIZING...</div>;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-mono font-bold">ACCESS DENIED</div>;

  return (
    <div className="min-h-screen text-white relative font-sans selection:bg-jaia-green/30">
      <CyberBackground />

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <span className="h-3 w-3 rounded-full bg-jaia-green animate-ping absolute" />
                <span className="h-3 w-3 rounded-full bg-jaia-green block shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
              </div>
              <span className="text-xs sm:text-sm font-mono text-jaia-green tracking-widest uppercase">System Online</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-2">
              Admin<span className="text-transparent bg-clip-text bg-gradient-to-r from-jaia-green via-emerald-400 to-cyan-400">Portal</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm font-mono hidden sm:block">Manage ecosystem • Users • Platform data</p>
          </div>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-jaia-green to-emerald-500 hover:from-jaia-green/90 hover:to-emerald-500/90 text-black font-bold shadow-[0_0_30px_rgba(74,222,128,0.3)] px-8">
            <Download className="w-4 h-4 mr-2" /> Export Reports
          </Button>
        </div>

        {/* Bespoke Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          <BespokeStatCard
            index={0}
            title="Total Users"
            value={users.length.toString()}
            icon={Users}
            gradient="from-blue-500 via-cyan-500 to-blue-600"
            accentColor="text-blue-400"
            trend="+12%"
          />
          <BespokeStatCard
            index={1}
            title="Active"
            value={users.filter(u => u.membership_status === 'active').length.toString()}
            icon={Zap}
            gradient="from-emerald-500 via-jaia-green to-green-600"
            accentColor="text-emerald-400"
            trend="94%"
          />
          <BespokeStatCard
            index={2}
            title="Events"
            value="24"
            icon={Calendar}
            gradient="from-purple-500 via-pink-500 to-purple-600"
            accentColor="text-purple-400"
            trend="Live"
          />
          <BespokeStatCard
            index={3}
            title="Health"
            value="99.9%"
            icon={Shield}
            gradient="from-amber-500 via-orange-500 to-amber-600"
            accentColor="text-amber-400"
            trend="Secure"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-start overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center md:justify-start">
            <TabsList className="bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/5 p-1 rounded-full gap-1 inline-flex">
              <TabsTrigger value="users" className="rounded-full px-3 sm:px-6 py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 whitespace-nowrap text-sm"><Users className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Users</span></TabsTrigger>
              <TabsTrigger value="events" className="rounded-full px-3 sm:px-6 py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 whitespace-nowrap text-sm"><Calendar className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Events</span></TabsTrigger>
              <TabsTrigger value="committees" className="rounded-full px-3 sm:px-6 py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 whitespace-nowrap text-sm"><Globe className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Committees</span></TabsTrigger>
              <TabsTrigger value="audit" className="rounded-full px-3 sm:px-6 py-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 whitespace-nowrap text-sm"><Shield className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Audit</span></TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users">
            <GlassCard className="p-0">
              <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1 max-w-md group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-jaia-green transition-colors" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-10 bg-black/40 border-white/10 text-white focus:border-jaia-green/50 rounded-xl"
                  />
                </div>
              </div>


              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto min-h-[400px]">
                <Table>
                  <TableHeader className="bg-white/[0.02]">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="w-[50px]"><Checkbox checked={selectedUserIds.size > 0 && selectedUserIds.size === paginatedUsers.length} onCheckedChange={toggleSelectAll} /></TableHead>
                      <TableHead className="text-xs uppercase text-gray-500">User</TableHead>
                      <TableHead className="text-xs uppercase text-gray-500">Tier</TableHead>
                      <TableHead className="text-xs uppercase text-gray-500">Status</TableHead>
                      <TableHead className="text-xs uppercase text-gray-500 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                        <TableCell><Checkbox checked={selectedUserIds.has(user.id)} onCheckedChange={() => toggleSelectUser(user.id)} /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold">
                              {user.full_name?.[0] || '?'}
                            </div>
                            <div>
                              <div className="font-medium text-white">{user.full_name || 'User'}</div>
                              <div className="text-[10px] text-gray-600 font-mono">{user.email || user.id.slice(0, 12)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="bg-white/[0.02] border-white/10 text-gray-400">{user.membership_tier}</Badge></TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] border ${user.membership_status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.membership_status === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                            {user.membership_status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)} className="h-8 w-8 text-gray-500 hover:text-white">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3 p-4 min-h-[400px]">
                {paginatedUsers.map((user) => (
                  <div key={user.id} className="relative bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.04] transition-colors">
                    {/* Checkbox */}
                    <div className="absolute top-4 right-4">
                      <Checkbox checked={selectedUserIds.has(user.id)} onCheckedChange={() => toggleSelectUser(user.id)} />
                    </div>

                    {/* User Info */}
                    <div className="flex items-start gap-3 mb-3 pr-8">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {user.full_name?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm mb-0.5">{user.full_name || 'User'}</div>
                        <div className="text-xs text-gray-500 font-mono truncate">{user.email || user.id.slice(0, 20)}</div>
                      </div>
                    </div>

                    {/* Badges Row */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-white/[0.02] border-white/10 text-gray-400 text-xs">
                        {user.membership_tier}
                      </Badge>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] border ${user.membership_status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.membership_status === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                        {user.membership_status}
                      </div>
                    </div>

                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                      className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <Pencil className="w-3.5 h-3.5 mr-2" />
                      Edit User
                    </Button>
                  </div>
                ))}
              </div>


              <div className="p-3 sm:p-4 border-t border-white/5 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-500">Page {currentPage} of {totalPages || 1}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 border-white/10"><ArrowLeft className="w-3 h-3" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="w-8 h-8 border-white/10"><ArrowRight className="w-3 h-3" /></Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="events"><EventManagement /></TabsContent>
          <TabsContent value="committees"><CommitteeManagement /></TabsContent>
          <TabsContent value="audit"><AuditLogViewer /></TabsContent>
        </Tabs>

        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="bg-[#0A0A0A] border-white/10 text-white">
            <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div><Label className="text-gray-400">Full Name</Label><Input value={editingUser?.full_name || ''} onChange={e => setEditingUser(prev => prev ? { ...prev, full_name: e.target.value } : null)} className="bg-white/5 border-white/10 text-white" /></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button onClick={handleSaveUser} disabled={saving} className="bg-jaia-green text-black">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
