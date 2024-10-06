import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from './config';
import { safeFirestoreOperation } from '../utils/errorReporting';
import { toast } from '@/components/ui/use-toast';

const userOperations = {
  createUser: (userData) => 
    safeFirestoreOperation(() => setDoc(doc(db, 'users', userData.uid), userData)),
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
      return usersSnapshot.docs.map(doc => {
        const userData = doc.data();
        const isMarcioPavao = userData.email === 'marcio.pavao@example.com';
        return {
          id: doc.id,
          ...userData,
          avatar: userData.photoURL || 'https://i.pravatar.cc/150',
          name: userData.displayName || 'Unknown User',
          email: userData.email || 'No email',
          title: userData.title || 'No title',
          department: userData.department || 'No department',
          status: isMarcioPavao ? 'Active' : (userData.status || 'Inactive'),
          role: isMarcioPavao ? 'Master' : (userData.role || 'Vendedor'),
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
  },

  updateUserRole: async (userId, newRole) => {
    try {
      await setDoc(doc(db, 'users', userId), { role: newRole }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  getUserRole: async (userId) => {
    try {
      const userDoc = await safeFirestoreOperation(() => getDoc(doc(db, 'users', userId)));
      if (userDoc.exists()) {
        return userDoc.data().role || 'Vendedor';
      }
      return 'Vendedor';
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'Vendedor';
    }
  }
};

export default userOperations;