import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, UserCheck, UserX, Edit, AlertCircle } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  target_user_id: string | null;
  target_table: string | null;
  old_values: any;
  new_values: any;
  created_at: string;
  admin_profile?: {
    full_name: string | null;
  };
  target_profile?: {
    full_name: string | null;
  };
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select(`
          *,
          admin_profile:profiles!admin_id(full_name),
          target_profile:profiles!target_user_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching audit logs:', error);
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'GRANT_ADMIN': return <UserCheck className="h-4 w-4 text-green-400" />;
      case 'REVOKE_ADMIN': return <UserX className="h-4 w-4 text-red-400" />;
      case 'UPDATE_PROFILE': return <Edit className="h-4 w-4 text-blue-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    const variants: { [key: string]: string } = {
      'GRANT_ADMIN': 'bg-green-500/10 text-green-400 border-green-500/20',
      'REVOKE_ADMIN': 'bg-red-500/10 text-red-400 border-red-500/20',
      'UPDATE_PROFILE': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };

    return (
      <Badge variant="outline" className={`border ${variants[action] || 'border-gray-500 text-gray-400'}`}>
        {action.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const formatChanges = (changes: any) => {
    if (!changes) return <span className="text-gray-600">N/A</span>;

    try {
      const entries = Object.entries(changes);
      if (entries.length === 0) return <span className="text-gray-600">No changes</span>;

      return (
        <div className="space-y-1 text-xs">
          {entries.map(([key, value]: [string, any]) => (
            <div key={key} className="font-mono flex items-start gap-2">
              <span className="text-gray-500 shrink-0">{key}:</span>{' '}
              {typeof value === 'object' && value !== null ? (
                <span>
                  <span className="text-red-400/80 line-through mr-2">{JSON.stringify(value.old)}</span>
                  <span className="text-green-400">{JSON.stringify(value.new)}</span>
                </span>
              ) : (
                <span className="text-gray-300">{JSON.stringify(value)}</span>
              )}
            </div>
          ))}
        </div>
      );
    } catch {
      return <span className="text-gray-300">{JSON.stringify(changes)}</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500 flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading trails...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Shield className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Security Audit Log</h3>
          <p className="text-sm text-gray-400">Track all administrative actions (last 50 entries)</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader className="bg-white/5 sticky top-0 backdrop-blur-md">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-white">Timestamp</TableHead>
                <TableHead className="text-white">Action</TableHead>
                <TableHead className="text-white">Admin</TableHead>
                <TableHead className="text-white">Target User</TableHead>
                <TableHead className="text-white">Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center text-gray-500 py-12">
                    No security logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-mono text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        {getActionBadge(log.action)}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {log.admin_profile?.full_name || 'Unknown Admin'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {log.target_profile?.full_name ||
                        (log.target_user_id ? log.target_user_id.substring(0, 8) + '...' : 'N/A')}
                    </TableCell>
                    <TableCell className="max-w-md">
                      {formatChanges(log.new_values)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
