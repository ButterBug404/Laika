import { createContext, useContext, useState } from 'react';
import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

	const loginUser = async (email, password) => {
		console.log("API URL:", apiUrl);
		try {
			const res = await axios.post(`${apiUrl}/api/login`, { email, password });
			const token = res.data.token;
							if (token) {
							const decodedToken = jwtDecode(token);
							setCurrentUser(decodedToken);
							setIsLoggedIn(true);
							}			return token;
		} catch (err) {
			console.error("Login failed:", err.response?.data || err.message);
			throw err;
		}
	};

	const fetchUser = async (userId, token) => {
		try {
			const res = await axios.get(`${apiUrl}/api/users/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
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
	    store.delete('jwt');
	  };
	const updateUserProfile = (updates) => {
		if (currentUser) {
			// This only updates the local token data, backend update would need another API call
			setCurrentUser(prev => ({ ...prev, ...updates }));
		}
	};

	const getFullName = () => {
		if (currentUser) {
			return `${currentUser.name} ${currentUser.pat_name} ${currentUser.mat_name}`;
		}
		return '';
	};

	// Create a UI-ready user profile object with mapped names and the profile image
	const userProfile = currentUser ? {
		id: currentUser.id,
		nombre: currentUser.name,
		apellidoPaterno: currentUser.pat_name,
		apellidoMaterno: currentUser.mat_name,
		correo: currentUser.email,
		telefono: currentUser.phone
	} : null;

	return (
		<UserContext.Provider value={{ userProfile, isLoggedIn, setIsLoggedIn, loginUser, logoutUser, updateUserProfile, getFullName, fetchUser }}>
		{children}
		</UserContext.Provider>
	);
};
