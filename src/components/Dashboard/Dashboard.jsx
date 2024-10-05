import React from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '../ui/button';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to MyShopTools Dashboard</h1>
      <p className="mb-4">Logged in as: {user?.email}</p>
      <div className="space-x-4">
        <Link to="/profile">
          <Button variant="outline">Update Profile</Button>
        </Link>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;