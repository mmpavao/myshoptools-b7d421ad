import { db, storage } from './config';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { safeFirestoreOperation } from '../utils/errorReporting';
import { toast } from '@/components/ui/use-toast';

export const createDocument = (collectionName, data) => 
  safeFirestoreOperation(() => addDoc(collection(db, collectionName), data));

export const readDocument = (collectionName, docId) => 
  safeFirestoreOperation(() => getDoc(doc(db, collectionName, docId)));

export const updateDocument = (collectionName, docId, data) => 
  safeFirestoreOperation(() => updateDoc(doc(db, collectionName, docId), data));

export const deleteDocument = (collectionName, docId) => 
  safeFirestoreOperation(() => deleteDoc(doc(db, collectionName, docId)));

export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  } catch (e) {
    console.error("Error uploading file: ", e);
    throw e;
  }
};

export const deleteFile = (path) => 
  deleteObject(ref(storage, path));

export const testFirebaseOperations = async () => {
  try {
    console.log("Iniciando testes de operações do Firebase...");

    // Teste de criação de documento
    const userDocRef = await createDocument('users', { name: 'Test User', email: 'test@example.com' });
    console.log("Documento de usuário criado com ID:", userDocRef.id);

    // Teste de leitura de documento
    const userDocSnapshot = await readDocument('users', userDocRef.id);
    console.log("Dados do usuário lidos:", userDocSnapshot.data());

    // Teste de atualização de documento
    await updateDocument('users', userDocRef.id, { name: 'Updated Test User' });
    console.log("Dados do usuário atualizados");

    // Teste de leitura do documento atualizado
    const updatedUserDocSnapshot = await readDocument('users', userDocRef.id);
    console.log("Dados atualizados do usuário:", updatedUserDocSnapshot.data());

    // Teste de consulta de documentos
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where("email", "==", "test@example.com"));
    const querySnapshot = await getDocs(q);
    console.log("Resultado da consulta:", querySnapshot.docs.map(doc => doc.data()));

    // Teste de upload de arquivo
    const testFile = new Blob(['Conteúdo do arquivo de teste'], { type: 'text/plain' });
    const filePath = `test/testfile_${Date.now()}.txt`;
    const fileUrl = await uploadFile(testFile, filePath);
    console.log("URL do arquivo enviado:", fileUrl);

    // Teste de exclusão de arquivo
    await deleteFile(filePath);
    console.log("Arquivo excluído");

    // Teste de exclusão de documento
    await deleteDocument('users', userDocRef.id);
    console.log("Documento de usuário excluído");

    // Verificação final
    const deletedUserDoc = await readDocument('users', userDocRef.id);
    if (!deletedUserDoc.exists()) {
      console.log("Documento de usuário não existe mais, confirmando exclusão bem-sucedida");
    }

    toast({
      title: "Testes de Operações do Firebase",
      description: "Todos os testes foram concluídos com sucesso!",
    });
  } catch (error) {
    console.error("Erro durante os testes de operações do Firebase:", error);
    toast({
      title: "Erro nos Testes de Operações do Firebase",
      description: error.message,
      variant: "destructive",
    });
  }
};