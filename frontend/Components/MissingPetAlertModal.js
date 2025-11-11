import React from 'react';
import { Modal, View, Text, Button, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';
import AuthenticatedImage from './AuthenticatedImage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Helper function to parse the location string
const parseLocation = (locationString) => {
	if (!locationString || typeof locationString !== 'string') {
		return null;
	}
	const match = locationString.match(/POINT\(([^ ]+) ([^ ]+)\)/);
	if (match && match.length === 3) {
		const longitude = parseFloat(match[1]);
		const latitude = parseFloat(match[2]);
		return { latitude, longitude };
	}
	return null;
};

const MissingPetAlertModal = ({ visible, alertData, onClose }) => {
	if (!alertData) {
		return null;
	}

	// Adapt payload based on whether it's a match or a simple alert
	const isMatch = !!alertData.missingPet;
	const pet = isMatch ? alertData.missingPet : alertData.pet;
	const alert = isMatch 
		? { 
			description: `¡Coincidencia encontrada con una confianza del ${Math.round(alertData.confidence * 100)}%!\n\nDescripción de la mascota encontrada: ${alertData.foundPet.description}`,
			last_seen_location: alertData.missingPet.last_seen_location
		}
		: alertData.alert;
	const user = isMatch ? alertData.foundPet.user : alertData.user; // Assuming user info is needed
	const title = isMatch ? "¡Posible Coincidencia Encontrada!" : "¡Alerta de Mascota Perdida!";

	const location = parseLocation(alert.last_seen_location);

	const openInGoogleMaps = () => {
		if (location) {
			const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
			Linking.openURL(url);
		}
	};

	return (
		<Modal
		animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
		<View style={styles.centeredView}>
		<View style={styles.modalView}>
		<TouchableOpacity style={styles.closeButton} onPress={onClose}>
		<Ionicons name="close-circle" size={30} color="#b04f4f" />
		</TouchableOpacity>

		<Text style={styles.modalTitle}>{title}</Text>

		<AuthenticatedImage petId={pet.id} type="faces" style={styles.petImage} />

		<Text style={styles.petName}>{pet.name}</Text>
		<Text style={styles.description}>{alert.description}</Text>

		{location && (
			<>
			<MapView
			style={styles.map}
			provider={PROVIDER_GOOGLE}
			initialRegion={{
				latitude: location.latitude,
					longitude: location.longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			}}
			>
			<Marker
			coordinate={location}
			title="Última ubicación vista"
			/>
			</MapView>
			<Button title="Abrir en Google Maps" onPress={openInGoogleMaps} color="#b04f4f" />
			</>
		)}
		</View>
		</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 25,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: '90%',
	},
	closeButton: {
		position: 'absolute',
		top: 10,
		right: 10,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15,
		textAlign: 'center',
	},
	petImage: {
		width: 150,
		height: 150,
		borderRadius: 75,
		marginBottom: 15,
		borderWidth: 3,
		borderColor: '#b04f4f',
	},
	petName: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	description: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 15,
	},
	map: {
		width: 'w-full',
		height: 200,
		borderRadius: 10,
		marginBottom: 15,
	},
});

export default MissingPetAlertModal;