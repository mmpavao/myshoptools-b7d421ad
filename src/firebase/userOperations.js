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
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        avatar: doc.data().photoURL || 'https://i.pravatar.cc/150',
        name: doc.data().displayName || 'Unknown User',
        email: doc.data().email || 'No email',
        title: doc.data().title || 'No title',
        department: doc.data().department || 'No department',
        status: doc.data().status || 'Inactive',
        role: doc.data().role || 'User',
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
  }
};

export default userOperations;