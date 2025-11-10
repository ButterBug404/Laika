import { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { jwtDecode } from 'jwt-decode';
import store from '../utils/store.js';

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

  useEffect(() => {
    const checkStoredToken = async () => {
      const token = await store.getValueFor('jwt');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          // Check if token is expired
          if (decodedToken.exp * 1000 < Date.now()) {
            console.log("Stored token is expired.");
            await store.delete('jwt');
          } else {
            console.log("Stored token is valid.");
            setCurrentUser(decodedToken);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Failed to decode stored token:", error);
          await store.delete('jwt');
        }
      }
    };

    checkStoredToken();
  }, []);

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
			setCurrentUser(prev => ({ ...prev, ...updates }));
		}
	};

	const getFullName = () => {
		if (currentUser) {
			return `${currentUser.name} ${currentUser.pat_name} ${currentUser.mat_name}`;
		}
		return '';
	};

	const userProfile = currentUser ? {
		id: currentUser.id,
		nombre: currentUser.name,
		apellidoPaterno: currentUser.pat_name,
		apellidoMaterno: currentUser.mat_name,
		correo: currentUser.email,
		telefono: currentUser.phone
	} : null;

	return (
		<UserContext.Provider value={{ user: currentUser, userProfile, isLoggedIn, setIsLoggedIn, loginUser, logoutUser, updateUserProfile, getFullName, fetchUser }}>
		{children}
		</UserContext.Provider>
	);
};
