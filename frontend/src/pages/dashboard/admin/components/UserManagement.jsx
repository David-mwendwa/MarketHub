import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  UserPlus,
  Shield,
  UserCheck,
  UserX,
  MoreHorizontal,
  Download,
  ChevronDown,
  SlidersHorizontal,
  BarChart2,
  ShoppingBag,
  Package,
  Users as UsersIcon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
} from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Checkbox } from '@components/ui/Checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@components/ui/DropdownMenu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    dateRange: 'all',
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock user data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'buyer',
      status: 'active',
      joined: '2023-01-15',
      lastActive: '2023-11-20T14:30:00',
      orders: 12,
      totalSpent: 2450.75,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'seller',
      status: 'active',
      joined: '2023-02-20',
      lastActive: '2023-11-21T09:15:00',
      products: 24,
      totalSales: 12890.5,
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      joined: '2023-01-05',
      lastActive: '2023-11-22T16:45:00',
    },
    {
      id: 4,
      name: 'Inactive User',
      email: 'inactive@example.com',
      role: 'buyer',
      status: 'inactive',
      joined: '2023-03-10',
      lastActive: '2023-09-15T11:20:00',
      orders: 3,
      totalSpent: 450.0,
    },
  ];

  // Calculate statistics
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === 'active').length,
      buyers: users.filter((u) => u.role === 'buyer').length,
      sellers: users.filter((u) => u.role === 'seller').length,
      admins: users.filter((u) => u.role === 'admin').length,
      inactive: users.filter((u) => u.status === 'inactive').length,
    }),
    [users]
  );

  // Filter users based on search and filters
  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch =
          searchQuery === '' ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole =
          filters.role === 'all' || user.role === filters.role;
        const matchesStatus =
          filters.status === 'all' || user.status === filters.status;

        // Simple date range filter
        const matchesDateRange =
          filters.dateRange === 'all' ||
          (filters.dateRange === 'today' &&
            new Date(user.joined).toDateString() === new Date().toDateString());

        return (
          matchesSearch && matchesRole && matchesStatus && matchesDateRange
        );
      }),
    [users, searchQuery, filters]
  );

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    setSelectedUsers((prev) =>
      prev.length === filteredUsers.length
        ? []
        : filteredUsers.map((user) => user.id)
    );
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    alert(`Successfully ${action}d ${selectedUsers.length} user(s)`);
    setSelectedUsers([]);
  };

  // Helper functions
  const getRoleBadge = (role) =>
    ({
      admin: 'bg-purple-100 text-purple-800',
      seller: 'bg-blue-100 text-blue-800',
      buyer: 'bg-gray-100 text-gray-800',
    })[role] || 'bg-gray-100 text-gray-800';

  const getStatusBadge = (status) =>
    status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';

  const getRoleIcon = (role) =>
    ({
      admin: <Shield className='h-3.5 w-3.5 mr-1' />,
      seller: <UserCheck className='h-3.5 w-3.5 mr-1' />,
      buyer: <User className='h-3.5 w-3.5 mr-1' />,
    })[role] || <User className='h-3.5 w-3.5 mr-1' />;

  return (
    <div className='space-y-6'>
      {/* Header and Actions */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold'>User Management</h2>
          <p className='text-sm text-muted-foreground'>
            Manage and monitor all user accounts and their activities
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
          <Button variant='outline' className='w-full sm:w-auto'>
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
          <Button className='w-full sm:w-auto'>
            <UserPlus className='h-4 w-4 mr-2' />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <UsersIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total}</div>
            <p className='text-xs text-muted-foreground'>
              {stats.active} active users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Buyers</CardTitle>
            <User className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.buyers}</div>
            <p className='text-xs text-muted-foreground'>Active buyers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Sellers</CardTitle>
            <UserCheckIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.sellers}</div>
            <p className='text-xs text-muted-foreground'>Active sellers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Inactive</CardTitle>
            <UserXIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.inactive}</div>
            <p className='text-xs text-muted-foreground'>Inactive accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search users by name or email...'
            className='pl-9'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full sm:w-auto'>
              <SlidersHorizontal className='h-4 w-4 mr-2' />
              Filter
              {Object.values(filters).some((f) => f !== 'all') && (
                <span className='ml-2 rounded-full bg-primary text-primary-foreground h-5 w-5 flex items-center justify-center text-xs'>
                  {Object.values(filters).filter((f) => f !== 'all').length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <div className='p-2 space-y-2'>
              <div>
                <p className='text-xs font-medium text-muted-foreground mb-1'>
                  Role
                </p>
                <Select
                  value={filters.role}
                  onValueChange={(value) =>
                    setFilters({ ...filters, role: value })
                  }>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='All Roles' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Roles</SelectItem>
                    <SelectItem value='buyer'>Buyer</SelectItem>
                    <SelectItem value='seller'>Seller</SelectItem>
                    <SelectItem value='admin'>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className='text-xs font-medium text-muted-foreground mb-1'>
                  Status
                </p>
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters({ ...filters, status: value })
                  }>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='All Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex justify-between pt-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() =>
                    setFilters({ role: 'all', status: 'all', dateRange: 'all' })
                  }
                  className='text-xs h-8'>
                  Reset Filters
                </Button>
                <Button
                  size='sm'
                  onClick={() => setIsFilterOpen(false)}
                  className='text-xs h-8'>
                  Apply
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className='bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='select-all'
              checked={selectedUsers.length === filteredUsers.length}
              onCheckedChange={toggleSelectAll}
            />
            <label
              htmlFor='select-all'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              {selectedUsers.length} selected
            </label>
          </div>

          <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-sm text-muted-foreground'>Bulk actions:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='h-8'>
                  <span>Actions</span>
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                  <UserCheck className='mr-2 h-4 w-4' />
                  <span>Activate</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkAction('deactivate')}>
                  <UserX className='mr-2 h-4 w-4' />
                  <span>Deactivate</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleBulkAction('delete')}
                  className='text-red-600'>
                  <UserX className='mr-2 h-4 w-4' />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant='ghost'
              size='sm'
              className='h-8 text-muted-foreground hover:text-foreground'
              onClick={() => setSelectedUsers([])}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className='rounded-md border'>
        <div className='relative w-full overflow-auto'>
          <table className='w-full caption-bottom text-sm'>
            <thead className='[&_tr]:border-b'>
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12'>
                  <Checkbox
                    id='select-all-checkbox'
                    className='translate-y-[-2px]'
                    checked={
                      selectedUsers.length > 0 &&
                      selectedUsers.length === filteredUsers.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
                  <div className='flex items-center'>
                    User
                    <button className='ml-2 opacity-50 hover:opacity-100'>
                      <ChevronDown className='h-4 w-4' />
                    </button>
                  </div>
                </th>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
                  <div className='flex items-center'>
                    Role
                    <button className='ml-2 opacity-50 hover:opacity-100'>
                      <ChevronDown className='h-4 w-4' />
                    </button>
                  </div>
                </th>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
                  <div className='flex items-center'>
                    Status
                    <button className='ml-2 opacity-50 hover:opacity-100'>
                      <ChevronDown className='h-4 w-4' />
                    </button>
                  </div>
                </th>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>
                  <div className='flex items-center'>
                    Joined
                    <button className='ml-2 opacity-50 hover:opacity-100'>
                      <ChevronDown className='h-4 w-4' />
                    </button>
                  </div>
                </th>
                <th className='h-12 px-4 text-right align-middle font-medium text-muted-foreground'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='[&_tr:last-child]:border-0'>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan='6'
                    className='h-24 text-center text-muted-foreground'>
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b transition-colors hover:bg-muted/50 ${
                      selectedUsers.includes(user.id)
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : ''
                    }`}>
                    <td className='p-4 align-middle'>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </td>
                    <td className='p-4 align-middle'>
                      <div className='flex items-center'>
                        <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3'>
                          <User className='h-5 w-5 text-muted-foreground' />
                        </div>
                        <div>
                          <div className='font-medium'>{user.name}</div>
                          <div className='text-sm text-muted-foreground'>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='p-4 align-middle'>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadge(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                    </td>
                    <td className='p-4 align-middle'>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(user.status)}`}>
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        {user.lastActive && (
                          <span className='text-xs text-muted-foreground'>
                            Last active:{' '}
                            {new Date(user.lastActive).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='p-4 align-middle'>
                      <div className='flex flex-col'>
                        <span className='text-sm text-muted-foreground'>
                          {new Date(user.joined).toLocaleDateString()}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {new Date(user.joined).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className='p-4 text-right align-middle'>
                      <div className='flex justify-end items-center gap-2'>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <User className='h-4 w-4' />
                          <span className='sr-only'>View Profile</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8'>
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>More actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>
                              <User className='mr-2 h-4 w-4' />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart2 className='mr-2 h-4 w-4' />
                              <span>View Activity</span>
                            </DropdownMenuItem>
                            {user.role === 'buyer' && (
                              <DropdownMenuItem>
                                <ShoppingBag className='mr-2 h-4 w-4' />
                                <span>View Orders</span>
                              </DropdownMenuItem>
                            )}
                            {user.role === 'seller' && (
                              <DropdownMenuItem>
                                <Package className='mr-2 h-4 w-4' />
                                <span>View Products</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {user.status === 'active' ? (
                              <DropdownMenuItem>
                                <UserX className='mr-2 h-4 w-4' />
                                <span>Deactivate</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <UserCheck className='mr-2 h-4 w-4' />
                                <span>Activate</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-red-600'>
                              <UserX className='mr-2 h-4 w-4' />
                              <span>Delete User</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t'>
          <div className='text-sm text-muted-foreground'>
            Showing <span className='font-medium'>1</span> to{' '}
            <span className='font-medium'>{filteredUsers.length}</span> of{' '}
            <span className='font-medium'>{users.length}</span> users
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' size='sm' disabled>
              Previous
            </Button>
            <Button variant='outline' size='sm' disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
