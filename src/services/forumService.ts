import { collection, query, orderBy, getDocs, addDoc, doc, getDoc, Timestamp, collectionGroup, deleteDoc, runTransaction, increment, updateDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { Topic, Message } from '../types/forum';

export const getTopics = async (): Promise<Topic[]> => {
  try {
    const topicsRef = collection(firestore, 'foros');
    const q = query(topicsRef, orderBy('creadoEn', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const topics = await Promise.all(querySnapshot.docs.map(async (docRef) => {
      const messagesRef = collection(firestore, `foros/${docRef.id}/mensajes`);
      const messagesSnapshot = await getDocs(messagesRef);
      
      return {
        id: docRef.id,
        ...docRef.data(),
        mensajesCount: messagesSnapshot.size
      } as Topic;
    }));
    
    return topics;
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
      creador: userId,
      creadorNombre: displayName,
      creadoEn: Timestamp.now(),
      mensajesCount: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating topic:', error);
    return null;
  }
};

export const createMessage = async (topicId: string, content: string, userId: string, displayName: string): Promise<string | null> => {
  try {
    const topicRef = doc(firestore, `foros/${topicId}`);
    const messagesRef = collection(firestore, `foros/${topicId}/mensajes`);

    // Add message and update count in a transaction
    await runTransaction(firestore, async (transaction) => {
      // Add the message
      const messageRef = await addDoc(messagesRef, {
        contenido: content,
        autor: userId,
        autorNombre: displayName,
        creadoEn: Timestamp.now()
      });

      // Update topic's message count
      transaction.update(topicRef, {
        mensajesCount: increment(1)
      });

      return messageRef.id;
    });

    return 'success';
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
};

export const deleteTopic = async (topicId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verify user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { 
        success: false, 
        error: 'Usuario no autenticado' 
      };
    }

    // Get topic data to verify ownership
    const topicRef = doc(firestore, `foros/${topicId}`);
    const topicSnap = await getDoc(topicRef);
    
    if (!topicSnap.exists()) {
      return { 
        success: false, 
        error: 'Tema no encontrado' 
      };
    }

    const topicData = topicSnap.data();
    if (topicData.creador !== currentUser.uid) {
      return { 
        success: false, 
        error: 'No tienes permiso para eliminar este tema' 
      };
    }

    // Delete all messages in a transaction
    await runTransaction(firestore, async (transaction) => {
      // Get all messages
      const messagesRef = collection(firestore, `foros/${topicId}/mensajes`);
      const messagesSnapshot = await getDocs(messagesRef);
      
      // Delete each message
      messagesSnapshot.docs.forEach((messageDoc) => {
        transaction.delete(messageDoc.ref);
      });
      
      // Delete the topic document
      transaction.delete(topicRef);
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting topic:', error);
    return { 
      success: false, 
      error: 'Error al eliminar el tema. Por favor, intenta de nuevo.' 
    };
  }
};