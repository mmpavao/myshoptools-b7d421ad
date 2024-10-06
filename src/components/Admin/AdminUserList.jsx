import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from './UserTable';
import { Button } from "@/components/ui/button";
import Alert from '../ui/Alert';
import firebaseOperations from '../../firebase/firebaseOperations';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await firebaseOperations.getAllUsers();
    setUsers(fetchedUsers);
  };

  const groupUsersByRole = () => {
    return users.reduce((acc, user) => {
      const role = user.role || 'Vendedor';
      if (!acc[role]) acc[role] = [];
      acc[role].push(user);
      return acc;
    }, {});
  };

  const groupedUsers = groupUsersByRole();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">User Management</h1>
      
      <Alert type="info" message="Here you can manage users and view their details." />
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <Tabs defaultValue="vendor">
          <TabsList>
            <TabsTrigger value="vendor">Vendor Users</TabsTrigger>
            <TabsTrigger value="provider">Provider Users</TabsTrigger>
            <TabsTrigger value="admin">Admin Users</TabsTrigger>
          </TabsList>
          <TabsContent value="vendor">
            <UserTable users={groupedUsers['Vendedor'] || []} onUserUpdate={fetchUsers} />
          </TabsContent>
          <TabsContent value="provider">
            <UserTable users={groupedUsers['Fornecedor'] || []} onUserUpdate={fetchUsers} />
          </TabsContent>
          <TabsContent value="admin">
            <UserTable users={[...(groupedUsers['Admin'] || []), ...(groupedUsers['Master'] || [])]} onUserUpdate={fetchUsers} />
          </TabsContent>
        </Tabs>
        <Button onClick={fetchUsers} className="mt-4">Atualizar Lista de Usuários</Button>
      </div>
    </div>
  );
};

export default AdminUserList;