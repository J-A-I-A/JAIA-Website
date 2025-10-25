import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      case 'GRANT_ADMIN':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'REVOKE_ADMIN':
        return <UserX className="h-4 w-4 text-red-500" />;
      case 'UPDATE_PROFILE':
        return <Edit className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    const variants: { [key: string]: string } = {
      'GRANT_ADMIN': 'bg-green-500 hover:bg-green-500',
      'REVOKE_ADMIN': 'bg-red-500 hover:bg-red-500',
      'UPDATE_PROFILE': 'bg-blue-500 hover:bg-blue-500',
    };

    return (
      <Badge className={variants[action] || 'bg-gray-500 hover:bg-gray-500'}>
        {action.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const formatChanges = (changes: any) => {
    if (!changes) return 'N/A';
    
    try {
      const entries = Object.entries(changes);
      if (entries.length === 0) return 'No changes';
      
      return (
        <div className="space-y-1 text-xs">
          {entries.map(([key, value]: [string, any]) => (
            <div key={key} className="font-mono">
              <span className="text-muted-foreground">{key}:</span>{' '}
              {typeof value === 'object' && value !== null ? (
                <span>
                  <span className="text-red-400">{JSON.stringify(value.old)}</span>
                  {' → '}
                  <span className="text-green-400">{JSON.stringify(value.new)}</span>
                </span>
              ) : (
                JSON.stringify(value)
              )}
            </div>
          ))}
        </div>
      );
    } catch {
      return JSON.stringify(changes);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Audit Log
          </CardTitle>
          <CardDescription>Loading audit trail...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Audit Log
        </CardTitle>
        <CardDescription>
          Track all administrative actions (last 50 entries)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Target User</TableHead>
                  <TableHead>Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No audit logs yet
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.admin_profile?.full_name || 'Unknown Admin'}
                      </TableCell>
                      <TableCell>
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


