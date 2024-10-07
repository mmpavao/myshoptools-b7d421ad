import { db } from './config';
import { doc, updateDoc } from 'firebase/firestore';
import { userRoles } from './userOperations';

const MASTER_USER_ID = 'n3WZCHKhQacnxchDwl3nCEW7mUB3';

export const updateMasterUser = async () => {
  try {
    const userRef = doc(db, 'users', MASTER_USER_ID);
    await updateDoc(userRef, {
      role: userRoles.MASTER,
      status: 'Active'
    });
    console.log('Master user updated successfully');
  } catch (error) {
    console.error('Error updating master user:', error);
  }
};