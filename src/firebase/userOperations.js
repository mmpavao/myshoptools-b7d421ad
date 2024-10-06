import { db, auth, storage } from './config';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { updateProfile, deleteUser as deleteAuthUser } from 'firebase/auth';
import { ref, deleteObject } from 'firebase/storage';
import { toast } from '@/components/ui/use-toast';
import { safeFirestoreOperation } from '../utils/errorReporting';

const MASTER_USER_EMAIL = 'pavaosmart@gmail.com';
const ADMIN_USER_EMAIL = 'marcio@talkmaker.io';

const createUser = (userData) => 
  safeFirestoreOperation(() => setDoc(doc(db, 'users', userData.uid), {
    ...userData,
    role: userData.email === MASTER_USER_EMAIL ? 'Master' : (userData.email === ADMIN_USER_EMAIL ? 'Admin' : 'Vendedor'),
    status: 'Active',
  }));

const updateUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'users', userId), profileData, { merge: true });
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      });
    }
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const currentUser = auth.currentUser;
    return usersSnapshot.docs.map(doc => {
      const userData = doc.data();
      const isMasterUser = userData.email === MASTER_USER_EMAIL;
      const isAdminUser = userData.email === ADMIN_USER_EMAIL;
      return {
        id: doc.id,
        ...userData,
        avatar: userData.photoURL || 'https://i.pravatar.cc/150',
        name: userData.displayName || 'Unknown User',
        email: userData.email || 'No email',
        title: userData.title || 'No title',
        department: userData.department || 'No department',
        status: isMasterUser ? 'Active' : (userData.status || 'Inactive'),
        role: isMasterUser ? 'Master' : (isAdminUser ? 'Admin' : (userData.role || 'Vendedor')),
        isOnline: doc.id === currentUser?.uid,
      };
    });
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

const updateUserRole = async (userId, newRole) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    if (userData.email === MASTER_USER_EMAIL) {
      throw new Error('Cannot change Master user role');
    }

    await updateDoc(doc(db, 'users', userId), { role: newRole });
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}.`,
      variant: "success",
    });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    toast({
      title: "Error",
      description: "Failed to update user role. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.email === MASTER_USER_EMAIL) return 'Master';
      if (userData.email === ADMIN_USER_EMAIL) return 'Admin';
      return userData.role || 'Vendedor';
    }
    return 'Vendedor';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'Vendedor';
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

    // Delete user from Authentication
    const user = await auth.getUser(userId);
    if (user) {
      await deleteAuthUser(user);
    }

    // Delete user document from Firestore
    await deleteDoc(doc(db, 'users', userId));

    // Delete imported products
    const importedProductsRef = collection(db, 'users', userId, 'produtosImportados');
    const importedProductsSnapshot = await getDocs(importedProductsRef);
    await Promise.all(importedProductsSnapshot.docs.map(doc => deleteDoc(doc.ref)));

    // Delete user orders
    const ordersRef = collection(db, 'orders');
    const userOrdersQuery = query(ordersRef, where('userId', '==', userId));
    const userOrdersSnapshot = await getDocs(userOrdersQuery);
    await Promise.all(userOrdersSnapshot.docs.map(doc => deleteDoc(doc.ref)));

    // Delete user's profile image from Storage
    const storageRef = ref(storage, `avatars/${userId}`);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.log('No profile image to delete or error deleting image:', error);
    }

    console.log('User and associated data deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting user and associated data:', error);
    throw error;
  }
};

export {
  createUser,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  getUserRole,
  updateUserStatus,
  deleteUser
};