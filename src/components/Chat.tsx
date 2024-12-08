import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useFirebaseChat } from '../hooks/useFirebaseChat';
import ChatMessages from './Chat/ChatMessages';
import ChatInput from './Chat/ChatInput';
import LoginForm from './Chat/LoginForm';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';

interface ChatProps {
  darkMode?: boolean;
}

const verifyAdminPassword = async (password: string): Promise<boolean> => {
  try {
    const adminRef = ref(db, 'user/admin');
    const snapshot = await get(adminRef);
    const adminData = snapshot.val();
    
    if (adminData && adminData.password === password) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verifying admin:', error);
    return false;
  }
};

const Chat: React.FC<ChatProps> = ({ darkMode = false }) => {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const {
    messages,
    loading,
    unreadCount,
    sendMessage,
    loadMoreMessages,
    deleteMessage
  } = useFirebaseChat(isChatOpen);

  const handleLogin = async (username: string, password: string) => {
    if (username.trim()) {
      if (username.toLowerCase() === 'admin') {
        const isValidAdmin = await verifyAdminPassword(password);
        if (isValidAdmin) {
          setIsAdmin(true);
          setUsername(username);
          setIsUsernameSet(true);
        } else {
          alert('Contraseña de administrador incorrecta');
        }
      } else {
        setUsername(username);
        setIsUsernameSet(true);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    const success = await sendMessage(text, username, isAdmin);
    if (!success) {
      alert('Error al enviar el mensaje. Por favor, intenta de nuevo.');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (isAdmin) {
      const success = await deleteMessage(messageId);
      if (!success) {
        alert('Error al eliminar el mensaje. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-[60] flex items-center"
      >
        <MessageCircle size={24} />
        {!isChatOpen && unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isChatOpen && (
        <div className={`fixed bottom-20 right-4 shadow-lg rounded-lg w-96 z-[60] ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : ''}`}>
              Chat en tiempo real
            </h2>
            <button 
              onClick={() => setIsChatOpen(false)}
              className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            {!isUsernameSet ? (
              <LoginForm onLogin={handleLogin} darkMode={darkMode} />
            ) : (
              <>
                <ChatMessages
                  messages={messages}
                  darkMode={darkMode}
                  currentUsername={username}
                  onLoadMore={loadMoreMessages}
                  loading={loading}
                  isAdmin={isAdmin}
                  onDeleteMessage={handleDeleteMessage}
                />
                <ChatInput
                  onSendMessage={handleSendMessage}
                  darkMode={darkMode}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;