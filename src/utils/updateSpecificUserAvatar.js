import firebaseOperations from '../firebase/firebaseOperations';

export const updateSpecificUserAvatar = async (email, avatarUrl) => {
  try {
    // First, get the user by email
    const users = await firebaseOperations.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's avatar
    await firebaseOperations.updateUserAvatar(user.id, avatarUrl);
    
    console.log(`Avatar updated successfully for user: ${email}`);
    return true;
  } catch (error) {
    console.error('Error updating specific user avatar:', error);
    throw error;
  }
};