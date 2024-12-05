import React, { useState } from 'react';
import { Topic, Message } from '../../types/forum';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Send, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopicViewProps {
  topic: Topic;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (content: string) => void;
  darkMode: boolean;
}

const TopicView: React.FC<TopicViewProps> = ({
  topic,
  messages,
  onBack,
  onSendMessage,
  darkMode
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className={`flex items-center gap-2 mb-6 ${
          darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft size={20} />
        Volver a los temas
      </button>

      <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {topic.titulo}
        </h2>
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {topic.descripcion}
        </p>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Creado por <span className="font-medium">{topic.creadorNombre}</span>
          {' · '}
          {formatDistanceToNow(topic.creadoEn.toDate(), { addSuffix: true, locale: es })}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {message.autorNombre}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDistanceToNow(message.creadoEn.toDate(), { addSuffix: true, locale: es })}
                </span>
              </div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {message.contenido}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className={`flex-grow px-4 py-2 rounded-md ${
            darkMode
              ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700'
              : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={!newMessage.trim()}
        >
          <Send size={20} />
          Enviar
        </button>
      </form>
    </div>
  );
};

export default TopicView;