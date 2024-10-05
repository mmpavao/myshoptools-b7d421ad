import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadImage = async (file, userId, folder) => {
  if (!userId) {
    throw new Error("User ID is required for uploading images");
  }

  try {
    const storageRef = ref(storage, `${folder}/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};