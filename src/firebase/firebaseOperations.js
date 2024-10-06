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

export const testFirebaseOperations = async (logCallback) => {
  try {
    logCallback({ step: "Iniciando testes", message: "Iniciando testes de operações do Firebase", status: "success" });

    // Teste de criação de documento
    const userDocRef = await createDocument('users', { name: 'Test User', email: 'test@example.com' });
    logCallback({ step: "Criação de documento", message: `Documento de usuário criado com ID: ${userDocRef.id}`, status: "success" });

    // Teste de leitura de documento
    const userDocSnapshot = await readDocument('users', userDocRef.id);
    logCallback({ step: "Leitura de documento", message: "Dados do usuário lidos com sucesso", status: "success" });

    // Teste de atualização de documento
    await updateDocument('users', userDocRef.id, { name: 'Updated Test User' });
    logCallback({ step: "Atualização de documento", message: "Dados do usuário atualizados com sucesso", status: "success" });

    // Teste de leitura do documento atualizado
    const updatedUserDocSnapshot = await readDocument('users', userDocRef.id);
    logCallback({ step: "Leitura de documento atualizado", message: "Dados atualizados do usuário lidos com sucesso", status: "success" });

    // Teste de consulta de documentos
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where("email", "==", "test@example.com"));
    const querySnapshot = await getDocs(q);
    logCallback({ step: "Consulta de documentos", message: `${querySnapshot.docs.length} documento(s) encontrado(s)`, status: "success" });

    // Teste de upload de arquivo
    const testFile = new Blob(['Conteúdo do arquivo de teste'], { type: 'text/plain' });
    const filePath = `test/testfile_${Date.now()}.txt`;
    const fileUrl = await uploadFile(testFile, filePath);
    logCallback({ step: "Upload de arquivo", message: "Arquivo enviado com sucesso", status: "success" });

    // Teste de exclusão de arquivo
    await deleteFile(filePath);
    logCallback({ step: "Exclusão de arquivo", message: "Arquivo excluído com sucesso", status: "success" });

    // Teste de exclusão de documento
    await deleteDocument('users', userDocRef.id);
    logCallback({ step: "Exclusão de documento", message: "Documento de usuário excluído com sucesso", status: "success" });

    // Verificação final
    const deletedUserDoc = await readDocument('users', userDocRef.id);
    if (!deletedUserDoc.exists()) {
      logCallback({ step: "Verificação final", message: "Documento de usuário não existe mais, confirmando exclusão bem-sucedida", status: "success" });
    }

    logCallback({ step: "Conclusão", message: "Todos os testes foram concluídos com sucesso!", status: "success" });

    toast({
      title: "Testes de Operações do Firebase",
      description: "Todos os testes foram concluídos com sucesso!",
    });
  } catch (error) {
    console.error("Erro durante os testes de operações do Firebase:", error);
    logCallback({ step: "Erro", message: `Erro durante os testes: ${error.message}`, status: "error" });
    toast({
      title: "Erro nos Testes de Operações do Firebase",
      description: error.message,
      variant: "destructive",
    });
  }
};