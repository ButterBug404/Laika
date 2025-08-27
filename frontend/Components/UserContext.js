import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([
    {
      id: 1,
      nombre: 'Lizette Sarahi',
      apellidoPaterno: 'Sereno',
      apellidoMaterno: 'Cortés',
      correo: 'hipsterpapiro@hotmail.com',
      contraseña: 'Password123',
      telefono: '3326551124',
      profileImage: 'https://i.pinimg.com/736x/8a/62/b9/8a62b9238c2c6b61a2d6b785a49ea70e.jpg',
    },
    {
      id: 2,
      nombre: 'Juan',
      apellidoPaterno: 'Perez',
      apellidoMaterno: 'Gomez',
      correo: 'juan.perez@example.com',
      contraseña: 'Password456',
      telefono: '5551234567',
      profileImage: null
    }
  ]);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginUser = (email, password) => {
    const user = users.find(u => u.correo === email && u.contraseña === password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      return user;
    }
    return null;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const updateUserProfile = (updates) => {
    if (currentUser) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
    }
  };

  const getFullName = () => {
    if (currentUser) {
      return `${currentUser.nombre} ${currentUser.apellidoPaterno} ${currentUser.apellidoMaterno}`;
    }
    return '';
  };

  return (
    <UserContext.Provider value={{ userProfile: currentUser, users, isLoggedIn, loginUser, logoutUser, updateUserProfile, getFullName }}>
      {children}
    </UserContext.Provider>
  );
};