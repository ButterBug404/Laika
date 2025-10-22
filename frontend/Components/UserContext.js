import React, { createContext, useContext, useState } from 'react';
import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

const userify = (user) => {
	const newUser = {
		id: user.id,
		nombre: user.name,
		apellidoPaterno: user.pat_name,
		apellidoMaterno: user.mat_name,
		correo: user.email,
		telefono: user.phone,
	}
	return newUser;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  /*const [users, setUsers] = useState([
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
  ]);*/
	const [users, setUsers] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

	const loginUser = async (email, password) => {
		try {
			const res = await axios.post(`${apiUrl}/api/login`, { email, password });
			const token = res.data.token;

			if (token) {
				const decodedToken = jwtDecode(token);
				console.log(decodedToken);
				setCurrentUser(decodedToken);
				setUsers(prev => [...prev, userify(decodedToken)]);
				setIsLoggedIn(true);
			}

			return token;
		} catch (err) {
			console.error("Login failed:", err.response?.data || err.message);
			throw err;
		}
	};

	const fetchUser = async (userId, token) => {
		try {
			const res = await axios.get(`${apiUrl}/api/users/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return res.data;
		} catch (err) {
			console.error("Fetch user failed:", err.response?.data || err.message);
			throw err;
		}
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
			return `${currentUser.name} ${currentUser.pat_name} ${currentUser.mat_name}`;
		}
		return '';
	};	
	return (
		<UserContext.Provider value={{ userProfile: currentUser, users, isLoggedIn, setIsLoggedIn, loginUser, logoutUser, updateUserProfile, getFullName, fetchUser }}>
		{children}
		</UserContext.Provider>
	);};
