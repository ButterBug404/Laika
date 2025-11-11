import React from 'react';
import { Modal, View, Text, Button, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import AuthenticatedImage from './AuthenticatedImage';

const MatchContactModal = ({ visible, matchData, onClose }) => {
	if (!matchData) {
		return null;
	}

	const { found_pet_name, found_pet_id, found_pet_contact_info, found_pet_contact_method, missing_pet_name } = matchData;

	const handleContactWhatsApp = () => {
		if (found_pet_contact_method === 'WHATSAPP' || found_pet_contact_method === 'BOTH') {
			const message = `Hola, vi en la aplicación Laika que encontraste una mascota que podría ser la mía, ${missing_pet_name}. Me gustaría contactarte.`;
			const url = `https://wa.me/52${found_pet_contact_info}?text=${encodeURIComponent(message)}`;
			Linking.openURL(url).catch(() => {
				alert('No se pudo abrir WhatsApp.');
			});
		}
	};

	const handleContactGmail = () => {
		if (found_pet_contact_method === 'EMAIL' || found_pet_contact_method === 'BOTH') {
			const subject = `Posible coincidencia de mascota encontrada: ${missing_pet_name}`;
			const body = `Hola, vi en la aplicación Laika que encontraste una mascota que podría ser la mía, ${missing_pet_name}. Me gustaría contactarte.`;
			const url = `mailto:${found_pet_contact_info}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
			Linking.openURL(url).catch(() => {
				alert('No se pudo abrir la aplicación de correo.');
			});
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

					<Text style={styles.modalTitle}>Información de Contacto</Text>

					<AuthenticatedImage petId={found_pet_id} type="faces" style={styles.petImage} />

					<Text style={styles.petName}>{found_pet_name}</Text>
					<Text style={styles.description}>Has encontrado una coincidencia. Puedes contactar a la persona que encontró a esta mascota.</Text>

					<View style={styles.contactButtonsContainer}>
						{(found_pet_contact_method === 'WHATSAPP' || found_pet_contact_method === 'BOTH') && (
							<TouchableOpacity style={[styles.contactButton, styles.whatsappButton]} onPress={handleContactWhatsApp}>
								<FontAwesome5 name="whatsapp" size={20} color="white" />
								<Text style={styles.contactButtonText}>Contactar por WhatsApp</Text>
							</TouchableOpacity>
						)}
						{(found_pet_contact_method === 'EMAIL' || found_pet_contact_method === 'BOTH') && (
							<TouchableOpacity style={[styles.contactButton, styles.gmailButton]} onPress={handleContactGmail}>
								<FontAwesome5 name="envelope" size={20} color="white" />
								<Text style={styles.contactButtonText}>Contactar por Gmail</Text>
							</TouchableOpacity>
						)}
					</View>
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
		marginBottom: 20,
	},
	contactButtonsContainer: {
		width: '100%',
	},
	contactButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
		borderRadius: 5,
		marginBottom: 10,
	},
	whatsappButton: {
		backgroundColor: '#25D366',
	},
	gmailButton: {
		backgroundColor: '#D44638',
	},
	contactButtonText: {
		color: 'white',
		fontWeight: 'bold',
		marginLeft: 10,
	},
});

export default MatchContactModal;
