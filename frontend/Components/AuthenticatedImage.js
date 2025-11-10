import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import store from '../utils/store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const AuthenticatedImage = ({ petId = 1, type = 'faces', imageNumber, style, contentFit = 'cover', uri, cacheKey }) => {
	const [imageSource, setImageSource] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const setupImage = async () => {
			console.log('AuthenticatedImage - petId:', petId, 'type:', type, 'imageNumber:', imageNumber, 'uri:', uri);
			
			if (uri) {
				setImageSource({ uri });
				setLoading(false);
				return;
			}

			if (!petId) {
				console.log('No petId provided');
				setLoading(false);
				return;
			}

			try {
				const token = await store.getValueFor('jwt');
				console.log('Got token:', token ? 'yes' : 'no');
				
				// Build the URL based on type
				let url;
				if (type === 'faces') {
					url = `${API_URL}/api/pet-pictures/${petId}/faces`;
				} else if (type === 'body') {
					url = `${API_URL}/api/pet-pictures/${petId}/body/${imageNumber || 1}`;
				}

				if (cacheKey) {
					url += `?t=${cacheKey}`;
				}

				setImageSource({
					uri: url,
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
			} catch (error) {
				console.error('Error setting up image:', error);
			} finally {
				setLoading(false);
			}
		};

		setupImage();
	}, [petId, type, imageNumber, uri, cacheKey]);

	if (loading) {
		return (
			<View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Image 
			source={imageSource || require('../assets/icon.png')}
			cachePolicy="none"
			style={style}
			contentFit={contentFit}
			transition={200}
			onLoadStart={() => console.log('expo-image loading started:', imageSource?.uri)}
			onLoad={() => console.log('expo-image loaded successfully')}
			onError={(error) => {
				console.error('expo-image load error:', error);
			}}
		/>
	);
};

export default AuthenticatedImage;
