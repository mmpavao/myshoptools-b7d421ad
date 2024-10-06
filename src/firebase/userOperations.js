import { db } from './config';
import { getDoc, doc } from 'firebase/firestore';
import { safeFirestoreOperation } from '../utils/errorReporting';

const MASTER_USER_EMAIL = 'pavaosmart@gmail.com';

export const getUserRole = async (userId) => {
  try {
    const userDoc = await safeFirestoreOperation(() => getDoc(doc(db, 'users', userId)));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.email === MASTER_USER_EMAIL ? 'Master' : (userData.role || 'Vendedor');
    }
    return 'Vendedor';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'Vendedor';
  }
};

// Export other functions if needed
// export const otherFunction = ...