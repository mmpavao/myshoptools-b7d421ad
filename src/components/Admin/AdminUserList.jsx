import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import firebaseOperations from '../../firebase/firebaseOperations';
import Alert from '../ui/Alert';
import { PersonalInfoForm } from '../Profile/PersonalInfoForm';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await firebaseOperations.getAllUsers();
    setUsers(fetchedUsers);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-yellow-500';
      case 'Blocked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    await firebaseOperations.updateUserRole(userId, newRole);
    fetchUsers();
  };

  const groupUsersByRole = () => {
    return users.reduce((acc, user) => {
      const role = user.role || 'Vendedor';
      if (!acc[role]) acc[role] = [];
      acc[role].push(user);
      return acc;
    }, {});
  };

  const renderUserTable = (users) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Online Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <div className="font-medium">{user.name || 'No name'}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>{user.title || 'No title'}</div>
              <div className="text-sm text-muted-foreground">{user.department || 'No department'}</div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={`${getStatusColor(user.status)} text-white`}>
                {user.status || 'Unknown'}
              </Badge>
            </TableCell>
            <TableCell>
              <Select
                value={user.role}
                onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vendedor">Vendedor</SelectItem>
                  <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline" className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>{user.isOnline ? 'Online' : 'Offline'}</span>
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedUser(user)}>
                    <span className="sr-only">Edit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit User Profile</DialogTitle>
                  </DialogHeader>
                  {selectedUser && (
                    <PersonalInfoForm user={selectedUser} updateUserContext={() => fetchUsers()} />
                  )}
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const groupedUsers = groupUsersByRole();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">User Management</h1>
      
      <Alert type="info" message="Here you can manage users and view their details." />
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="vendor-users">
            <AccordionTrigger>Vendor Users</AccordionTrigger>
            <AccordionContent>
              {renderUserTable(groupedUsers['Vendedor'] || [])}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="provider-users">
            <AccordionTrigger>Provider Users</AccordionTrigger>
            <AccordionContent>
              {renderUserTable(groupedUsers['Fornecedor'] || [])}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="admin-users">
            <AccordionTrigger>Admin Users</AccordionTrigger>
            <AccordionContent>
              {renderUserTable([...(groupedUsers['Admin'] || []), ...(groupedUsers['Master'] || [])])}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button onClick={fetchUsers} className="mt-4">Atualizar Lista de Usuários</Button>
      </div>
    </div>
  );
};

export default AdminUserList;