import { db, auth } from './config';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { updateProfile, deleteUser as deleteAuthUser } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast';

const MASTER_USER_EMAIL = 'pavaosmart@gmail.com';
const ADMIN_USER_EMAIL = 'marcio@talkmaker.io';

export const userRoles = {
  MASTER: 'Master',
  ADMIN: 'Admin',
  VENDOR: 'Vendedor',
  PROVIDER: 'Fornecedor'
};

const createUser = async (userData) => {
  try {
    let role = userRoles.VENDOR;
    if (userData.email === MASTER_USER_EMAIL) {
      role = userRoles.MASTER;
    } else if (userData.email === ADMIN_USER_EMAIL) {
      role = userRoles.ADMIN;
    }
    
    await setDoc(doc(db, 'users', userData.uid), {
      ...userData,
      role,
      status: 'Active',
    });
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role || userRoles.VENDOR;
    }
    return userRoles.VENDOR;
  } catch (error) {
    console.error('Error getting user role:', error);
    return userRoles.VENDOR;
  }
};

const updateUserRole = async (userId, newRole, currentUserRole) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    const userData = userDoc.data();

    if (userData.email === MASTER_USER_EMAIL) {
      throw new Error('Cannot change Master user role');
    }

    if (currentUserRole !== userRoles.MASTER && 
       (userData.role === userRoles.ADMIN || newRole === userRoles.MASTER)) {
      throw new Error('Only Master can change Admin role or assign Master role');
    }

    await updateDoc(doc(db, 'users', userId), { role: newRole });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      avatar: doc.data().photoURL || 'https://i.pravatar.cc/150',
      name: doc.data().displayName || 'Unknown User',
      email: doc.data().email || 'No email',
      status: doc.data().status || 'Inactive',
      role: doc.data().role || userRoles.VENDOR,
      isOnline: false, // You might want to implement a proper online status check
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    toast({
      title: "Error",
      description: "Failed to fetch users. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

const updateUserStatus = async (userId, newStatus) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    if (userData.email === MASTER_USER_EMAIL) {
      throw new Error('Cannot change Master user status');
    }

    await updateDoc(doc(db, 'users', userId), { status: newStatus });
    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    if (userData.email === MASTER_USER_EMAIL) {
      throw new Error('Cannot delete Master user');
    }

    await deleteAuthUser(await auth.getUser(userId));
    await deleteDoc(doc(db, 'users', userId));

    // Delete associated data (you might want to implement this based on your data structure)
    // For example:
    // await deleteAssociatedData('orders', 'userId', userId);
    // await deleteAssociatedData('products', 'userId', userId);

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const checkUserStatus = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.email === MASTER_USER_EMAIL) {
        return true;
      }
      return userData.status === 'Active';
    }
    return false;
  } catch (error) {
    console.error('Error checking user status:', error);
    return false;
  }
};

export {
  createUser,
  getUserRole,
  updateUserRole,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  checkUserStatus,
};