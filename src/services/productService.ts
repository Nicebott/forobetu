import { collection, query, orderBy, getDocs, addDoc, doc, deleteDoc, updateDoc, where, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, auth, storage } from '../firebase';
import { Product, ProductFormData } from '../types/product';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(firestore, 'productos');
    const q = query(productsRef, orderBy('creadoEn', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getUserProducts = async (userId: string): Promise<Product[]> => {
  try {
    const productsRef = collection(firestore, 'productos');
    const q = query(
      productsRef,
      where('usuario', '==', userId),
      orderBy('creadoEn', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching user products:', error);
    return [];
  }
};

export const createProduct = async (productData: ProductFormData): Promise<string | null> => {
  try {
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    let imageUrl = '';
    if (productData.imagen) {
      const storageRef = ref(storage, `productos/${Date.now()}_${productData.imagen.name}`);
      await uploadBytes(storageRef, productData.imagen);
      imageUrl = await getDownloadURL(storageRef);
    }

    const productsRef = collection(firestore, 'productos');
    const docRef = await addDoc(productsRef, {
      titulo: productData.titulo,
      descripcion: productData.descripcion,
      precio: productData.precio,
      imagen: imageUrl,
      whatsapp: productData.whatsapp,
      usuario: auth.currentUser.uid,
      usuarioNombre: auth.currentUser.displayName || 'Usuario Anónimo',
      creadoEn: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (productId: string, productData: ProductFormData): Promise<boolean> => {
  try {
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const updateData: any = {
      titulo: productData.titulo,
      descripcion: productData.descripcion,
      precio: productData.precio,
      whatsapp: productData.whatsapp,
      actualizadoEn: Timestamp.now()
    };

    if (productData.imagen) {
      const storageRef = ref(storage, `productos/${Date.now()}_${productData.imagen.name}`);
      await uploadBytes(storageRef, productData.imagen);
      updateData.imagen = await getDownloadURL(storageRef);
    }

    const productRef = doc(firestore, 'productos', productId);
    await updateDoc(productRef, updateData);
    
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const productRef = doc(firestore, 'productos', productId);
    await deleteDoc(productRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};