import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../Auth/AuthProvider';
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

  const totalPages = Math.ceil(totalUsers / pageSize);

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
                <Badge>{user.role}</Badge>
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
                  onUserUpdate={onUserUpdate}
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