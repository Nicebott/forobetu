import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  darkMode: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, darkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setShowPasswordInput(e.target.value.toLowerCase() === 'admin');
        }}
        className={`border rounded-md px-2 py-1 ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 placeholder-gray-500'
        }`}
        placeholder="Ingresa tu nombre..."
      />
      {showPasswordInput && (
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`border rounded-md px-2 py-1 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 placeholder-gray-500'
          }`}
          placeholder="Contraseña de administrador"
        />
      )}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Ingresar al chat
      </button>
    </form>
  );
};

export default LoginForm;