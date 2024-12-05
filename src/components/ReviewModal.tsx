import React, { useState } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import toast from 'react-hot-toast';
import { auth } from '../firebase';

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
  const [rating, setRating] = useState(8);
  const [clarity, setClarity] = useState(8);
  const [fairness, setFairness] = useState(8);
  const [punctuality, setPunctuality] = useState(8);
  const [wouldTakeAgain, setWouldTakeAgain] = useState(8);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reviewsCollection = collection(firestore, 'reviews');
      await addDoc(reviewsCollection, {
        professorId,
        userId,
        userName: auth.currentUser?.displayName || 'Usuario Anónimo',
        rating,
        clarity,
        fairness,
        punctuality,
        wouldTakeAgain,
        comment,
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

  const RatingSelect = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
    <div>
      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`block w-full rounded-md shadow-sm ${
          darkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'
        } focus:ring-blue-500 focus:border-blue-500`}
      >
        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value} {value === 1 ? 'punto' : 'puntos'}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <X size={24} />
        </button>
        
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Calificar a {professorName}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <RatingSelect label="Calificación General" value={rating} onChange={setRating} />
            <RatingSelect label="Claridad" value={clarity} onChange={setClarity} />
            <RatingSelect label="Justicia" value={fairness} onChange={setFairness} />
            <RatingSelect label="Puntualidad" value={punctuality} onChange={setPunctuality} />
            <RatingSelect label="¿Lo tomarías de nuevo?" value={wouldTakeAgain} onChange={setWouldTakeAgain} />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Comentario
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-blue-500 focus:border-blue-500`}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loading ? 'Enviando...' : 'Enviar Reseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;