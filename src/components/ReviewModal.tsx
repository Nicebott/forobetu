import React, { useState } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import toast from 'react-hot-toast';
import { auth } from '../firebase';
import ReviewForm from './Reviews/ReviewForm';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  professorId: string;
  professorName: string;
  userId: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  professorId,
  professorName,
  userId
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (review: {
    rating: number;
    clarity: number;
    fairness: number;
    punctuality: number;
    wouldTakeAgain: number;
    comment: string;
  }) => {
    setLoading(true);

    try {
      const reviewsCollection = collection(firestore, 'reviews');
      await addDoc(reviewsCollection, {
        professorId,
        userId,
        userName: auth.currentUser?.displayName || 'Usuario Anónimo',
        ...review,
        timestamp: new Date().toISOString()
      });
      toast.success('¡Reseña enviada exitosamente!');
      onClose();
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
      toast.error('Error al enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative w-full max-w-2xl p-6 rounded-xl shadow-xl ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg ${
            darkMode 
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          } transition-colors`}
        >
          <X size={20} />
        </button>
        
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Calificar a {professorName}
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tu opinión ayuda a otros estudiantes a tomar mejores decisiones
          </p>
        </div>
        
        <ReviewForm
          onSubmit={handleSubmit}
          darkMode={darkMode}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ReviewModal;