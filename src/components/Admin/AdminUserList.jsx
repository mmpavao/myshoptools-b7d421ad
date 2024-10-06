import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import firebaseOperations from '../../firebase/firebaseOperations';
import Alert from '../ui/Alert';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await firebaseOperations.getAllUsers();
    // Ensure Marcio Pavao is set as active and master user
    const updatedUsers = fetchedUsers.map(user => 
      user.email === 'marcio.pavao@example.com' 
        ? { ...user, status: 'Active', role: 'Master' }
        : user
    );
    setUsers(updatedUsers);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-yellow-500';
      case 'Blocked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">User Management</h1>
      
      <Alert type="info" message="Here you can manage users and view their details." />
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <div className="w-full overflow-auto">
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
                  <TableCell>{user.role || 'No role'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span>{user.isOnline ? 'Online' : 'Offline'}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" className="h-8 w-8 p-0">
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </Button>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-destructive">
                      <span className="sr-only">Delete</span>
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button onClick={fetchUsers} className="mt-4">Atualizar Lista de Usuários</Button>
      </div>
    </div>
  );
};

export default AdminUserList;