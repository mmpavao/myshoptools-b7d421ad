import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './config';
import { safeFirestoreOperation } from '../utils/errorReporting';

const crudOperations = {
  createDocument: (collectionName, data) => 
    safeFirestoreOperation(() => addDoc(collection(db, collectionName), data)),
  readDocument: (collectionName, docId) => 
    safeFirestoreOperation(() => getDoc(doc(db, collectionName, docId))),
  updateDocument: (collectionName, docId, data) => 
    safeFirestoreOperation(() => updateDoc(doc(db, collectionName, docId), data)),
  deleteDocument: (collectionName, docId) => 
    safeFirestoreOperation(() => deleteDoc(doc(db, collectionName, docId)))
};

export default crudOperations;