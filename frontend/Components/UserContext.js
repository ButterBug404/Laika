import { createContext, useContext, useState } from 'react';
import axios from "axios";
import { Buffer } from 'buffer/';
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
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

	const loginUser = async (email, password) => {
		try {
			const res = await axios.post(`${apiUrl}/api/login`, { email, password });
			const token = res.data.token;

			if (token) {
				const decodedToken = jwtDecode(token);
				setCurrentUser(decodedToken);

				try {
					const imageRes = await axios.get(`${apiUrl}/api/profile-picture`, {
						headers: { Authorization: `Bearer ${token}` },
						responseType: 'arraybuffer'
					});
					const imageBase64 = Buffer.from(imageRes.data, 'binary').toString('base64');
					const imageUri = `data:${imageRes.headers['content-type']};base64,${imageBase64}`;
					console.log("OK");
					console.log(imageUri);
					setProfileImageUri(imageUri);
				} catch (imgErr) {
					console.error("Could not fetch profile image.", imgErr);
					setProfileImageUri(null);
				}
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
		setProfileImageUri(null);
		setIsLoggedIn(false);
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
		telefono: currentUser.phone,
		profileImage: profileImageUri
	} : null;

	return (
		<UserContext.Provider value={{ userProfile, isLoggedIn, setIsLoggedIn, loginUser, logoutUser, updateUserProfile, getFullName, fetchUser }}>
		{children}
		</UserContext.Provider>
	);
};
