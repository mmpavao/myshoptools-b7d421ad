import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PersonalInfoForm } from '../Profile/PersonalInfoForm';
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../Auth/AuthProvider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-500';
    case 'Inactive': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const UserActions = ({ user, isMasterAdmin, onEdit, onToggleStatus, onDelete }) => (
  <TableCell className="text-right space-x-2">
    {(isMasterAdmin || user.role !== 'Master') && (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0" 
              onClick={() => onEdit(user)}
              disabled={!isMasterAdmin && (user.role === 'Admin' || user.role === 'Master')}
            >
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
            <PersonalInfoForm user={user} updateUserContext={onEdit} />
          </DialogContent>
        </Dialog>
        
        {isMasterAdmin && (
          <>
            <Button
              variant="outline"
              onClick={() => onToggleStatus(user.id, user.status)}
            >
              {user.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user
                    account and remove all associated data from our servers, including
                    authentication records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(user.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </>
    )}
  </TableCell>
);

export const UserTable = ({ users, onUserUpdate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: currentUser } = useAuth();
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    if (currentUser) {
      firebaseOperations.getUserRole(currentUser.uid).then(setCurrentUserRole);
    }
  }, [currentUser]);

  const isMasterAdmin = currentUserRole === 'Master';

  const handleRoleChange = async (userId, newRole) => {
    try {
      await firebaseOperations.updateUserRole(userId, newRole);
      onUserUpdate();
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`,
        variant: "success",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    await firebaseOperations.updateUserStatus(userId, newStatus);
    onUserUpdate();
  };

  const handleDeleteUser = async (userId) => {
    try {
      await firebaseOperations.deleteUser(userId);
      toast({
        title: "User Deleted",
        description: "The user has been completely removed from the system.",
        variant: "success",
      });
      onUserUpdate();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
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
              {user.role === 'Master' ? (
                <Badge>Master</Badge>
              ) : (
                <Select
                  value={user.role}
                  onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                  disabled={!isMasterAdmin}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vendedor">Vendedor</SelectItem>
                    <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    {isMasterAdmin && <SelectItem value="Master">Master</SelectItem>}
                  </SelectContent>
                </Select>
              )}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline" className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>{user.isOnline ? 'Online' : 'Offline'}</span>
              </Badge>
            </TableCell>
            <UserActions
              user={user}
              isMasterAdmin={isMasterAdmin}
              onEdit={setSelectedUser}
              onToggleStatus={handleToggleUserStatus}
              onDelete={handleDeleteUser}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
