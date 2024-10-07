import { db, auth, storage } from './config';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { updateProfile, deleteUser as deleteAuthUser, sendPasswordResetEmail as firebaseSendPasswordResetEmail } from 'firebase/auth';
import { ref, deleteObject } from 'firebase/storage';
import { toast } from '@/components/ui/use-toast';
import { safeFirestoreOperation } from '../utils/errorReporting';
import { MASTER_USER_EMAIL, ADMIN_USER_EMAIL, userRoles } from '../utils/userConstants';

const userOperations = {
  createUser: (userData) => 
    safeFirestoreOperation(() => setDoc(doc(db, 'users', userData.uid), {
      ...userData,
      role: userData.email === MASTER_USER_EMAIL ? userRoles.MASTER : (userData.email === ADMIN_USER_EMAIL ? userRoles.ADMIN : userRoles.VENDOR),
      status: 'Active',
    })),

  updateUserProfile: async (userId, profileData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, profileData);
      
      if (auth.currentUser && auth.currentUser.uid === userId) {
        const updateData = {};
        if (profileData.displayName) updateData.displayName = profileData.displayName;
        if (profileData.photoURL) updateData.photoURL = profileData.photoURL;
        
        if (Object.keys(updateData).length > 0) {
          await updateProfile(auth.currentUser, updateData);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
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
  },

  updateUserRole: async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  updateUserStatus: async (userId, newStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status: newStatus });
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  getUserRole: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.email === MASTER_USER_EMAIL) return userRoles.MASTER;
        if (userData.email === ADMIN_USER_EMAIL) return userRoles.ADMIN;
        return userData.role || userRoles.VENDOR;
      }
      return userRoles.VENDOR;
    } catch (error) {
      console.error('Error getting user role:', error);
      return userRoles.VENDOR;
    }
  },

  checkUserStatus: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.email === MASTER_USER_EMAIL || userData.status === 'Active';
      }
      return false;
    } catch (error) {
      console.error('Error checking user status:', error);
      return false;
    }
  },

  deleteUser: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();

      if (userData.email === MASTER_USER_EMAIL) {
        throw new Error('Cannot delete Master user');
      }

      await deleteAuthUser(await auth.getUser(userId));
      await deleteDoc(doc(db, 'users', userId));

      const deleteAssociatedData = async (collectionName, field) => {
        const queryRef = query(collection(db, collectionName), where(field, '==', userId));
        const snapshot = await getDocs(queryRef);
        await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
      };

      await deleteAssociatedData('users/' + userId + '/produtosImportados', 'userId');
      await deleteAssociatedData('orders', 'userId');

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
  },

  sendPasswordResetEmail: async (email) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  updateUserSettings: async (userId, settings) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, settings);
      return true;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },
};

export const { getUserRole, getAllUsers, checkUserStatus, updateUserRole, updateUserStatus, getUserById } = userOperations;
export default userOperations;
