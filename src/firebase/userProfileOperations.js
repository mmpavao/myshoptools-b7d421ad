import { db, auth } from './config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const userProfileOperations = {
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
  updateUserProfile: async (userId, profileData) => {
    try {
      await setDoc(doc(db, 'users', userId), profileData, { merge: true });
      if (profileData.displayName || profileData.photoURL) {
        await auth.currentUser.updateProfile({
          displayName: profileData.displayName,
          photoURL: profileData.photoURL
        });
      }
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

export default userProfileOperations;