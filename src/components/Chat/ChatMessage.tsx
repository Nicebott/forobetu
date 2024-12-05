import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    timestamp: number;
    username: string;
    isAdmin: boolean;
  };
  darkMode: boolean;
  isCurrentUser: boolean;
  isAdmin: boolean;
  onDelete: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  darkMode, 
  isCurrentUser,
  isAdmin,
  onDelete
}) => {
  const timeAgo = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
    locale: es
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 ${isCurrentUser ? 'ml-auto' : 'mr-auto'} relative group`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isCurrentUser
            ? darkMode
              ? 'bg-blue-600 ml-auto'
              : 'bg-blue-500'
            : darkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium text-sm ${
            message.isAdmin 
              ? 'text-yellow-300' 
              : isCurrentUser
                ? 'text-white'
                : darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
          }`}>
            {message.username}
            {message.isAdmin && ' ✓'}
          </span>
          {isAdmin && (
            <button
              onClick={() => onDelete(message.id)}
              className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
              }`}
              title="Eliminar mensaje"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <p className={`text-sm break-words ${
          isCurrentUser ? 'text-white' : darkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {message.text}
        </p>
        <span className={`text-xs ${
          isCurrentUser
            ? 'text-blue-100'
            : darkMode
              ? 'text-gray-400'
              : 'text-gray-500'
        }`}>
          {timeAgo}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;