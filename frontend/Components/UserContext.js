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
  const [userProfile, setUserProfile] = useState({
    nombre: 'Lizette Sarahi',
    apellidoPaterno: 'Sereno',
    apellidoMaterno: 'Cortés',
    correo: 'hipsterpapiro@hotmail.com',
    telefono: '3326551124',
    profileImage: 'https://placehold.co/200x200.png'
  });

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const getFullName = () => {
    return `${userProfile.nombre} ${userProfile.apellidoPaterno} ${userProfile.apellidoMaterno}`;
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile, getFullName }}>
      {children}
    </UserContext.Provider>
  );
};
