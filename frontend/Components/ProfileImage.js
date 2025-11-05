import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import store from '../utils/store';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ProfileImage = ({ user_id, style, contentFit = 'cover', editable = false, onImageChange }) => {
	const [imageSource, setImageSource] = useState(null);
	const [loading, setLoading] = useState(true);

	const pickImage = async () => {
		if (!editable) return;

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			if (onImageChange) {
				onImageChange(result.assets[0].uri);
			}
		}
	};

	useEffect(() => {
		const setupImage = async () => {
			console.log('ProfileImage - user_id:', user_id);
			
			if (!user_id) {
				console.log('No user_id provided');
				setLoading(false);
				return;
			}

			try {
				const token = await store.getValueFor('jwt');
				console.log('Got token:', token ? 'yes' : 'no');
				
				const url = `${API_URL}/api/profile-pictures/${user_id}`;

				console.log('Image URL:', url);

				console.log("uri prof: ", url);
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
	}, [user_id]);

	if (loading) {
		return (
			<View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<TouchableOpacity onPress={pickImage} disabled={!editable}>
			<Image 
				source={imageSource || require('../assets/icon.png')}
				style={style}
				contentFit={contentFit}
				transition={200}
				onLoadStart={() => console.log('expo-image loading started:', imageSource?.uri)}
				onLoad={() => console.log('expo-image loaded successfully')}
				onError={(error) => {
					console.error('expo-image load error:', error);
				}}
			/>
			{editable && (
				<View style={styles.editImageOverlay}>
					<Ionicons name="camera" size={24} color="white" />
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	editImageOverlay: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: 'rgba(0,0,0,0.6)',
		borderRadius: 15,
		padding: 5,
	},
});

export default ProfileImage;
