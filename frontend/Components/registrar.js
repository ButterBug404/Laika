import React, { useState, useEffect, useRef } from 'react';
import { 
	Text, 
	TextInput, 
	View, 
	TouchableOpacity, 
	Alert, 
	StyleSheet, 
	ScrollView, 
	KeyboardAvoidingView, 
	Platform,
	Switch,
	Dimensions,
	Animated, 
	Modal
} from 'react-native';
import { Image } from 'expo-image';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { addMascota } from './MascotasData'; // Import the function to add new pets
import store from '../utils/store';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Define breed lists for each species
export const razasPerro = [
	'Selecciona una raza',
	'Mestizo',
	'Chihuahua',
	'Poodle', 
	'Labrador Retriever',
	'Golden Retriever',
	'Pug',
	'Pomeranian',

	'Otro/Desconocido'
];

export const razasGato = [
	'Selecciona una raza',
	'Siamés', 
	'Persa', 
	'Maine Coon', 
	'Bengalí', 
	'Sphynx', 
	'Ragdoll', 
	'Abisinio', 
	'Azul Ruso', 
	'Angora', 
	'Birmano',
	'Mestizo',
	'Otro/Desconocido'
];

export const razasConejo = [
	'Selecciona una raza',
	'Cabeza de León', 
	'Holandés Enano', 
	'Rex', 
	'Californiano', 
	'Angora', 
	'Gigante de Flandes', 
	'Belier', 
	'Mini Lop', 
	'Arlequín', 
	'Mariposa',
	'Mestizo',
	'Otro/Desconocido'
];

export const razasAve = [
	'Selecciona una raza',
	'Canario', 
	'Periquito', 
	'Cacatúa', 
	'Loro Gris', 
	'Guacamayo', 
	'Agapornis', 
	'Ninfa', 
	'Diamante Mandarín', 
	'Jilguero', 
	'Perico Australiano',
	'Otro/Desconocido'
];

// Define color options with their corresponding color codes
export const colores = [
	{ label: 'Selecciona un color', value: '', color: '#transparent' },
	{ label: 'Negro', value: 'Negro', color: '#000000' },
	{ label: 'Blanco', value: 'Blanco', color: '#FFFFFF' },
	{ label: 'Marrón', value: 'Marrón', color: '#8B4513' },
	{ label: 'Gris', value: 'Gris', color: '#808080' },
	{ label: 'Dorado', value: 'Dorado', color: '#FFD700' },
	{ label: 'Crema', value: 'Crema', color: '#F5F5DC' },
	{ label: 'Atigrado', value: 'Atigrado', color: '#D2691E' },
	{ label: 'Manchado', value: 'Manchado', color: '#F4A460' },
	{ label: 'Tricolor', value: 'Tricolor', color: '#8B4513' },
	{ label: 'Anaranjado', value: 'Anaranjado', color: '#FF4500' },
	{ label: 'Otro/Multicolor', value: 'Otro/Multicolor', color: '#FF69B4' }
];

export const EspecieIcon = ({ name, size = 30, size2 = 42, color = "black", style }) => {
	switch (name) {
		case 'perro':
			return <FontAwesome5 name="dog" size={size} color={color} style={style} />;
		case 'gato':
			return <FontAwesome5 name="cat" size={size} color={color} style={style} />;
		case 'ave':
			return <FontAwesome5 name="dove" size={size} color={color} style={style} />;
		case 'conejo':
			return <MaterialCommunityIcons name="rabbit" size={size2} color={color} style={style} />;
		default:
			return <Ionicons name="paw-outline" size={size} color={color} style={style} />;
	}
};

const Registrar = () => {
	// Registration type state
	const [tipoRegistro, setTipoRegistro] = useState('presente');

	// Existing states
	const [nombre, setNombre] = useState('');
	const [edad, setEdad] = useState('');
	const [edadUnidad, setEdadUnidad] = useState('años');
	const [raza, setRaza] = useState('');
	const [especie, setEspecie] = useState('perro');
	const [color, setColor] = useState('');
	const [tamaño, setTamaño] = useState('');
	const [sexo, setSexo] = useState('');
	const [descripcion, setDescripcion] = useState('');
	const [ubicacion, setUbicacion] = useState({
		latitude: 19.4326,  // Default to Mexico City
		longitude: -99.1332,
		latitudeDelta: LATITUDE_DELTA,
		longitudeDelta: LONGITUDE_DELTA,
	});
	const [direccion, setDireccion] = useState('');
	const [contacto, setContacto] = useState('');
	const [imagenes, setImagenes] = useState([]);
	const [imagencara, setImagencara] = useState(null);
	const [vacunado, setVacunado] = useState(false); // This will be replaced by enfermedadPiel
	const [loadingLocation, setLoadingLocation] = useState(false);

	// Add missing pet specific fields

	const [recompensa, setRecompensa] = useState('');
	const [tieneRecompensa, setTieneRecompensa] = useState('no');
	const [montoRecompensa, setMontoRecompensa] = useState('');
	const [showPhotoInstructions, setShowPhotoInstructions] = useState(false);
	const [showFacePhotoInstructions, setShowFacePhotoInstructions] = useState(false);
	const [prediccionIA, setPrediccionIA] = useState(false);
	const [isPredicting, setIsPredicting] = useState(false);
	const [enfermedadPiel, setEnfermedadPiel] = useState(false);
	const [showEspeciePicker, setShowEspeciePicker] = useState(false);
	const [showSexoPicker, setShowSexoPicker] = useState(false);
	const [metodoContacto, setMetodoContacto] = useState('');
	const [ultimaVezVisto, setUltimaVezVisto] = useState('');

	const especiesOptions = [
		{ label: 'Perro', value: 'perro' },
		{ label: 'Gato', value: 'gato' },
		{ label: 'Conejo', value: 'conejo' },
		{ label: 'Ave', value: 'ave' },
	];

	const colorPoodle = [
		{label: 'Negro', value: 'negro', color: '#000000'},
		{label: 'Blanco', value: 'blanco', color: '#FFFFFF'},
		{label: 'Marrón', value: 'marron', color: '#8B4513'},
		{label: 'Gris', value: 'gris', color: '#808080'},
		{label: 'Crema', value: 'crema', color: '#FFFDD0'},
	];

	const colorNinfa = [
		{label: 'gris-amarillo-naranja', value: 'gris-amarillo-naranja', color: '#808080', color2: '#FFFF00', color3: '#FFA500'},
		{label: 'lutina (blanco-amarillo-naranja)', value: 'lutina', color: '#FFFFFF', color2: '#FFFF00', color3: '#FFA500'},
		{label: 'perlada (gris-moteado-amarillo)', value: 'perlada', color: '#808080', color2: '#FFFF00', color3: '#D3D3D3'}
	];

	// Add state for custom color picker visibility
	const [showColorPicker, setShowColorPicker] = useState(false);

	// Reset raza when especie changes
	useEffect(() => {
		setRaza('');
	}, [especie]);

	// Request location permissions and get current location
	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
				return;
			}

			setLoadingLocation(true);
			try {
				let location = await Location.getCurrentPositionAsync({});
				setUbicacion({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: LATITUDE_DELTA,
					longitudeDelta: LONGITUDE_DELTA,
				});

				// Get address from coordinates
				let addressResponse = await Location.reverseGeocodeAsync({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				});

				if (addressResponse.length > 0) {
					const address = addressResponse[0];
					const addressText = `${address.street || ''} ${address.name || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;
					setDireccion(addressText);
				}
			} catch (error) {
				Alert.alert('Error', 'No se pudo obtener tu ubicación');
			} finally {
				setLoadingLocation(false);
			}
		})();
	}, []);

	// Get the appropriate breed list based on selected species
	const getRazasList = () => {
		switch(especie) {
			case 'perro': return razasPerro;
			case 'gato': return razasGato;
			case 'conejo': return razasConejo;
			case 'ave': return razasAve;
			default: return ['Selecciona una raza'];
		}
	};

	const pickImage = async () => {
		if (imagenes.length >= 4) {
			Alert.alert('Límite alcanzado', 'Puedes subir un máximo de 4 imágenes.');
			return;
		}
		// Show photo instructions modal first
		setShowPhotoInstructions(true);
	};

	const pickImageCara = async () => {
		// Show photo instructions modal first
		setShowFacePhotoInstructions(true);
	};

	const proceedWithImagePicker = async () => {
		setShowPhotoInstructions(false);

		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri;
			const fileExtension = uri.split('.').pop().toLowerCase();
			if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
				setImagenes(prevImagenes => [...prevImagenes, uri]);
			} else {
				Alert.alert('Formato no válido', 'Por favor, selecciona una imagen en formato JPG, JPEG o PNG.');
			}
		}
	};

	const proceedWithImageCaraPicker = async () => {
		setShowFacePhotoInstructions(false);
		// Direct image picker for face identification
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri;
			const fileExtension = uri.split('.').pop().toLowerCase();
			if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
				setImagencara(uri);
			} else {
				Alert.alert('Formato no válido', 'Por favor, selecciona una imagen en formato JPG, JPEG o PNG.');
			}
		}
	};

	const removeImage = (indexToRemove) => {
		setImagenes(prevImagenes => prevImagenes.filter((_, index) => index !== indexToRemove));
	};

	const removeImageCara = () => {
		setImagencara(null);
	};

	// Handle map marker drag
	const handleMarkerDrag = async (e) => {
		const { latitude, longitude } = e.nativeEvent.coordinate;
		setUbicacion({
			...ubicacion,
			latitude,
			longitude,
		});

		// Update address text
		try {
			let addressResponse = await Location.reverseGeocodeAsync({
				latitude,
				longitude,
			});

			if (addressResponse.length > 0) {
				const address = addressResponse[0];
				const addressText = `${address.street || ''} ${address.name || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;
				setDireccion(addressText);
			}
		} catch (error) {
			console.log('Error getting address:', error);
		}
	};

	// Validate numeric input for age
	const handleEdadChange = (text) => {
		// Only allow digits
		const numericValue = text.replace(/[^0-9]/g, '');
		setEdad(numericValue);
	};

	// Validate numeric input for reward amount
	const handleMontoRecompensaChange = (text) => {
		// Only allow digits
		const numericValue = text.replace(/[^0-9]/g, '');
		setMontoRecompensa(numericValue);
	};

	const handlePredict = () => {
		if (imagenes.length === 0) {
			Alert.alert('Error de predicción', 'Por favor, sube al menos una imagen de tu mascota para poder predecir.');
			return;
		}
		setIsPredicting(true);
		setTimeout(() => {
			setEspecie('perro');
			setRaza('Poodle');
			setPrediccionIA(false);
			setIsPredicting(false);
		}, 3000);
	};

	const handleSubmit = async () => {
		if (tipoRegistro === 'perdida' || tipoRegistro === 'adopcion' || tipoRegistro === 'presente' || tipoRegistro === 'encontrada') {
			if (tipoRegistro === 'perdida') {
				if (!nombre || !edad || !raza || !ultimaVezVisto || imagenes.length === 0 || !imagencara || !color || !tamaño || !sexo) {
					Alert.alert('Error', 'Por favor, completa todos los campos obligatorios y añade ambas imágenes');
					return;
				}
			} else if (tipoRegistro === 'adopcion') {
				if (!nombre || !edad || !raza || imagenes.length === 0 || !imagencara || !color || !tamaño || !sexo) {
					Alert.alert('Error', 'Por favor, completa todos los campos obligatorios para la adopción y añade ambas imágenes');
					return;
				}
			} else if (tipoRegistro === 'presente') {
				if (!nombre || !edad || !raza || imagenes.length === 0 || !imagencara || !color || !tamaño || !sexo) {
					Alert.alert('Error', 'Por favor, completa todos los campos obligatorios y añade ambas imágenes');
					return;
				}
			} else if (tipoRegistro === 'encontrada') {
				if (!especie || !color || !tamaño || imagenes.length === 0 || !imagencara) {
					Alert.alert('Error', 'Por favor, completa la información básica de la mascota encontrada y añade ambas imágenes');
					return;
				}
			}

			// Validate reward amount if reward is selected
			if (tipoRegistro === 'perdida' && tieneRecompensa === 'si' && (!montoRecompensa || parseInt(montoRecompensa) <= 0)) {
				Alert.alert('Error', 'Por favor, ingresa una cantidad válida para la recompensa');
				return;
			}

			const petData = {
				tipoRegistro,
				nombre,
				especie,
				raza,
				color,
				edad,
				edadUnidad,
				sexo,
				tamaño,
				vacunado,
				enfermedadPiel,
				contacto,
				metodoContacto,
				descripcion,
				tieneRecompensa,
				ultimaVezVisto,
				montoRecompensa,
				ubicacion,
				imagenes,
				imagencara
			};

			try {
				const result = await addMascota(petData);
				if (result) {
					Alert.alert('Éxito', `Mascota registrada correctamente para ${tipoRegistro}`);
					// Reset form
					setNombre('');
					setEdad('');
					setRaza('');
					setEspecie('perro');
					setImagenes([]);
					setImagencara(null);
					setVacunado(false);
					setColor('');
					setTamaño('');
					setSexo('');
					setDescripcion('');
					setContacto('');
					setMetodoContacto('');
					setUltimaVezVisto('');
					setRecompensa('');
					setTieneRecompensa('no');
					setMontoRecompensa('');
					setEdadUnidad('años');
					setPrediccionIA(false);
					setEnfermedadPiel(false);
				} else {
					Alert.alert('Error', `No se pudo registrar la mascota para ${tipoRegistro}`);
				}
			} catch (error) {
				console.error(`Error registering pet for ${tipoRegistro}:`, error);
				Alert.alert('Error', `Ocurrió un error al registrar la mascota para ${tipoRegistro}`);
			}

		} else {
			if (!nombre || !edad || !raza || imagenes.length === 0 || !imagencara || !color || !tamaño || !sexo) {
				Alert.alert('Error', 'Por favor, completa todos los campos obligatorios y añade ambas imágenes');
				return;
			}
		}

		if ((raza === 'Selecciona una raza' && tipoRegistro !== 'encontrada') || color === 'Selecciona un color' || (sexo === '' && tipoRegistro !== 'encontrada')) {

			Alert.alert('Error', 'Por favor, selecciona opciones válidas en los menús desplegables');
			return;
		}
	};

	// Get title based on registration type
	const getTitleByType = () => {
		switch(tipoRegistro) {
			case 'presente': return 'Registrar Mascota Presente';
			case 'perdida': return 'Registrar Mascota Perdida';
			case 'encontrada': return 'Registrar Mascota Encontrada';
			case 'adopcion': return 'Registrar Mascota para Adopción';
			default: return 'Registrar Mascota';
		}
	};


	return (
		<KeyboardAvoidingView
		behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		style={styles.container}
		>
		<ScrollView contentContainerStyle={styles.scrollContainer}>
		{/* Registration Type Picker */}
		<Text style={styles.label}>Tipo de Registro: <Text style={styles.asterisk}>*</Text></Text>
		<View style={styles.pickerContainer}>
		<Picker
		selectedValue={tipoRegistro}
		style={styles.picker}
		onValueChange={(itemValue) => setTipoRegistro(itemValue)}
		dropdownIconColor="#e07978"
		>
		<Picker.Item label="Selecciona una opción" value="" style={styles.pickerItem} />
		<Picker.Item label="Registrar Mascota Presente" value="presente" style={styles.pickerItem} />
		<Picker.Item label="Perdí mi mascota" value="perdida" style={styles.pickerItem} />
		<Picker.Item label="Encontré una mascota" value="encontrada" style={styles.pickerItem} />
		<Picker.Item label="Ofrecer en adopción" value="adopcion" style={styles.pickerItem} />
		</Picker>
		</View>

		<Text style={styles.title}>{getTitleByType()}</Text>

		{/* Different UI hint based on registration type */}
		{tipoRegistro === 'presente' && (
				<Text style={styles.typeHint}>*Registra tus mascotas para mantener un registro de sus datos importantes.*</Text>
		)}

		{tipoRegistro === 'perdida' && (
			<Text style={styles.typeHint}>*Al registrar una mascota perdida, será visible para que otros usuarios puedan ayudarte a encontrarla.*</Text>
		)}
		{tipoRegistro === 'adopcion' && (
			<Text style={styles.typeHint}>
			solo está disponible adoptar mascotas con: {`\n`}
			* perro: 2 meses{`\n`}
			* gato: 3 meses{`\n`}
			* conejo: 2 meses{`\n`}
			* ave: 1 mes{`\n`}
			</Text>
		)}
		{/* Optional fields for encontrada */}
		{tipoRegistro !== 'encontrada' && (
			<>
			<Text style={styles.label}>Nombre de la mascota: <Text style={styles.asterisk}>*</Text></Text>
			<TextInput
			style={styles.input}
			placeholder="Nombre"
			value={nombre}
			onChangeText={setNombre}
			/>
			</>
		)}

		{tipoRegistro !== 'encontrada' && (
			<>
			<Text style={styles.label}>Edad de la mascota: <Text style={styles.asterisk}>*</Text></Text>
			<View style={styles.ageContainer}>
			<TextInput
			style={styles.ageInput}
			placeholder="Edad"
			value={edad}
			onChangeText={handleEdadChange}
			keyboardType="numeric"
			/>
			<View style={styles.ageUnitPickerContainer}>
			<Picker
			selectedValue={edadUnidad}
			style={styles.picker}
			onValueChange={(itemValue) => setEdadUnidad(itemValue)}
			dropdownIconColor="#e07978"
			>
			<Picker.Item label="Meses" value="meses" style={styles.pickerItem} />
			{tipoRegistro !== 'adopcion' && <Picker.Item label="Años" value="años" style={styles.pickerItem} />}
			</Picker>
			</View>
			</View>
			</>
		)}

		<View style={styles.imageContainer}>
		<Text style={styles.label}>Imagenes:</Text>
		<TouchableOpacity style={styles.imageButton} onPress={pickImage}>
		<View style={styles.buttonContent}>
		<Text style={styles.imageButtonText}>Subir foto   </Text>
		<Ionicons name="camera" size={20} color="white" />
		</View>
		</TouchableOpacity>

		<ScrollView horizontal={true} style={styles.previewContainer}>
		{imagenes.map((uri, index) => (
			<View key={index} style={styles.previewImageWrapper}>
			<Image source={{ uri }} style={styles.previewImage} />
			<TouchableOpacity
			style={styles.deleteImageButton}
			onPress={() => removeImage(index)}
			>
			<Ionicons name="close-circle" size={24} color="red" />
			</TouchableOpacity>
			</View>
		))}
		</ScrollView>
		</View>
		{/* Show vaccination option for present pets and adoption */}
		{(tipoRegistro === 'presente' || tipoRegistro === 'adopcion') && (
			<View style={styles.switchContainer}>
			<Text style={styles.switchLabel}>¿Tiene una enfermedad en la piel que pueda afecte el reconocimiento de la mascota?</Text>
			<Switch
			value={enfermedadPiel}
			onValueChange={setEnfermedadPiel}
			trackColor={{ false: "#767577", true: "#b04f4f" }}
			thumbColor={enfermedadPiel ? "#f6d3c3" : "#f4f3f4"}
			/>
			</View>
		)}
		{(tipoRegistro === 'presente' || tipoRegistro === 'adopcion') && (
			<View style={styles.switchContainer}>
			<Text style={styles.switchLabel}>Hacer una predicción con IA</Text>
			<Switch
			value={prediccionIA}
			onValueChange={setPrediccionIA}
			trackColor={{ false: "#767577", true: "#b04f4f" }}
			thumbColor={prediccionIA ? "#f6d3c3" : "#f4f3f4"}
			/>
			</View>
		)}
		{isPredicting ? (
			<View style={styles.imageContainer}>
			<Text style={styles.aiHint}>Prediciendo...</Text>
			</View>
		) : prediccionIA && (
			<View style={styles.imageContainer}>
			<Text style={styles.aiHint}>
			*Sube una foto y nuestra IA predecirá automáticamente la raza, especie de tu mascota*
			</Text>
			<TouchableOpacity style={styles.imageButton} onPress={handlePredict}>
			<View style={styles.buttonContent}>
			<Ionicons name="sparkles-outline" size={20} color="white" />
			<Text style={styles.imageButtonText}>   Predecir   </Text>
			<Ionicons name="sparkles-outline" size={20} color="white" />
			</View>
			</TouchableOpacity>
			</View>
		)}
		{!prediccionIA && (
			<>
			<Text style={styles.label}>Especie: <Text style={styles.asterisk}>*</Text></Text>
			<TouchableOpacity
			style={styles.customPickerButton}
			onPress={() => setShowEspeciePicker(true)}
			>
			<View style={styles.pickerWithIconContainer}>
			<Text style={styles.customPickerText}>{especie.charAt(0).toUpperCase() + especie.slice(1)}</Text>
			<EspecieIcon name={especie} style={styles.pickerIcon} />
			</View>
			</TouchableOpacity>

			{tipoRegistro !== 'encontrada' && (
				<>
				<Text style={styles.label}>Raza: <Text style={styles.asterisk}>*</Text></Text>
				<View style={styles.pickerContainer}>
				<Picker
				selectedValue={raza}
				style={styles.picker}
				onValueChange={(itemValue) => setRaza(itemValue)}
				dropdownIconColor="#e07978"
				>
				{getRazasList().map((razaOption, index) => (
					<Picker.Item key={index} label={razaOption} value={razaOption} style={styles.pickerItem} />
				))}
				</Picker>
				</View>				</>
			)}
			</>
		)}

		<Text style={styles.label}>Sexo: <Text style={styles.asterisk}>*</Text></Text>
		<TouchableOpacity
		style={styles.customPickerButton}
		onPress={() => setShowSexoPicker(true)}
		>
		<View style={styles.pickerWithIconContainer}>
		<Text style={styles.customPickerText}>{sexo ? sexo.charAt(0).toUpperCase() + sexo.slice(1) : 'Selecciona el sexo'}</Text>
		{sexo === 'macho' && <FontAwesome5 name="mars" size={20} color="black" />}
		{sexo === 'hembra' && <FontAwesome5 name="venus" size={20} color="black" />}
		{sexo === 'desconocido' && <FontAwesome5 name="question" size={20} color="black" />}
		</View>
		</TouchableOpacity>

		<Text style={styles.label}>Color: <Text style={styles.asterisk}>*</Text></Text>
		<TouchableOpacity
		style={styles.customPickerButton}
		onPress={() => setShowColorPicker(!showColorPicker)}
		>
		<View style={styles.colorPreview}>
		{color && color !== 'Selecciona un color' && (
			<View style={[styles.colorSquare, { backgroundColor: colores.find(c => c.value === color)?.color || '#transparent' }]} />
		)}
		<Text style={styles.customPickerText}>
		{color || 'Selecciona un color de mascota '}
		</Text>
		</View>
		<Ionicons name="chevron-down" size={20} color="#666" />
		</TouchableOpacity>

		{showColorPicker && (
			<ScrollView style={styles.colorOptionsContainer} nestedScrollEnabled={true}>
			{colores.map((colorOption, index) => (
				<TouchableOpacity
				key={index}
				style={styles.colorOption}
				onPress={() => {
					setColor(colorOption.value);
					setShowColorPicker(false);
				}}
				>
				<View style={[styles.colorSquare, { backgroundColor: colorOption.color, borderColor: colorOption.color === '#FFFFFF' ? '#ccc' : 'transparent' }]} />
				<Text style={styles.colorOptionText}>{colorOption.label}</Text>
				</TouchableOpacity>
			))}
			</ScrollView>
		)}

		<Text style={styles.label}>Tamaño: <Text style={styles.asterisk}>*</Text></Text>
		<View style={styles.pickerContainer}>
		<Picker
		selectedValue={tamaño}
		style={styles.picker}
		onValueChange={(itemValue) => setTamaño(itemValue)}
		dropdownIconColor="#e07978"
		>
		<Picker.Item label="Selecciona un tamaño" value="" style={styles.pickerItem} />
		<Picker.Item label="Pequeño" value="pequeño" style={styles.pickerItem} />
		<Picker.Item label="Mediano" value="mediano" style={styles.pickerItem} />
		<Picker.Item label="Grande" value="grande" style={styles.pickerItem} />
		</Picker>
		{tamaño ? <View style={[styles.sizeIndicator, styles[`sizeIndicator${tamaño.charAt(0).toUpperCase() + tamaño.slice(1)}`]]} /> : null}
		</View>

		{/* Show additional fields for lost pets */}
		{tipoRegistro === 'perdida' && (
			<>
			<Text style={styles.label}>¿Cuándo fue la última vez que viste a tu mascota?<Text style={styles.asterisk}>*</Text></Text>
			<TextInput
			style={styles.input}
			placeholder="Ej: Hace 2 días, Esta mañana, etc."
			value={ultimaVezVisto}
			onChangeText={setUltimaVezVisto}
			/>

			<Text style={styles.label}>¿Tendrá recompensa?</Text>
			<View style={styles.pickerContainer}>
			<Picker
			selectedValue={tieneRecompensa}
			style={styles.picker}
			onValueChange={(itemValue) => setTieneRecompensa(itemValue)}
			dropdownIconColor="#e07978"
			>
			<Picker.Item label="No" value="no" style={styles.pickerItem} />
			<Picker.Item label="Sí" value="si" style={styles.pickerItem} />
			</Picker>
			</View>
			{tieneRecompensa === 'si' && (
				<>
				<Text style={styles.label}>Cantidad de recompensa (solo números)<Text style={styles.asterisk}>*</Text></Text>
				<TextInput
				style={styles.input}
				placeholder="Ej: 500, 1000, etc."
				value={montoRecompensa}
				onChangeText={handleMontoRecompensaChange}
				keyboardType="numeric"
				/>
				</>
			)}
			</>
		)}

		<Text style={styles.label}>Descripción (opcional)</Text>
		<TextInput
		style={styles.inputMultiline}
		placeholder="Describe a tu mascota, sus hábitos, personalidad, etc."
		value={descripcion}
		onChangeText={setDescripcion}
		multiline
		numberOfLines={4}
		/>

		<Text style={styles.label}>Método de contacto preferido:</Text>
		<View style={styles.pickerContainer}>
		<Picker
		selectedValue={metodoContacto}
		style={styles.picker}
		onValueChange={(itemValue) => setMetodoContacto(itemValue)}
		dropdownIconColor="#e07978"
		>
		<Picker.Item label="Selecciona un método" value="" style={styles.pickerItem} />
		<Picker.Item label="WhatsApp" value="whatsapp" style={styles.pickerItem} />
		<Picker.Item label="Correo" value="correo" style={styles.pickerItem} />
		<Picker.Item label="Ambos" value="ambos" style={styles.pickerItem} />
		</Picker>
		</View>
		{/* Map Location Selector */}
		{(tipoRegistro === 'perdida' || tipoRegistro === 'encontrada') && (
			<>
			<Text style={styles.label}>Ubicación: </Text>
			<View style={styles.mapContainer}>
			{loadingLocation ? (
				<Text style={styles.loadingText}>Cargando ubicación...</Text>
			) : (
				<>
				<MapView
				style={styles.map}
				provider={PROVIDER_GOOGLE}
				region={ubicacion}
				onRegionChangeComplete={(region) => setUbicacion(region)}
				>
				<Marker
				coordinate={{
					latitude: ubicacion.latitude,
						longitude: ubicacion.longitude
				}}
				draggable
				onDragEnd={handleMarkerDrag}
				title={tipoRegistro === 'perdida' ? 'Última ubicación vista' : 'Ubicación donde se encontró'}
				/>
				</MapView>
				<Text style={styles.addressText}>{direccion}</Text>
				</>
			)}
			</View>
			</>
		)}

		<View style={styles.imageContainer}>
		<Text style={styles.label}>Cara de la mascota:</Text>
		<TouchableOpacity style={styles.imageButton} onPress={pickImageCara}>
		<View style={styles.buttonContent}>
		<Text style={styles.imageButtonText}>Foto del rostro </Text>
		<Ionicons name="camera-outline" size={20} color="white" />
		</View>
		</TouchableOpacity>
		{imagencara && (
			<View style={styles.previewImageWrapper}>
			<Image source={{ uri: imagencara }} style={styles.previewImage} />
			<TouchableOpacity
			style={styles.deleteImageButton}
			onPress={removeImageCara}
			>
			<Ionicons name="close-circle" size={24} color="red" />
			</TouchableOpacity>
			</View>
		)}
		<Text style={styles.aiHint}> *Esta imagen se usará para identificar a tu mascota mediante reconocimiento facial* </Text>
		</View>



		<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
		<Text style={styles.submitButtonText}>Registrar</Text>
		</TouchableOpacity>
		</ScrollView>

		{/* Especie Picker Modal */}
		<Modal
		visible={showEspeciePicker}
		animationType="slide"
		transparent={true}
		onRequestClose={() => setShowEspeciePicker(false)}
		>
		<View style={styles.modalOverlay}>
		<View style={styles.customPickerModalContainer}>
		<Text style={styles.photoInstructionsTitle}>Selecciona una Especie</Text>
		{especiesOptions.map((option, index) => (
			<TouchableOpacity
			key={index}
			style={styles.customPickerOption}
			onPress={() => {
				setEspecie(option.value);
				setShowEspeciePicker(false);
			}}
			>
			<EspecieIcon name={option.value} style={styles.customPickerOptionIcon} />
			<Text style={styles.customPickerOptionText}>{option.label}</Text>
			</TouchableOpacity>
		))}
		<TouchableOpacity
		style={styles.photoInstructionsCancelButton}
		onPress={() => setShowEspeciePicker(false)}
		>
		<Text style={styles.photoInstructionsButtonText}>Cancelar</Text>
		</TouchableOpacity>
		</View>
		</View>
		</Modal>

		{/* Sexo Picker Modal */}
		<Modal
		visible={showSexoPicker}
		animationType="slide"
		transparent={true}
		onRequestClose={() => setShowSexoPicker(false)}
		>
		<View style={styles.modalOverlay}>
		<View style={styles.customPickerModalContainer}>
		<Text style={styles.photoInstructionsTitle}>Selecciona el Sexo</Text>
		<TouchableOpacity
		style={styles.customPickerOption}
		onPress={() => { setSexo('macho'); setShowSexoPicker(false); }}
		>
		<FontAwesome5 name="mars" size={24} color="black" style={styles.customPickerOptionIcon} />
		<Text style={styles.customPickerOptionText}>Macho</Text>
		</TouchableOpacity>
		<TouchableOpacity
		style={styles.customPickerOption}
		onPress={() => { setSexo('hembra'); setShowSexoPicker(false); }}
		>
		<FontAwesome5 name="venus" size={24} color="black" style={styles.customPickerOptionIcon} />
		<Text style={styles.customPickerOptionText}>Hembra</Text>
		</TouchableOpacity>
		{(tipoRegistro === 'encontrada' || tipoRegistro === 'perdida') && (
			<TouchableOpacity
			style={styles.customPickerOption}
			onPress={() => { setSexo('desconocido'); setShowSexoPicker(false); }}
			>
			<FontAwesome5 name="question" size={24} color="black" style={styles.customPickerOptionIcon} />
			<Text style={styles.customPickerOptionText}>Desconocido</Text>
			</TouchableOpacity>
		)}
		<TouchableOpacity
		style={styles.photoInstructionsCancelButton}
		onPress={() => setShowSexoPicker(false)}
		>
		<Text style={styles.photoInstructionsButtonText}>Cancelar</Text>
		</TouchableOpacity>
		</View>
		</View>
		</Modal>

		{/* Photo Instructions Modal for Face */}
		<Modal
		visible={showFacePhotoInstructions}
		animationType="slide"
		transparent={true}
		onRequestClose={() => setShowFacePhotoInstructions(false)}
		>
		<View style={styles.modalOverlay}>
		<View style={styles.photoInstructionsContainer}>
		<Text style={styles.photoInstructionsTitle}>Foto del Rostro</Text>

		<Text style={styles.photoInstructionsText}>
		Toma una foto clara y de frente del rostro de tu mascota. 
		Esta imagen es crucial para el reconocimiento facial.
		</Text>

		<Text style={styles.photoInstructionsSubtext}>Ejemplo:</Text>

		{/* Animated GIF */}
		<Animated.View
		style={{
			opacity: 1,
				transform: [{ scale: 1 }],
		}}>
		<Image
		source={require('../assets/cara.gif')} 
		style={[
			styles.logoApp,
			{
				width: 200,
				height: 200,
				borderRadius: 10,
				marginVertical: 15,
			}
		]}
		contentFit="contain"
		/>
		</Animated.View>

		<View style={styles.photoInstructionsButtons}>
		<TouchableOpacity
		style={styles.photoInstructionsButton}
		onPress={proceedWithImageCaraPicker}
		>
		<Text style={styles.photoInstructionsButtonText}>Entendido</Text>
		</TouchableOpacity>

		<TouchableOpacity
		style={styles.photoInstructionsCancelButton}
		onPress={() => setShowFacePhotoInstructions(false)}
		>
		<Text style={styles.photoInstructionsButtonText}>Cancelar</Text>
		</TouchableOpacity>
		</View>
		</View>
		</View>
		</Modal>

		{/* Photo Instructions Modal */}
		<Modal
		visible={showPhotoInstructions}
		animationType="slide"
		transparent={true}
		onRequestClose={() => setShowPhotoInstructions(false)}
		>
		<View style={styles.modalOverlay}>
		<View style={styles.photoInstructionsContainer}>
		<Text style={styles.photoInstructionsTitle}>Predicción por IA</Text>

		<Text style={styles.photoInstructionsText}>
		Para obtener mejores resultados en la predicción, toma una foto clara de tu mascota 
		de cuerpo completo o medio cuerpo. La IA analizará sus características físicas.
		</Text>

		<Text style={styles.photoInstructionsSubtext}>Ejemplo:</Text>

		<Image 
		source={{ uri: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106165577_kdJ94HNbowtEydO.png' }}
		style={styles.placeholderImage}
		/>

		<View style={styles.photoInstructionsButtons}>
		<TouchableOpacity
		style={styles.photoInstructionsButton}
		onPress={proceedWithImagePicker}
		>
		<Text style={styles.photoInstructionsButtonText}>Entendido</Text>
		</TouchableOpacity>

		<TouchableOpacity
		style={styles.photoInstructionsCancelButton}
		onPress={() => setShowPhotoInstructions(false)}
		>
		<Text style={styles.photoInstructionsButtonText}>Cancelar</Text>
		</TouchableOpacity>
		</View>
		</View>
		</View>
		</Modal>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#efedeaff',
	},
	scrollContainer: {
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		backgroundColor: '#fff',
		padding: 12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		marginBottom: 15,
		fontWeight: 'bold',
	},
	label: {
		fontSize: 16,
		color: '#000',
		fontWeight: 'bold',
		marginBottom: 5,
	},
	asterisk: {
		color: 'red',
	},
	pickerContainer: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: 'transparent',
		borderRadius: 10,
		marginBottom: 15,
		overflow: 'hidden',
	},
	picker: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		backgroundColor: '#fff',
		marginBottom: 15,
		elevation: 10,
		height: 60,
	},
	pickerItem: {
		color: '#000',
	},
	imageContainer: {
		alignItems: 'center',
		marginBottom: 15,
	},
	imageButton: {
		backgroundColor: '#000',
		padding: 12,
		borderRadius: 10,
		marginTop: 10,
		marginBottom: 20,
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	imageButtonText: {
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
		fontSize: 16,
	},
	previewImage: {
		width: 100,
		height: 100,
		borderRadius: 10,
		margin: 5,
	},
	previewContainer: {
		flexDirection: 'row',
	},
	previewImageWrapper: {
		position: 'relative',
	},
	deleteImageButton: {
		position: 'absolute',
		top: 0,
		right: 0,
		backgroundColor: 'white',
		borderRadius: 12,
	},
	switchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#ddd',
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	switchLabel: {
		fontSize: 16,
		color: '#333',
		fontWeight: 'bold',
		marginBottom: 10,
		flex: 1,
	},
	submitButton: {
		backgroundColor: '#b04f4f',
		padding: 15,
		borderRadius: 10,
		marginTop: 20,
	},
	submitButtonText: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 16,
	},
	logoApp: {
		alignSelf: 'center',
		marginBottom: 20,
	},
	inputMultiline: {
		backgroundColor: '#fff',
		padding: 12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		marginBottom: 15,
		minHeight: 100,
		textAlignVertical: 'top',
		fontWeight: 'bold',
	},
	mapContainer: {
		width: '100%',
		height: 250,
		marginBottom: 15,
		borderRadius: 5,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#ddd',
	},
	map: {
		width: '100%',
		height: 220,
	},
	addressText: {
		padding: 5,
		fontSize: 12,
		backgroundColor: '#f8f8f8',
		color: '#333',
		fontWeight: 'bold',
	},
	loadingText: {
		padding: 20,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	typeHint: {
		fontSize: 14,
		color: 'red',
		fontStyle: 'italic',
		marginBottom: 15,
		textAlign: 'center',
		paddingHorizontal: 10,
		fontWeight: 'bold',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	photoInstructionsContainer: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 20,
		margin: 20,
		alignItems: 'center',
		maxWidth: 350,
	},
	photoInstructionsTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 15,
		textAlign: 'center',
	},
	photoInstructionsText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 10,
		lineHeight: 22,
		fontWeight: 'bold',
	},
	photoInstructionsSubtext: {
		fontSize: 14,
		color: '#333',
		fontWeight: 'bold',
		marginBottom: 10,
	},
	placeholderImage: {
		width: 200,
		height: 200,
		borderRadius: 10,
		marginBottom: 20,
	},
	photoInstructionsButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	photoInstructionsButton: {
		backgroundColor: '#b04f4f',
		padding: 12,
		borderRadius: 5,
		flex: 1,
		marginRight: 5,
		alignItems: 'center',
	},
	photoInstructionsCancelButton: {
		backgroundColor: '#777',
		padding: 12,
		borderRadius: 5,
		flex: 1,
		marginLeft: 5,
		alignItems: 'center',
	},
	photoInstructionsButtonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
	},
	customPickerButton: {
		backgroundColor: '#fff',
		padding: 12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		marginBottom: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	colorPreview: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	customPickerText: {
		fontSize: 16,
		color: '#333',
		marginLeft: 10,
		fontWeight: 'bold',
		flex: 1,
	},
	colorOptionsContainer: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 10,
		marginBottom: 15,
		maxHeight: 200,
	},
	colorOption: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	colorSquare: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 1,
		marginRight: 10,
	},
	colorOptionText: {
		fontSize: 16,
		color: '#333',
		flex: 1,
		fontWeight: 'bold',
	},
	aiHint: {
		fontSize: 12,
		color: '#666',
		fontStyle: 'italic',
		marginTop: 5,
		textAlign: 'center',
		paddingHorizontal: 10,
		fontWeight: 'bold',
	},
	ageContainer: {
		backgroundColor: 'transparent',
		borderColor: 'transparent',
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
	},
	ageInput: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		marginRight: 10,
		fontWeight: 'bold',
	},
	ageUnitPickerContainer: {
		flex: 1,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: 'transparent',
		borderRadius: 10,
		overflow: 'hidden',
	},
	ageUnitPicker: {
		flex: 1,
		backgroundColor: 'transparent',
		borderWidth: 0,
		fontWeight: 'bold',
	},
	sizePickerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
		backgroundColor: '#fff',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	sizePicker: {
		flex: 1,
		backgroundColor: 'transparent',
		borderWidth: 0,
	},
	sizeIndicator: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: 'grey',
		marginHorizontal: 15,
	},
	sizeIndicatorPequeño: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	sizeIndicatorMediano: {
		width: 15,
		height: 15,
		borderRadius: 7.5,
	},
	sizeIndicatorGrande: {
		width: 20,
		height: 20,
		borderRadius: 10,
	},
	pickerWithIconContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
		width: '100%',
	},
	pickerWithIcon: {
		flex: 1,
		backgroundColor: 'transparent',
		borderWidth: 0,
	},
	pickerIcon: {
		marginHorizontal: 10,
	},
	customPickerModalContainer: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 20,
		margin: 20,
		alignItems: 'center',
		maxWidth: 350,
		width: '90%',
	},
	customPickerOption: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		width: '100%',
	},
	customPickerOptionIcon: {
		marginRight: 15,
	},
	customPickerOptionText: {
		fontSize: 18,
		color: '#333',
		fontWeight: 'bold',
	},
});

export default Registrar;
