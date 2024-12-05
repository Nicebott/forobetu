import React from 'react';
import { Topic } from '../../types/forum';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForumListProps {
  topics: Topic[];
  onTopicClick: (topicId: string) => void;
  onNewTopic: () => void;
  darkMode: boolean;
}

const ForumList: React.FC<ForumListProps> = ({ topics, onTopicClick, onNewTopic, darkMode }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Foros de Discusión
        </h2>
        <button
          onClick={onNewTopic}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nuevo Tema
        </button>
      </div>

      <div className="space-y-4">
        {topics.map((topic) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-lg cursor-pointer ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-50'
            } shadow-sm transition-all`}
            onClick={() => onTopicClick(topic.id)}
          >
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {topic.titulo}
            </h3>
            <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {topic.descripcion}
            </p>
            <div className="flex items-center justify-between text-sm">
              <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                <span className="font-medium">{topic.creadorNombre}</span>
                {' · '}
                {formatDistanceToNow(topic.creadoEn.toDate(), { addSuffix: true, locale: es })}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ForumList;