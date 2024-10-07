import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../Auth/AuthProvider';
import { toast } from "@/components/ui/use-toast";
import UserActions from './UserActions';

const getStatusColor = (status) => {
  const colors = { Active: 'bg-green-500', Inactive: 'bg-red-500' };
  return colors[status] || 'bg-gray-500';
};

export const UserTable = ({ users, onUserUpdate, totalUsers, currentPage, pageSize, onPageChange }) => {
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      firebaseOperations.getUserRole(currentUser.uid).then(setCurrentUserRole);
    }
  }, [currentUser]);

  const isMasterAdmin = currentUserRole === firebaseOperations.userRoles.MASTER;

  const handleRoleChange = async (userId, newRole) => {
    try {
      await firebaseOperations.updateUserRole(userId, newRole, currentUserRole);
      onUserUpdate();
      toast({ title: "Role Updated", description: `User role has been updated to ${newRole}.`, variant: "success" });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({ title: "Error", description: error.message || "Failed to update user role. Please try again.", variant: "destructive" });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
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
                <Badge variant="outline" className={`${getStatusColor(user.status)} text-white`}>
                  {user.status || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell>
                {user.role === firebaseOperations.userRoles.MASTER ? (
                  <Badge>Master</Badge>
                ) : (
                  <Select
                    value={user.role}
                    onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                    disabled={!isMasterAdmin || user.role === firebaseOperations.userRoles.MASTER}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={firebaseOperations.userRoles.VENDOR}>Vendedor</SelectItem>
                      <SelectItem value={firebaseOperations.userRoles.PROVIDER}>Fornecedor</SelectItem>
                      <SelectItem value={firebaseOperations.userRoles.ADMIN}>Admin</SelectItem>
                      {isMasterAdmin && <SelectItem value={firebaseOperations.userRoles.MASTER}>Master</SelectItem>}
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
              <TableCell className="text-right">
                <UserActions
                  user={user}
                  isMasterAdmin={isMasterAdmin}
                  onEdit={onUserUpdate}
                  onToggleStatus={handleToggleUserStatus}
                  onDelete={handleDeleteUser}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(Math.max(1, currentPage - 1))} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => onPageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};
