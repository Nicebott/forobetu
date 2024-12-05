import React, { useState } from 'react';
import { Smile, Send } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  darkMode: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, darkMode }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col relative">
      <div className="flex mb-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`flex-grow border rounded-l-md px-2 py-2 text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 placeholder-gray-500'
          }`}
          placeholder="Escribe un mensaje..."
        />
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`px-2 py-2 flex-shrink-0 ${
            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}
        >
          <Smile size={20} />
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-2 rounded-r-md flex items-center justify-center flex-shrink-0 hover:bg-blue-600 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
      {showEmojiPicker && (
        <div className="absolute right-0 bottom-full mb-2 z-10">
          <EmojiPicker 
            onEmojiClick={handleEmojiClick} 
            theme={darkMode ? 'dark' : 'light'}
          />
        </div>
      )}
    </form>
  );
};

export default ChatInput;