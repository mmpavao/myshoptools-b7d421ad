import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from './UserTable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../Auth/AuthProvider';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [filter, setFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, new: 0, active: 0, inactive: 0 });

  useEffect(() => {
    fetchUsers();
    if (currentUser) {
      firebaseOperations.getUserRole(currentUser.uid).then(setUserRole);
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    const fetchedUsers = await firebaseOperations.getAllUsers();
    setUsers(fetchedUsers);
    calculateStats(fetchedUsers);
  };

  const calculateStats = (userList) => {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    const newStats = {
      total: userList.length,
      new: userList.filter(user => new Date(user.createdAt) > tenDaysAgo).length,
      active: userList.filter(user => user.status === 'Active').length,
      inactive: userList.filter(user => user.status === 'Inactive').length
    };
    setStats(newStats);
  };

  const groupUsersByRole = () => {
    return users.reduce((acc, user) => {
      const role = user.role || 'Vendedor';
      if (!acc[role]) acc[role] = [];
      acc[role].push(user);
      return acc;
    }, {});
  };

  const filteredUsers = (roleUsers) => {
    return roleUsers.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const paginatedUsers = (filteredRoleUsers) => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRoleUsers.slice(startIndex, startIndex + pageSize);
  };

  const groupedUsers = groupUsersByRole();
  const isMasterAdmin = userRole === 'Master';

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">User Management</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.total} icon={Users} />
        <StatCard title="New Users" value={stats.new} icon={UserPlus} />
        <StatCard title="Active Users" value={stats.active} icon={UserCheck} />
        <StatCard title="Inactive Users" value={stats.inactive} icon={UserX} />
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Filter users..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Users per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Tabs defaultValue="vendor">
          <TabsList>
            <TabsTrigger value="vendor">Vendor Users</TabsTrigger>
            <TabsTrigger value="provider">Provider Users</TabsTrigger>
            <TabsTrigger value="admin">Admin Users</TabsTrigger>
            {isMasterAdmin && <TabsTrigger value="master">Master Users</TabsTrigger>}
          </TabsList>
          <TabsContent value="vendor">
            <UserTable 
              users={paginatedUsers(filteredUsers(groupedUsers['Vendedor'] || []))} 
              onUserUpdate={fetchUsers}
              totalUsers={filteredUsers(groupedUsers['Vendedor'] || []).length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </TabsContent>
          <TabsContent value="provider">
            <UserTable 
              users={paginatedUsers(filteredUsers(groupedUsers['Fornecedor'] || []))} 
              onUserUpdate={fetchUsers}
              totalUsers={filteredUsers(groupedUsers['Fornecedor'] || []).length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </TabsContent>
          <TabsContent value="admin">
            <UserTable 
              users={paginatedUsers(filteredUsers(groupedUsers['Admin'] || []))} 
              onUserUpdate={fetchUsers}
              totalUsers={filteredUsers(groupedUsers['Admin'] || []).length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </TabsContent>
          {isMasterAdmin && (
            <TabsContent value="master">
              <UserTable 
                users={paginatedUsers(filteredUsers(groupedUsers['Master'] || []))} 
                onUserUpdate={fetchUsers}
                totalUsers={filteredUsers(groupedUsers['Master'] || []).length}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminUserList;