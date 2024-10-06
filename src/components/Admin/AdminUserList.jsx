import React, { useState, useEffect } from 'react';
import firebaseOperations from '../../firebase/firebaseOperations';
import AdminUserTable from './AdminUserTable';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await firebaseOperations.getAllUsers();
    setUsers(fetchedUsers);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <AdminUserTable users={users} />
    </div>
  );
};

export default AdminUserList;