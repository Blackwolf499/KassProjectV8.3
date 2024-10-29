import { db, storage } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Document {
  id: string;
  name: string;
  content: string;
  analysis: string;
  fileUrl: string;
  createdAt: Date;
}

export async function saveDocument(
  file: File,
  content: string,
  analysis: string
): Promise<string> {
  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);

    // Save document metadata to Firestore
    const docRef = await addDoc(collection(db, 'documents'), {
      name: file.name,
      content,
      analysis,
      fileUrl,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving document:', error);
    throw new Error('Failed to save document');
  }
}

export async function getDocuments(): Promise<Document[]> {
  try {
    const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Document[];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw new Error('Failed to fetch documents');
  }
}