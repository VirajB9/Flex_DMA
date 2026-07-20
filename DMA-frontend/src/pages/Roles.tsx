import React, { useState, useEffect } from 'react';
import { RoleResponse } from '../types';
import api from '../services/api';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Eye } from 'lucide-react';

export default function Roles() {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingRole, setViewingRole] = useState<RoleResponse | null>(null);

  const openViewModal = async (roleId: string) => {
    try {
      const response = await api.get(`/roles/${roleId}`);
      setViewingRole(response.data);
    } catch (error) {
      toast.error('Failed to fetch role details');
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles');
        setRoles(response.data);
      } catch (error) {
        toast.error('Failed to load roles');
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                  Loading roles...
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openViewModal(role.id)} className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewingRole} onOpenChange={(open) => !open && setViewingRole(null)}>
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
            <DialogDescription>
              Detailed view of the selected role.
            </DialogDescription>
          </DialogHeader>
          {viewingRole && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
                <span className="font-medium text-sm text-gray-500">ID</span>
                <span className="col-span-2 text-xs font-mono">{viewingRole.id}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
                <span className="font-medium text-sm text-gray-500">Name</span>
                <span className="col-span-2 font-semibold text-primary">{viewingRole.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b pb-2">
                <span className="font-medium text-sm text-gray-500">Description</span>
                <span className="col-span-2 text-sm">{viewingRole.description}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingRole(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
