import React, { useState, useEffect } from 'react';
import { UserResponse, RoleResponse } from '../types';
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
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Edit, Trash2, ShieldAlert, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';

export default function Users() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [viewingUser, setViewingUser] = useState<UserResponse | null>(null);
  const [viewingRole, setViewingRole] = useState<RoleResponse | null>(null);
  const [newlyCreatedUser, setNewlyCreatedUser] = useState<{name: string, email: string, tempPassword: string} | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roleId: '',
  });

  const [roles, setRoles] = useState<RoleResponse[]>([]);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data.content || response.data);
    } catch (error) {
      console.error('Error fetching roles', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // If there's a search term, use /api/users/search, else /api/users
      let url = '/users';
      let params = { size: 20 };
      if (searchTerm) {
        url = '/users/search';
        params = { ...params, keyword: searchTerm } as any;
      }
      
      const response = await api.get(url, { params });
      setUsers(response.data.content);
    } catch (error) {
      console.error('Error fetching users', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [searchTerm]);

  const handleCreateOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user
        await api.put(`/users/${editingUser.id}`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          roleId: formData.roleId || undefined,
        });
        toast.success('User updated successfully');
      } else {
        // Create user
        const response = await api.post('/users', formData);
        setNewlyCreatedUser({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          tempPassword: response.data.temporaryPassword
        });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      let errorMessage = 'Action failed';
      if (error.response?.data) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = data.errors.map((e: any) => e.defaultMessage || e.message || e).join(', ');
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }
      toast.error(errorMessage);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', roleId: '' });
    setIsModalOpen(true);
  };

  const openViewModal = async (user: UserResponse) => {
    try {
      // 1. Get User by ID
      const userRes = await api.get(`/users/${user.id}`);
      setViewingUser(userRes.data);
      
      // 2. Get Role by ID
      const roleId = roles.find((r) => r.name === userRes.data.roleName)?.id;
      if (roleId) {
        const roleRes = await api.get(`/roles/${roleId}`);
        setViewingRole(roleRes.data);
      } else {
        setViewingRole(null);
      }
    } catch (error) {
      toast.error('Failed to fetch details');
    }
  };

  const closeViewModal = () => {
    setViewingUser(null);
    setViewingRole(null);
  };

  const openEditModal = (user: UserResponse) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roleId: roles.find((r) => r.name === user.roleName)?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const toggleStatus = async (user: UserResponse) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/users/${user.id}/status`, { status: newStatus });
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="flex items-center py-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-400">
                      {user.roleName || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openViewModal(user)} className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(user)} className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(user)} className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                        <ShieldAlert className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <form onSubmit={handleCreateOrEdit} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Make changes to the user's profile here."
                  : 'Add a new user to the system.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  maxLength={10}
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) setFormData({ ...formData, phoneNumber: value });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleId">Role</Label>
                <select
                  id="roleId"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingUser} onOpenChange={(open) => !open && closeViewModal()}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Detailed view of the user and their assigned role.
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
                <span className="font-medium text-sm text-gray-500">Full Name</span>
                <span className="col-span-2">{viewingUser.firstName} {viewingUser.lastName}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
                <span className="font-medium text-sm text-gray-500">Email</span>
                <span className="col-span-2">{viewingUser.email}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
                <span className="font-medium text-sm text-gray-500">Phone</span>
                <span className="col-span-2">{viewingUser.phoneNumber}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4 border-b pb-2">
                <span className="font-medium text-sm text-gray-500">Status</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    viewingUser.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-700 ring-green-600/20'
                      : 'bg-red-50 text-red-700 ring-red-600/10'
                  }`}>
                    {viewingUser.status}
                  </span>
                </span>
              </div>
              {viewingRole && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 mt-4 border">
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-primary" /> Role: {viewingRole.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {viewingRole.description}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeViewModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal for New User Password */}
      <Dialog open={!!newlyCreatedUser} onOpenChange={(open) => !open && setNewlyCreatedUser(null)}>
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader>
            <DialogTitle>User Created Successfully! 🎉</DialogTitle>
            <DialogDescription>
              Please copy the temporary password below. The user will need it to log in for the first time.
            </DialogDescription>
          </DialogHeader>
          {newlyCreatedUser && (
            <div className="space-y-4 py-2">
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
                <div className="text-sm text-green-800 dark:text-green-300">
                  <p className="font-semibold mb-1">User Details:</p>
                  <p>Name: {newlyCreatedUser.name}</p>
                  <p>Email: {newlyCreatedUser.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Temporary Password</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    readOnly 
                    value={newlyCreatedUser.tempPassword} 
                    className="font-mono text-lg bg-gray-50 dark:bg-gray-800" 
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigator.clipboard.writeText(newlyCreatedUser.tempPassword);
                      toast.success('Password copied to clipboard!');
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setNewlyCreatedUser(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
