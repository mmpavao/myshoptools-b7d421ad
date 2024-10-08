import { db, auth } from './config';
import { doc, getDoc, setDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { sendPasswordResetEmail as firebaseSendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast';
import { MASTER_USER_EMAIL, userRoles } from '../utils/userConstants';

const firebaseOperations = {
  createUser: async (userData) => {
    try {
      await setDoc(doc(db, 'users', userData.uid), {
        ...userData,
        role: userData.email === MASTER_USER_EMAIL ? userRoles.MASTER : userData.role,
        status: 'Active',
      });
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUserProfile: async (userId, profileData) => {
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
        role: doc.data().email === MASTER_USER_EMAIL ? userRoles.MASTER : (doc.data().role || userRoles.VENDOR),
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

  sendPasswordResetEmail: async (email) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição de senha:', error);
      throw error;
    }
  },

  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
};

export default firebaseOperations;