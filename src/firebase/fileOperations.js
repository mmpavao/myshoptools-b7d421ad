import { storage } from './config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { toast } from '@/components/ui/use-toast';
import userProfileOperations from './userProfileOperations';

const fileOperations = {
  uploadFile: (file, path, onProgress) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  },

  deleteFile: (path) => deleteObject(ref(storage, path)),
  
  listStorageFiles: async () => {
    const folders = ['uploads', 'avatars'];
    let allFiles = [];

    for (const folder of folders) {
      try {
        const res = await listAll(ref(storage, folder));
        const folderFiles = await Promise.all(res.items.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            return { name: itemRef.name, url, folder };
          } catch (error) {
            console.error(`Error getting URL for ${itemRef.name}:`, error);
            return null;
          }
        }));
        allFiles = [...allFiles, ...folderFiles.filter(Boolean)];
      } catch (error) {
        console.error(`Error listing files in ${folder}:`, error);
        toast({
          title: "Listing Error",
          description: `Couldn't list files in ${folder}. Error: ${error.message}`,
          variant: "destructive",
        });
      }
    }

    return allFiles;
  },

  uploadProductImage: (file, productId) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  },

  uploadAvatar: async (file, userId) => {
    if (!file || !userId) {
      throw new Error('Invalid file or user ID');
    }
    const fileExtension = file.name.split('.').pop();
    const path = `avatars/${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, path);
    
    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      await new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          () => {
            resolve();
          }
        );
      });

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      await userProfileOperations.updateUserProfile(userId, { photoURL: downloadURL });
      return downloadURL;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }
};

export default fileOperations;
