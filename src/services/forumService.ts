import { collection, query, orderBy, getDocs, addDoc, doc, getDoc, Timestamp, collectionGroup } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Topic, Message } from '../types/forum';

export const getTopics = async (): Promise<Topic[]> => {
  try {
    const topicsRef = collection(firestore, 'foros');
    const q = query(topicsRef, orderBy('creadoEn', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Topic));
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
};

export const getTopicMessages = async (topicId: string): Promise<Message[]> => {
  try {
    const messagesRef = collection(firestore, `foros/${topicId}/mensajes`);
    const q = query(messagesRef, orderBy('creadoEn', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const createTopic = async (title: string, description: string, userId: string, displayName: string): Promise<string | null> => {
  try {
    const topicsRef = collection(firestore, 'foros');
    const docRef = await addDoc(topicsRef, {
      titulo: title,
      descripcion: description,
      creador: userId, // Store userId for security rules
      creadorNombre: displayName, // Store display name for UI
      creadoEn: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating topic:', error);
    return null;
  }
};

export const createMessage = async (topicId: string, content: string, userId: string, displayName: string): Promise<string | null> => {
  try {
    const messagesRef = collection(firestore, `foros/${topicId}/mensajes`);
    const docRef = await addDoc(messagesRef, {
      contenido: content,
      autor: userId, // Store userId for security rules
      autorNombre: displayName, // Store display name for UI
      creadoEn: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
};