import { db, auth } from './config';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { updateProfile, deleteUser as deleteAuthUser } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast';
import { safeFirestoreOperation } from '../utils/errorReporting';

const MASTER_USER_EMAIL = 'pavaosmart@gmail.com';
const ADMIN_USER_EMAIL = 'marcio@talkmaker.io';

const userRoles = {
  MASTER: 'Master',
  ADMIN: 'Admin',
  VENDOR: 'Vendedor',
  PROVIDER: 'Fornecedor'
};

const createUser = (userData) => 
  safeFirestoreOperation(() => setDoc(doc(db, 'users', userData.uid), {
    ...userData,
    role: userData.email === MASTER_USER_EMAIL ? userRoles.MASTER : (userData.email === ADMIN_USER_EMAIL ? userRoles.ADMIN : userRoles.VENDOR),
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
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      avatar: doc.data().photoURL || 'https://i.pravatar.cc/150',
      name: doc.data().displayName || 'Unknown User',
      email: doc.data().email || 'No email',
      title: doc.data().title || 'No title',
      department: doc.data().department || 'No department',
      status: doc.data().email === MASTER_USER_EMAIL ? 'Active' : (doc.data().status || 'Inactive'),
      role: doc.data().email === MASTER_USER_EMAIL ? userRoles.MASTER : (doc.data().email === ADMIN_USER_EMAIL ? userRoles.ADMIN : (doc.data().role || userRoles.VENDOR)),
      isOnline: doc.id === currentUser?.uid,
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

const updateUserRole = async (userId, newRole, currentUserRole) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    if (userData.email === MASTER_USER_EMAIL) {
      throw new Error('Cannot change Master user role');
    }

    if (currentUserRole !== userRoles.MASTER && (userData.role === userRoles.ADMIN || newRole === userRoles.MASTER)) {
      throw new Error('Only Master can change Admin role or assign Master role');
    }

    await updateDoc(doc(db, 'users', userId), { role: newRole });
    
    // Update user claims in Firebase Auth
    const user = await auth.getUser(userId);
    await auth.setCustomUserClaims(user.uid, { role: newRole });

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

const updateUserStatus = async (userId, newStatus) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    if (userData.email === MASTER_USER_EMAIL) {
      throw new Error('Cannot change Master user status');
    }

    await updateDoc(doc(db, 'users', userId), { status: newStatus });

    // Update user claims in Firebase Auth
    const user = await auth.getUser(userId);
    await auth.setCustomUserClaims(user.uid, { ...user.customClaims, status: newStatus });

    toast({
      title: "Status Updated",
      description: `User status has been updated to ${newStatus}.`,
      variant: "success",
    });
    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    toast({
      title: "Error",
      description: "Failed to update user status. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

const checkUserStatus = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Always allow access for the master user
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

const deleteUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    if (userData.email === MASTER_USER_EMAIL) {
      throw new Error('Cannot delete Master user');
    }

    await deleteAuthUser(await auth.getUser(userId));
    await deleteDoc(doc(db, 'users', userId));

    // Delete associated data
    const deleteAssociatedData = async (collectionName, field) => {
      const queryRef = query(collection(db, collectionName), where(field, '==', userId));
      const snapshot = await getDocs(queryRef);
      await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
    };

    await deleteAssociatedData('users/' + userId + '/produtosImportados', 'userId');
    await deleteAssociatedData('orders', 'userId');

    // Delete profile image
    try {
      await deleteObject(ref(storage, `avatars/${userId}`));
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
  deleteUser,
  userRoles,
  checkUserStatus
};
