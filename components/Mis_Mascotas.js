import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
  TouchableHighlight,
  SafeAreaView,
  Linking
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';


// Import shared data and components for consistency
import { getMascotas, updateMascotaEstado, updateMascotaData } from './MascotasData';
import { razasPerro, razasGato, razasConejo, razasAve, colores, EspecieIcon } from './Registrar';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Add this constant for predefined locations after other constants
const PREDEFINED_LOCATIONS = [
  { id: '1', name: 'Parque Colomos', address: 'Av. Patria, Colomos Providencia, Guadalajara', latitude: 20.7025, longitude: -103.3933 },
  { id: '2', name: 'Plaza Galerías', address: 'Av. Rafael Sanzio 150, Guadalajara', latitude: 20.6738, longitude: -103.4379 },
  { id: '3', name: 'Parque Metropolitano', address: 'Av. Beethoven 5800, Guadalajara', latitude: 20.6706, longitude: -103.4110 },
  { id: '4', name: 'Centro Histórico', address: 'Centro Histórico, Guadalajara', latitude: 20.6763, longitude: -103.3454 },
  { id: '5', name: 'Zoológico Guadalajara', address: 'Paseo del Zoológico 600, Guadalajara', latitude: 20.7295, longitude: -103.3252 },
  { id: '6', name: 'Bosque Los Colomos', address: 'Av. Patria y Av. Acueducto, Guadalajara', latitude: 20.7021, longitude: -103.3917 },
  { id: '7', name: 'Plaza del Sol', address: 'Av. López Mateos Sur, Guadalajara', latitude: 20.6553, longitude: -103.4020 },
  { id: '8', name: 'Universidad de Guadalajara', address: 'Av. Juárez 976, Guadalajara', latitude: 20.6749, longitude: -103.3693 },
  { id: '9', name: 'Mercado San Juan de Dios', address: 'Calz. Javier Mina 52, Guadalajara', latitude: 20.6741, longitude: -103.3428 },
  { id: '10', name: 'Estadio Akron', address: 'Zapopan, Jalisco', latitude: 20.7230, longitude: -103.4117 },
];

const MisMascotas = () => {
  const route = useRoute();
  const [mascotas, setMascotas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showMissingForm, setShowMissingForm] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [selectedPetDetails, setSelectedPetDetails] = useState(null);
  const [isEditingInModal, setIsEditingInModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Missing pet form states
  const [ultimaVezVisto, setUltimaVezVisto] = useState('');
  const [descripcionDesaparicion, setDescripcionDesaparicion] = useState(''); // Keep only this description
  const [metodoContacto, setMetodoContacto] = useState('');
  const [recompensa, setRecompensa] = useState('');
  const [tieneRecompensa, setTieneRecompensa] = useState('no');
  const [montoRecompensa, setMontoRecompensa] = useState('');
  const [ubicacionPerdida, setUbicacionPerdida] = useState({
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [direccionPerdida, setDireccionPerdida] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // Date picker states
  const [ultimaVezVistoFecha, setUltimaVezVistoFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Reason for disappearance
  const [razonPerdida, setRazonPerdida] = useState('');
  
  // Add these new state variables
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [locationSearchText, setLocationSearchText] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(PREDEFINED_LOCATIONS);
  const [customLocationMode, setCustomLocationMode] = useState(false);
  const [possibleMatches, setPossibleMatches] = useState({});
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  const isFocused = useIsFocused();

  // Get categorized mascotas
  const getMascotasByType = (type) => {
    return mascotas.filter(pet => pet.tipoRegistro === type);
  };

  const getMascotasByStatus = (status) => {
    return mascotas.filter(pet => pet.estado === status);
  };

  useEffect(() => {
  // Load all mascotas from shared data when screen is focused
  if (isFocused) {
    setMascotas(getMascotas().filter(pet => pet.tipoRegistro !== 'encontrada'));
    // Find possible matches for missing pets
    findPossibleMatches();
  }

  // If a specific pet was selected from Cuenta.js, scroll to it
  if (route.params && route.params.perroId) {
    // Implement scroll to specific pet if needed
  }
}, [route.params, isFocused, findPossibleMatches]);

  // Get current location when missing form opens
  useEffect(() => {
    if (showMissingForm) {
      getCurrentLocation();
    }
  }, [showMissingForm]);

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      // Check permissions first
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación. Por favor, habilita el permiso en la configuración.');
        setLoadingLocation(false);
        return;
      }

      // Attempt to get location with high accuracy
      console.log('Getting current position...');
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000
      });
      console.log('Location received:', location);
      
      if (location && location.coords) {
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        console.log('Setting location to:', newRegion);
        setUbicacionPerdida(newRegion);
        
        // Get address from coordinates
        try {
          console.log('Getting address for coordinates...');
          let addressResponse = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          
          if (addressResponse && addressResponse.length > 0) {
            const address = addressResponse[0];
            console.log('Address found:', address);
            const addressText = `${address.street || ''} ${address.name || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;
            setDireccionPerdida(addressText);
          } else {
            console.log('No address found');
            setDireccionPerdida('Dirección no disponible');
          }
        } catch (addressError) {
          console.error('Error getting address:', addressError);
          setDireccionPerdida('Error al obtener la dirección');
        }
      } else {
        console.log('Invalid location response:', location);
        Alert.alert('Error', 'No se pudo obtener una ubicación válida');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación. Por favor, verifica que el GPS esté activado.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // Handle manual location refresh
  const refreshLocation = () => {
    getCurrentLocation();
  };

  const handleMarkerDrag = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setUbicacionPerdida({
      ...ubicacionPerdida,
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
        setDireccionPerdida(addressText);
      }
    } catch (error) {
      console.log('Error getting address:', error);
    }
  };

  const handleReportarDesaparecido = (id) => {
    setSelectedPetId(id);
    setShowMissingForm(true);
    // Reset form fields
    setUltimaVezVisto('');
    setUltimaVezVistoFecha(new Date());
    setDescripcionDesaparicion(''); // Reset the optional description
    setMetodoContacto('');
    setRecompensa('');
    setTieneRecompensa('no');
    setMontoRecompensa('');
    setDireccionPerdida('');
    setRazonPerdida(''); // Set to empty to show placeholder
  };

  // Date picker handlers
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || ultimaVezVistoFecha;
    setShowDatePicker(Platform.OS === 'ios');
    setUltimaVezVistoFecha(currentDate);
    
    // Format the date for display
    const formattedDate = formatDate(currentDate);
    setUltimaVezVisto(formattedDate);
  };

  // Format date for display
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Show date picker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Validate numeric input for reward amount
  const handleMontoRecompensaChange = (text) => {
    // Only allow digits
    const numericValue = text.replace(/[^0-9]/g, '');
    setMontoRecompensa(numericValue);
  };

  const handleSubmitMissingReport = () => {
    // Validate required fields
    if (!ultimaVezVisto || !razonPerdida) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios (última vez visto y razón de desaparición)');
      return;
    }

    // Validate reward amount if reward is selected
    if (tieneRecompensa === 'si' && (!montoRecompensa || parseInt(montoRecompensa) <= 0)) {
      Alert.alert('Error', 'Por favor, ingresa una cantidad válida para la recompensa');
      return;
    }

    // Prepare reward text
    const recompensaText = tieneRecompensa === 'si' 
      ? `$${montoRecompensa} MXN` 
      : 'Sin recompensa';

    // Update mascota with missing details
    const missingDetails = {
      ultimaVezVisto,
      fechaDesaparicion: ultimaVezVistoFecha.toISOString(), // Store the ISO date string
      descripcionDesaparicion: descripcionDesaparicion, // Include only the disappearance description
      contacto: metodoContacto || 'Contactar através del perfil',
      recompensa: recompensaText,
      ubicacionPerdida: direccionPerdida,
      razonPerdida: razonPerdida, // Add reason for disappearance
      ubicacion: {
        latitude: ubicacionPerdida.latitude,
        longitude: ubicacionPerdida.longitude,
        direccion: direccionPerdida
      }
    };

    // Update the pet data first
    const updatedMascotas = updateMascotaData(selectedPetId, missingDetails);
    // Then update the status
    const finalMascotas = updateMascotaEstado(selectedPetId, 'Desaparecido');
    setMascotas([...finalMascotas]);
    
    // Close form and reset
    setShowMissingForm(false);
    setSelectedPetId(null);
    Alert.alert('Éxito', 'Mascota reportada como desaparecida correctamente');
  };

  const handleReportarEncontrado = (id) => {
    // Update the shared data and local state
    const updatedMascotas = updateMascotaEstado(id, 'Presente');
    setMascotas([...updatedMascotas]);
  };

  const handleMascotaAdoptada = (id) => {
    Alert.alert(
      'Confirmar adopción',
      '¿Estás seguro de que esta mascota ha sido adoptada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            const updatedMascotas = updateMascotaEstado(id, 'Adoptada');
            setMascotas([...updatedMascotas]);
            Alert.alert('Éxito', 'Mascota marcada como adoptada');
          }
        }
      ]
    );
  };

  const handleCancelarAdopcion = (id) => {
    Alert.alert(
      'Cancelar adopción',
      '¿Estás seguro de que quieres cancelar la adopción? La mascota volverá a estar disponible para adopción.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          onPress: () => {
            const updatedMascotas = updateMascotaEstado(id, 'Presente');
            setMascotas([...updatedMascotas]);
            Alert.alert('Éxito', 'Adopción cancelada. La mascota está disponible nuevamente.');
          }
        }
      ]
    );
  };

  const handleShowPetDetails = (mascota) => {
    setSelectedPetDetails(mascota);
    setShowPetDetails(true);
    setIsEditingInModal(false);

    // Parse age into number and unit for editing
    const ageParts = mascota.edad.split(' ');
    const ageNumber = ageParts[0] || '';
    const ageUnit = ageParts[1] || 'años';

    // Initialize edit data in case user wants to edit
    setEditData({
      nombre: mascota.nombre,
      edad: ageNumber,
      edadUnidad: ageUnit,
      raza: mascota.raza,
      sexo: mascota.sexo,
      color: mascota.color || '',
      tamaño: mascota.tamaño || '',
      descripcion: mascota.descripcion || '',
      imagen: mascota.imagen || [],
      imagencara: mascota.imagencara || null,
    });
  };

  const handleDeletePet = (id) => {
    Alert.alert(
      'Eliminar mascota',
      '¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            // Remove from shared data
            const updatedMascotas = getMascotas().filter(pet => pet.id !== id);
            // Update the shared data (you'll need to implement this function in MascotasData.js)
            setMascotas(updatedMascotas);
            setShowPetDetails(false);
            Alert.alert('Éxito', 'Registro eliminado correctamente');
          }
        }
      ]
    );
  };

  const handleSaveEditInModal = () => {
    // Validate input
    if (!editData.nombre || !editData.edad || !editData.raza) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Reconstruct the pet data before saving
    const petDataToSave = {
      ...editData,
      edad: `${editData.edad} ${editData.edadUnidad}`, // Combine age and unit
    };

    // Update mascota data
    const updatedMascotas = updateMascotaData(selectedPetDetails.id, petDataToSave);
    setMascotas([...updatedMascotas]);
    
    // Update selected pet details
    const updatedPet = updatedMascotas.find(pet => pet.id === selectedPetDetails.id);
    setSelectedPetDetails(updatedPet);
    
    setIsEditingInModal(false);
    Alert.alert('Éxito', 'Datos actualizados correctamente.');
  };

  const handleEditChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value
    });
  };

  const pickImageForEdit = async () => {
    if (editData.imagen.length >= 4) {
      Alert.alert('Límite alcanzado', 'Puedes subir un máximo de 4 imágenes.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleEditChange('imagen', [...editData.imagen, result.assets[0].uri]);
    }
  };

  const removeImageFromEdit = (indexToRemove) => {
    handleEditChange('imagen', editData.imagen.filter((_, index) => index !== indexToRemove));
  };

  const pickImageCaraForEdit = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleEditChange('imagencara', result.assets[0].uri);
    }
  };

  const removeImageCaraFromEdit = () => {
    handleEditChange('imagencara', null);
  };

  const getPetTypeLabel = (pet) => {
    if (pet.tipoRegistro === 'adopcion') {
      return pet.estado === 'Adoptada' ? 'Adoptada' : 'En adopción';
    }
    return pet.estado;
  };

  const getPetTypeColor = (pet) => {
    if (pet.tipoRegistro === 'adopcion') {
      return pet.estado === 'Adoptada' ? '#888888' : '#4682B4'; // Gray for adopted, Steel Blue for adoption
    }
    return pet.estado === 'Presente' ? '#32CD32' : '#FF6347';
  };

  const getRazasList = (especie) => {
    switch(especie) {
      case 'perro': return razasPerro;
      case 'gato': return razasGato;
      case 'conejo': return razasConejo;
      case 'ave': return razasAve;
      default: return ['Selecciona una raza'];
    }
  };

  const startEditing = (mascota) => {
    // Remove inline editing functionality - now handled in modal
    handleShowPetDetails(mascota);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEditing = (id) => {
    // Validate input
    if (!editData.nombre || !editData.edad || !editData.raza) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Update mascota data
    const updatedMascotas = updateMascotaData(id, editData);
    setMascotas([...updatedMascotas]);
    setEditingId(null);
    setEditData({});
    
    Alert.alert('Éxito', 'Datos actualizados correctamente.');
  };

  // Filter locations based on search text
  const filterLocations = (text) => {
    setLocationSearchText(text);
    if (text) {
      const filtered = PREDEFINED_LOCATIONS.filter(
        location => location.name.toLowerCase().includes(text.toLowerCase()) || 
                   location.address.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(PREDEFINED_LOCATIONS);
    }
  };

  // Select a predefined location
  const selectLocation = (location) => {
    setUbicacionPerdida({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    setDireccionPerdida(location.address);
    setShowLocationSelector(false);
  };

  // Toggle to custom location mode with map
  const toggleCustomLocationMode = () => {
    setCustomLocationMode(!customLocationMode);
    if (!customLocationMode) {
      // Get current location when switching to custom mode
      getCurrentLocation();
    }
  };

  // This function finds possible matches for missing pets
  const findPossibleMatches = () => {
    const allPets = getMascotas();
    const missingPets = allPets.filter(pet => pet.estado === 'Desaparecido');
    const foundPets = allPets.filter(pet => pet.tipoRegistro === 'encontrada');
    
    const matches = {};
    
    missingPets.forEach(missingPet => {
      const petMatches = foundPets.map(foundPet => {
        // Calculate similarity score based on characteristics
        let score = 5.7;
        
        // Check species - most important
        if (missingPet.especie === foundPet.especie) {
          score += 30;
          
          // Check breed - very important
          if (missingPet.raza === foundPet.raza) {
            score += 20;
          }
          
          // Check gender - important
          if (missingPet.sexo === foundPet.sexo) {
            score += 15;
          }
          
          // Check color - somewhat important
          if (missingPet.color === foundPet.color) {
            score += 15;
          }
          
          // Check size - somewhat important
          if (missingPet.tamaño === foundPet.tamaño) {
            score += 10;
          }
          
          // Check location proximity - can be important
          if (missingPet.ubicacion && foundPet.ubicacion) {
            const distance = calculateDistance(
              missingPet.ubicacion.latitude,
              missingPet.ubicacion.longitude,
              foundPet.ubicacion.latitude,
              foundPet.ubicacion.longitude
            );
            
            // If within 5km, give points based on proximity
            if (distance < 5) {
              score += 10;
            } else if (distance < 10) {
              score += 5;
            }
          }
        }
        
        return {
          pet: foundPet,
          score: score
        };
      });
      
      // Filter matches with score > 40 and sort by score
      const goodMatches = petMatches
        .filter(match => match.score > 40)
        .sort((a, b) => b.score - a.score);
      
      if (goodMatches.length > 0) {
        matches[missingPet.id] = goodMatches;
      }
    });
    
    setPossibleMatches(matches);
  };
  
  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };
  
  const hasPossibleMatch = (petId) => {
    return possibleMatches[petId] && possibleMatches[petId].length > 0;
  };
  
  const getBestMatch = (petId) => {
    if (hasPossibleMatch(petId)) {
      return possibleMatches[petId][0];
    }
    return null;
  };
  
  const handleViewMatchDetails = (match) => {
    setSelectedMatch(match.pet);
    setShowMatchDetails(true);
  };

  // Open WhatsApp with the found pet's contact number
  const handleContactWhatsApp = (match) => {
    // Try to extract the phone number from the contact field
    let phone = '';
    if (match.pet.contacto && match.pet.contacto.toLowerCase().includes('whatsapp')) {
      // Extract digits from the contact string
      const matchPhone = match.pet.contacto.match(/(\d{10,})/);
      if (matchPhone) {
        phone = matchPhone[1];
      }
    }
    if (!phone) {
      Alert.alert('No disponible', 'No se encontró un número de WhatsApp válido para contactar.');
      return;
    }
    const message = `Hola, vi en la aplicación Laika - encuentra tu mascota perdida 🐩 que encontraste una mascota que se parece mucho a la mía, llamada ${selectedPetDetails.nombre}.\n\nMe gustaría saber si podemos hablar para ver si es mi mascota. ¡Muchas gracias!`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/52${phone}?text=${encodedMessage}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp.');
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Text style={styles.titulo}>Mis Mascotas registradas</Text>
          
          {/* Group pets by type/status for better organization */}
          {mascotas.length > 0 ? (
            <View style={styles.verticalContainer}>
              {mascotas.map((mascota) => (
                <View key={mascota.id} style={[
                  styles.verticalBox, 
                  { borderLeftWidth: 5, borderLeftColor: getPetTypeColor(mascota) }
                ]}>
                  <Image style={styles.imageVertical} source={{ uri: mascota.imagencara }} />
                  <View style={styles.verticalTextContainer}>
                    {editingId === mascota.id ? (
                      // Editing mode
                      <>
                        <TextInput
                          style={styles.editInput}
                          value={editData.nombre}
                          onChangeText={(text) => handleEditChange('nombre', text)}
                          placeholder="Nombre"
                        />
                        <TextInput
                          style={styles.editInput}
                          value={editData.edad}
                          onChangeText={(text) => handleEditChange('edad', text)}
                          placeholder="Edad"
                        />
                        <TextInput
                          style={styles.editInput}
                          value={editData.raza}
                          onChangeText={(text) => handleEditChange('raza', text)}
                          placeholder="Raza"
                        />
                        <TextInput
                          style={styles.editInput}
                          value={editData.color}
                          onChangeText={(text) => handleEditChange('color', text)}
                          placeholder="Color"
                        />
                        <TextInput
                          style={styles.editInput}
                          value={editData.tamaño}
                          onChangeText={(text) => handleEditChange('tamaño', text)}
                          placeholder="Tamaño"
                        />
                        <TextInput
                          style={styles.editInput}
                          value={editData.descripcion}
                          onChangeText={(text) => handleEditChange('descripcion', text)}
                          placeholder="Descripción"
                          multiline
                          numberOfLines={2}
                        />
                        <Text style={styles.verticalDetail}>Estado: {mascota.estado}</Text>
                        
                        <View style={styles.editButtonsContainer}>
                          <TouchableOpacity
                            style={styles.botonGuardar}
                            onPress={() => saveEditing(mascota.id)}
                          >
                            <Text style={styles.botonTexto}>Guardar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.botonCancelar}
                            onPress={cancelEditing}
                          >
                            <Text style={styles.botonTexto}>Cancelar</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      // View mode
                      <>
                        <View style={styles.petHeaderContainer}>
                          <View style={styles.nameAndGenderContainer}>
                            <Text style={styles.verticalName}>{mascota.nombre}</Text>
                            {mascota.sexo && mascota.sexo.toLowerCase() === 'macho' && <FontAwesome5 name="mars" size={18} color="#333" style={styles.genderIcon} />}
                            {mascota.sexo && mascota.sexo.toLowerCase() === 'hembra' && <FontAwesome5 name="venus" size={18} color="#333" style={styles.genderIcon} />}
                          </View>
                          <View style={styles.statusContainer}>
                            {mascota.estado === 'Desaparecido' && hasPossibleMatch(mascota.id) && (
                              <FontAwesome5 name="exclamation-circle" size={18} color="#FFA500" style={styles.alertIcon} />
                            )}
                            <Text style={[
                              styles.petTypeLabel, 
                              { backgroundColor: getPetTypeColor(mascota) }
                            ]}>
                              {getPetTypeLabel(mascota)}
                            </Text>
                          </View>
                        </View>
                        
                        <Text style={styles.verticalDetail}><Text style={styles.boldLabel}>Edad:</Text> {mascota.edad}</Text>
                        <Text style={styles.verticalDetail}><Text style={styles.boldLabel}>Raza:</Text> {mascota.raza}</Text>
                        <Text style={styles.verticalDetail}><Text style={styles.boldLabel}>Color:</Text> {mascota.color}</Text>
                        <Text style={styles.verticalDetail}><Text style={styles.boldLabel}>Tamaño:</Text> {mascota.tamaño}</Text>

                        
                        {/* Show buttons for user's own pets and found pets */}
                        <View style={styles.buttonRow}>
                          <TouchableOpacity
                            style={styles.botonEditar}
                            onPress={() => handleShowPetDetails(mascota)}
                          >
                            <Text style={styles.botonTexto}>Mas Info.</Text>
                          </TouchableOpacity>
                          
                          
                            
                              {mascota.tipoRegistro === 'adopcion' ? (
                                mascota.estado === 'Adoptada' ? (
                                  <TouchableOpacity
                                    style={styles.botonCancelarAdopcion}
                                    onPress={() => handleCancelarAdopcion(mascota.id)}
                                  >
                                    <Text style={styles.botonTexto}>Cancelar adopción</Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={styles.botonAdoptada}
                                    onPress={() => handleMascotaAdoptada(mascota.id)}
                                  >
                                    <Text style={styles.botonTexto}>Mascota Adoptada</Text>
                                  </TouchableOpacity>
                                )
                              ) : (
                                <>
                                  {mascota.estado === 'Presente' ? (
                                    <TouchableOpacity
                                      style={styles.botonDesaparecido}
                                      onPress={() => handleReportarDesaparecido(mascota.id)}
                                    >
                                      <Text style={styles.botonTexto}>Reportar como desaparecido</Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={styles.botonEncontrado}
                                      onPress={() => handleReportarEncontrado(mascota.id)}
                                    >
                                      <Text style={styles.botonTexto}>Reportar como encontrado</Text>
                                    </TouchableOpacity>
                                  )}
                                </>
                              )}
                            
                          
                        </View>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noMascotasText}>
              No hay mascotas registradas todavía.
            </Text>
          )}
        </ScrollView>

        {/* Pet Details Modal */}
        <Modal
          visible={showPetDetails}
          animationType="slide"
          onRequestClose={() => setShowPetDetails(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalScrollContainer}>
              <Text style={styles.modalTitle}>Detalles de la Mascota</Text>
              
              {selectedPetDetails && (
                <View style={styles.petDetailsContainer}>
                  <Image 
                    style={styles.petDetailsImage} 
                    source={{ uri: selectedPetDetails.imagencara }} 
                  />
                  
                  {isEditingInModal ? (
                    // Edit mode in modal
                    <View style={styles.editFormContainer}>
                      {/* Image Management */}
                      <Text style={styles.modalLabel}>Imágenes (máx. 4)</Text>
                      <TouchableOpacity style={styles.imageButton} onPress={pickImageForEdit}>
                        <Text style={styles.imageButtonText}>Agregar Imagen</Text>
                      </TouchableOpacity>
                      <ScrollView horizontal={true} style={styles.previewContainer}>
                        {editData.imagen && editData.imagen.map((uri, index) => (
                          <View key={index} style={styles.previewImageWrapper}>
                            <Image source={{ uri }} style={styles.previewImage} />
                            <TouchableOpacity
                              style={styles.deleteImageButton}
                              onPress={() => removeImageFromEdit(index)}
                            >
                              <Ionicons name="close-circle" size={24} color="red" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>

                      {/* Face Image Management */}
                      <Text style={styles.modalLabel}>Foto del Rostro <Text style={styles.asterisk}>*</Text></Text>
                      <TouchableOpacity style={styles.imageButton} onPress={pickImageCaraForEdit}>
                        <Text style={styles.imageButtonText}>Cambiar Foto del Rostro</Text>
                      </TouchableOpacity>
                      {editData.imagencara && (
                        <View style={styles.previewImageWrapper}>
                          <Image source={{ uri: editData.imagencara }} style={styles.previewImage} />
                          <TouchableOpacity
                            style={styles.deleteImageButton}
                            onPress={removeImageCaraFromEdit}
                          >
                            <Ionicons name="close-circle" size={24} color="red" />
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* Nombre */}
                      <Text style={styles.modalLabel}>Nombre <Text style={styles.asterisk}>*</Text></Text>
                      <TextInput
                        style={styles.modalInput}
                        value={editData.nombre}
                        onChangeText={(text) => handleEditChange('nombre', text)}
                        placeholder="Nombre"
                      />

                      {/* Edad */}
                      <Text style={styles.modalLabel}>Edad <Text style={styles.asterisk}>*</Text></Text>
                      <View style={styles.ageContainer}>
                        <TextInput
                          style={styles.ageInput}
                          value={editData.edad}
                          onChangeText={(text) => handleEditChange('edad', text)}
                          placeholder="Edad"
                          keyboardType="numeric"
                        />
                        <Picker
                          selectedValue={editData.edadUnidad}
                          style={styles.ageUnitPicker}
                          onValueChange={(itemValue) => handleEditChange('edadUnidad', itemValue)}
                        >
                          <Picker.Item label="Meses" value="meses" />
                          <Picker.Item label="Años" value="años" />
                        </Picker>
                      </View>

                      {/* Especie (Not editable, just for context) */}
                      <Text style={styles.modalLabel}>Especie</Text>
                      <View style={styles.pickerWithIconContainer}>
                        <Text style={styles.customPickerText}>{selectedPetDetails.especie.charAt(0).toUpperCase() + selectedPetDetails.especie.slice(1)}</Text>
                        <EspecieIcon name={selectedPetDetails.especie} />
                      </View>

                      {/* Raza */}
                      <Text style={styles.modalLabel}>Raza <Text style={styles.asterisk}>*</Text></Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={editData.raza}
                          style={styles.modalPicker}
                          onValueChange={(itemValue) => handleEditChange('raza', itemValue)}
                        >
                          {getRazasList(selectedPetDetails.especie).map((razaOption, index) => (
                            <Picker.Item key={index} label={razaOption} value={razaOption} />
                          ))}
                        </Picker>
                      </View>

                      {/* Sexo */}
                      <Text style={styles.modalLabel}>Sexo <Text style={styles.asterisk}>*</Text></Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={editData.sexo}
                          style={styles.modalPicker}
                          onValueChange={(itemValue) => handleEditChange('sexo', itemValue)}
                        >
                          <Picker.Item label="Macho" value="Macho" />
                          <Picker.Item label="Hembra" value="Hembra" />
                        </Picker>
                      </View>

                      {/* Color */}
                      <Text style={styles.modalLabel}>Color <Text style={styles.asterisk}>*</Text></Text>
                      <TouchableOpacity
                        style={styles.customPickerButton}
                        onPress={() => setShowColorPicker(!showColorPicker)}
                      >
                        <View style={styles.colorPreview}>
                          {editData.color && (
                            <View style={[styles.colorSquare, { backgroundColor: colores.find(c => c.value === editData.color)?.color || '#transparent' }]} />
                          )}
                          <Text style={styles.customPickerText}>{editData.color || 'Selecciona un color'}</Text>
                        </View>
                        <FontAwesome5 name="chevron-down" size={20} color="#666" />
                      </TouchableOpacity>

                      {showColorPicker && (
                        <ScrollView style={styles.colorOptionsContainer} nestedScrollEnabled={true}>
                          {colores.map((colorOption, index) => (
                            <TouchableOpacity
                              key={index}
                              style={styles.colorOption}
                              onPress={() => {
                                handleEditChange('color', colorOption.value);
                                setShowColorPicker(false);
                              }}
                            >
                              <View style={[styles.colorSquare, { backgroundColor: colorOption.color, borderColor: colorOption.color === '#FFFFFF' ? '#ccc' : 'transparent' }]} />
                              <Text style={styles.colorOptionText}>{colorOption.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}

                      {/* Tamaño */}
                      <Text style={styles.modalLabel}>Tamaño <Text style={styles.asterisk}>*</Text></Text>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={editData.tamaño}
                          style={styles.modalPicker}
                          onValueChange={(itemValue) => handleEditChange('tamaño', itemValue)}
                        >
                          <Picker.Item label="Pequeño" value="Pequeño" />
                          <Picker.Item label="Mediano" value="Mediano" />
                          <Picker.Item label="Grande" value="Grande" />
                        </Picker>
                      </View>

                      {/* Descripción */}
                      <Text style={styles.modalLabel}>Descripción</Text>
                      <TextInput
                        style={styles.modalInputMultiline}
                        value={editData.descripcion}
                        onChangeText={(text) => handleEditChange('descripcion', text)}
                        placeholder="Descripción"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  ) : (
                    // View mode in modal
                    <View style={styles.petDetailsInfo}>
                      <View style={styles.petDetailTitleContainer}>
                        <Text style={styles.petDetailTitle}>{selectedPetDetails.nombre}</Text>
                        {selectedPetDetails.sexo && selectedPetDetails.sexo.toLowerCase() === 'macho' && <FontAwesome5 name="mars" size={24} color="#333" style={styles.genderIconInTitle} />}
                        {selectedPetDetails.sexo && selectedPetDetails.sexo.toLowerCase() === 'hembra' && <FontAwesome5 name="venus" size={24} color="#333" style={styles.genderIconInTitle} />}
                        {selectedPetDetails.sexo && selectedPetDetails.sexo.toLowerCase() === 'desconocido' && <FontAwesome5 name="question" size={24} color="#333" style={styles.genderIconInTitle} />}
                      </View>
                      <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Edad:</Text> {selectedPetDetails.edad}</Text>
                      <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Raza:</Text> {selectedPetDetails.raza}</Text>
                      <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Color:</Text> {selectedPetDetails.color || 'No especificado'}</Text>
                      <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Tamaño:</Text> {selectedPetDetails.tamaño || 'No especificado'}</Text>
                      <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Estado:</Text> {selectedPetDetails.estado}</Text>
                      
                      {selectedPetDetails.descripcion && (
                        <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Descripción:</Text> {selectedPetDetails.descripcion}</Text>
                      )}

                      {Array.isArray(selectedPetDetails.imagen) && selectedPetDetails.imagen.length > 0 && (
                        <View style={styles.galleryContainer}>
                          <Text style={styles.galleryTitle}>Galería de Imágenes</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {selectedPetDetails.imagen.map((img, index) => (
                              <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
                            ))}
                          </ScrollView>
                        </View>
                      )}
                      
                      {/* Show missing pet details if available */}
                      {selectedPetDetails.ultimaVezVisto && (
                        <>
                          <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Última vez visto:</Text> {selectedPetDetails.ultimaVezVisto}</Text>
                          <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Recompensa:</Text> {selectedPetDetails.recompensa}</Text>
                          <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Contacto:</Text> {selectedPetDetails.contacto}</Text>
                          <Text style={styles.petDetailItem}><Text style={styles.boldLabel}>Ubicación perdida:</Text> {selectedPetDetails.ubicacionPerdida}</Text>
                        </>
                      )}
                    </View>
                  )}
                  
                  {!isEditingInModal && selectedPetDetails.estado === 'Desaparecido' && hasPossibleMatch(selectedPetDetails.id) && (
                    <View style={styles.possibleMatchContainer}>
                      <View style={styles.possibleMatchHeader}>
                        <FontAwesome5 name="exclamation-circle" size={22} color="#FFA500" />
                        <Text style={styles.possibleMatchTitle}>¡Posible coincidencia encontrada!</Text>
                      </View>
                      
                      {getBestMatch(selectedPetDetails.id) && (
                        <View style={styles.matchCardContainer}>
                          <View style={styles.matchCard}>
                            <View style={styles.matchImageAndScore}>
                              <Image 
                                source={{ uri: getBestMatch(selectedPetDetails.id).pet.imagencara }} 
                                style={styles.matchImage} 
                              />
                              <View style={styles.matchScoreContainer}>
                                <Text style={styles.matchScoreText}>
                                  {getBestMatch(selectedPetDetails.id).score}% 
                                </Text>
                                <Text style={styles.matchScoreLabel}>similitud</Text>
                              </View>
                            </View>
                            
                            <View style={styles.matchDetails}>
                              <Text style={styles.matchName}>{getBestMatch(selectedPetDetails.id).pet.nombre || 'Mascota'}</Text>
                              
                              <View style={styles.matchComparisonContainer}>
                                <View style={styles.comparisonColumn}>
                                  <Text style={styles.comparisonLabel}>Características</Text>
                                  <Text style={styles.comparisonItem}>Especie: {selectedPetDetails.especie}</Text>
                                  <Text style={styles.comparisonItem}>Raza: {selectedPetDetails.raza}</Text>
                                  <Text style={styles.comparisonItem}>Sexo: {selectedPetDetails.sexo}</Text>
                                  <Text style={styles.comparisonItem}>Color: {selectedPetDetails.color}</Text>
                                  <Text style={styles.comparisonItem}>Tamaño: {selectedPetDetails.tamaño}</Text>
                                </View>
                                
                                <View style={styles.comparisonColumn}>
                                  <Text style={styles.comparisonLabel}>Coincidencia</Text>
                                  <Text style={[
                                    styles.comparisonItem, 
                                    selectedPetDetails.especie === getBestMatch(selectedPetDetails.id).pet.especie 
                                      ? styles.matchingItem : styles.nonMatchingItem
                                  ]}>
                                    {getBestMatch(selectedPetDetails.id).pet.especie}
                                  </Text>
                                  <Text style={[
                                    styles.comparisonItem, 
                                    selectedPetDetails.raza === getBestMatch(selectedPetDetails.id).pet.raza 
                                      ? styles.matchingItem : styles.nonMatchingItem
                                  ]}>
                                    {getBestMatch(selectedPetDetails.id).pet.raza}
                                  </Text>
                                  <Text style={[
                                    styles.comparisonItem, 
                                    selectedPetDetails.sexo === getBestMatch(selectedPetDetails.id).pet.sexo 
                                      ? styles.matchingItem : styles.nonMatchingItem
                                  ]}>
                                    {getBestMatch(selectedPetDetails.id).pet.sexo}
                                  </Text>
                                  <Text style={[
                                    styles.comparisonItem, 
                                    selectedPetDetails.color === getBestMatch(selectedPetDetails.id).pet.color 
                                      ? styles.matchingItem : styles.nonMatchingItem
                                  ]}>
                                    {getBestMatch(selectedPetDetails.id).pet.color}
                                  </Text>
                                  <Text style={[
                                    styles.comparisonItem, 
                                    selectedPetDetails.tamaño === getBestMatch(selectedPetDetails.id).pet.tamaño 
                                      ? styles.matchingItem : styles.nonMatchingItem
                                  ]}>
                                    {getBestMatch(selectedPetDetails.id).pet.tamaño}
                                  </Text>
                                </View>
                              </View>
                              
                              <Text style={styles.matchFoundLocation}>
                                <Text style={styles.boldLabel}>Ubicación:</Text> {getBestMatch(selectedPetDetails.id).pet.ubicacion?.direccion || 'No especificada'}
                              </Text>
                              
                              <TouchableOpacity
                                style={styles.viewMatchButton}
                                onPress={() => handleContactWhatsApp(getBestMatch(selectedPetDetails.id))}
                              >
                                <Text style={styles.viewMatchButtonText}>Contactar por WhatsApp</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                  
                  <View style={styles.petDetailsButtonContainer}>
                    {isEditingInModal ? (
                      <>
                        <TouchableOpacity
                          style={styles.modalSubmitButton}
                          onPress={handleSaveEditInModal}
                        >
                          <Text style={styles.modalButtonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalCancelButton}
                          onPress={() => setIsEditingInModal(false)}
                        >
                          <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.modalEditButton}
                          onPress={() => setIsEditingInModal(true)}
                        >
                          <Text style={styles.modalButtonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalDeleteButton}
                          onPress={() => handleDeletePet(selectedPetDetails.id)}
                        >
                          <Text style={styles.modalButtonText}>Eliminar Registro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalCancelButton}
                          onPress={() => setShowPetDetails(false)}
                        >
                          <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Match Details Modal */}
        <Modal
          visible={showMatchDetails}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowMatchDetails(false)}
        >
          <View style={styles.matchModalOverlay}>
            <View style={styles.matchModalContainer}>
              <Text style={styles.matchModalTitle}>Detalles de la Coincidencia</Text>
              
              {selectedMatch && (
                <View style={styles.matchDetailsContainer}>
                  <Image 
                    source={{ uri: selectedMatch.imagencara }} 
                    style={styles.matchDetailImage} 
                  />
                  
                  <Text style={styles.matchDetailName}>{selectedMatch.nombre || 'Mascota sin nombre'}</Text>
                  
                  <View style={styles.matchDetailInfoContainer}>
                    <Text style={styles.matchDetailItem}><Text style={styles.boldLabel}>Especie:</Text> {selectedMatch.especie}</Text>
                    <Text style={styles.matchDetailItem}><Text style={styles.boldLabel}>Raza:</Text> {selectedMatch.raza}</Text>
                    <Text style={styles.matchDetailItem}><Text style={styles.boldLabel}>Sexo:</Text> {selectedMatch.sexo}</Text>
                    <Text style={styles.matchDetailItem}><Text style={styles.boldLabel}>Color:</Text> {selectedMatch.color}</Text>
                    <Text style={styles.matchDetailItem}><Text style={styles.boldLabel}>Tamaño:</Text> {selectedMatch.tamaño}</Text>
                    <Text style={styles.matchDetailItem}><Text style={styles.boldLabel}>Ubicación:</Text> {selectedMatch.ubicacion?.direccion || 'No especificada'}</Text>
                    
                    {selectedMatch.descripcion && (
                      <Text style={styles.matchDetailItem}><Text style={styles.boldLabel}>Descripción:</Text> {selectedMatch.descripcion}</Text>
                    )}
                    
                    <Text style={styles.matchFoundInfo}>
                      <Text style={styles.boldLabel}>Encontrada:</Text> {formatDate(new Date(selectedMatch.fechaRegistro))}
                    </Text>
                    
                    <Text style={styles.matchContactInfo}>
                      <Text style={styles.boldLabel}>Contacto:</Text> {selectedMatch.contacto || 'No especificado'}
                    </Text>
                  </View>
                  
                  <View style={styles.matchModalButtonsContainer}>
                    <TouchableOpacity
                      style={styles.contactMatchButton}
                      onPress={() => {
                        // Here you would implement contacting the person who found the pet
                        Alert.alert('Contacto', 'Función de contacto no implementada en la demo');
                      }}
                    >
                      <Text style={styles.contactMatchButtonText}>Contactar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.closeMatchButton}
                      onPress={() => setShowMatchDetails(false)}
                    >
                      <Text style={styles.closeMatchButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Missing Pet Report Modal */}
        <Modal
          visible={showMissingForm}
          animationType="slide"
          onRequestClose={() => setShowMissingForm(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <ScrollView contentContainerStyle={styles.modalScrollContainer}>
              <Text style={styles.modalTitle}>Reportar Mascota Desaparecida</Text>
              
              <Text style={styles.modalLabel}>¿Cuándo fue la última vez que viste a tu mascota? <Text style={styles.asterisk}>*</Text></Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={showDatepicker}
              >
                <Text style={styles.datePickerButtonText}>
                  {ultimaVezVisto || 'Seleccionar fecha'}
                </Text>
                <FontAwesome5 name="calendar-alt" size={20} color="#555" />
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={ultimaVezVistoFecha}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()} // Cannot select future dates
                />
              )}

              <Text style={styles.modalLabel}>Razón de la desaparición <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={razonPerdida}
                  style={styles.modalPicker}
                  onValueChange={(itemValue) => setRazonPerdida(itemValue)}
                >
                  <Picker.Item label="Seleccione una opción" value="" enabled={false} />
                  <Picker.Item label="Extravío" value="extravio" />
                  <Picker.Item label="Robo" value="robo" />
                  <Picker.Item label="Desconocido" value="desconocido" />
                </Picker>
              </View>
              
              <Text style={styles.modalLabel}>Descripción de la desaparición (opcional)</Text>
              <TextInput
                style={styles.modalInputMultiline}
                placeholder="Describe las circunstancias de la desaparición, dónde y cómo ocurrió, etc."
                value={descripcionDesaparicion}
                onChangeText={setDescripcionDesaparicion}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.modalLabel}>¿Tendrá recompensa?</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tieneRecompensa}
                  style={styles.modalPicker}
                  onValueChange={(itemValue) => setTieneRecompensa(itemValue)}
                >
                  <Picker.Item label="No" value="no" />
                  <Picker.Item label="Sí" value="si" />
                </Picker>
              </View>

              {tieneRecompensa === 'si' && (
                <>
                  <Text style={styles.modalLabel}>Cantidad de recompensa (solo números) <Text style={styles.asterisk}>*</Text></Text>
                  <View style={styles.moneyInputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.moneyInput}
                      placeholder="Ej: 500, 1000, etc."
                      value={montoRecompensa}
                      onChangeText={handleMontoRecompensaChange}
                      keyboardType="numeric"
                    />
                  </View>
                </>
              )}

              <Text style={styles.modalLabel}>Ubicación donde se perdió</Text>
              
              {!customLocationMode ? (
                // Location selector mode
                <View style={styles.locationSelectorContainer}>
                  <TouchableOpacity 
                    style={styles.locationButton}
                    onPress={() => setShowLocationSelector(true)}
                  >
                    <Text style={styles.locationButtonText}>
                      {direccionPerdida || 'Seleccionar ubicación'}
                    </Text>
                    <FontAwesome5 name="map-marker-alt" size={20} color="#555" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.customLocationButton}
                    onPress={toggleCustomLocationMode}
                  >
                    <Text style={styles.customLocationText}>Usar ubicación personalizada</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Map mode
                <View style={styles.mapContainer}>
                  {loadingLocation ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.loadingText}>Cargando ubicación...</Text>
                    </View>
                  ) : (
                    <>
                      <MapView
                        style={styles.map}
                        region={ubicacionPerdida}
                        onRegionChangeComplete={(region) => setUbicacionPerdida(region)}
                      >
                        <Marker
                          coordinate={{
                            latitude: ubicacionPerdida.latitude,
                            longitude: ubicacionPerdida.longitude
                          }}
                          draggable
                          onDragEnd={handleMarkerDrag}
                          title="Última ubicación vista"
                          pinColor="red"
                        />
                      </MapView>
                      <View style={styles.addressContainer}>
                        <Text style={styles.addressText} numberOfLines={2}>
                          {direccionPerdida || 'Dirección no disponible'}
                        </Text>
                        <View style={styles.mapButtonsContainer}>
                          <TouchableOpacity 
                            style={styles.refreshButton}
                            onPress={refreshLocation}
                          >
                            <FontAwesome5 name="sync" size={16} color="#333" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.backToListButton}
                            onPress={toggleCustomLocationMode}
                          >
                            <Text style={styles.backToListText}>Volver a lista</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              )}

              <Text style={styles.modalLabel}>Método de contacto preferido</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={metodoContacto}
                  style={styles.modalPicker}
                  onValueChange={(itemValue) => setMetodoContacto(itemValue)}
                >
                  <Picker.Item label="Selecciona un método" value="" />
                  <Picker.Item label="WhatsApp" value="whatsapp" />
                  <Picker.Item label="Correo" value="correo" />
                  <Picker.Item label="Ambos" value="ambos" />
                </Picker>
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleSubmitMissingReport}
                >
                  <Text style={styles.modalButtonText}>Reportar como Desaparecida</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalCancelButton, {backgroundColor: '#000000'}]}
                  onPress={() => setShowMissingForm(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

        {/* Location Selector Modal */}
        <Modal
          visible={showLocationSelector}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowLocationSelector(false)}
        >
          <View style={styles.locationModalOverlay}>
            <View style={styles.locationModalContainer}>
              <Text style={styles.locationModalTitle}>Seleccionar Ubicación</Text>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar ubicación..."
                  value={locationSearchText}
                  onChangeText={filterLocations}
                />
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowLocationSelector(false)}
                >
                  <FontAwesome5 name="times" size={20} color="#333" />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={filteredLocations}
                keyExtractor={(item) => item.id}
                style={styles.locationList}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    style={styles.locationItem}
                    underlayColor="#f0f0f0"
                    onPress={() => selectLocation(item)}
                  >
                    <View>
                      <Text style={styles.locationName}>{item.name}</Text>
                      <Text style={styles.locationAddress}>{item.address}</Text>
                    </View>
                  </TouchableHighlight>
                )}
                ListEmptyComponent={
                  <Text style={styles.noLocationsText}>
                    No se encontraron ubicaciones. Intenta con otra búsqueda o usa la ubicación personalizada.
                  </Text>
                }
              />
              
              <TouchableOpacity
                style={styles.customLocationOptionButton}
                onPress={() => {
                  setShowLocationSelector(false);
                  toggleCustomLocationMode();
                }}
              >
                <FontAwesome5 name="map-marked-alt" size={20} color="#fff" style={styles.customLocationIcon} />
                <Text style={styles.customLocationOptionText}>Usar ubicación personalizada</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  verticalContainer: {
    marginTop: 10,
  },
  verticalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageVertical: {
    width: 125,
    height: 125,
    borderRadius: 10,
    marginRight: 15,
  },
  verticalTextContainer: {
    flex: 1,
  },
  verticalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  verticalDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: 'bold',
  },
  boldLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  genderIcon: {
    marginLeft: 8,
  },
  botonDesaparecido: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  botonEncontrado: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  botonAdoptada: {
    backgroundColor: '#000000ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  botonCancelarAdopcion: {
    backgroundColor: '#888888',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'column',
    marginTop: 10,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonEditar: {
    backgroundColor: '#000000ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  botonGuardar: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#777',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  petHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  nameAndGenderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petTypeLabel: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  noMascotasText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    margin: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalScrollContainer: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  modalInputMultiline: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    fontWeight: 'bold',
  },
  mapContainer: {
    width: '100%',
    height: 280,
    marginBottom: 15,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  map: {
    width: '100%',
    height: 240,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#f8f8f8',
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
  },
  modalButtonContainer: {
    marginTop: 20,
  },
  modalSubmitButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  modalPicker: {
    backgroundColor: '#fff',
    fontWeight: 'bold',
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ageInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    fontWeight: 'bold',
  },
  ageUnitPicker: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontWeight: 'bold',
  },
  customPickerButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
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
  },
  colorSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 10,
  },
  customPickerText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  colorOptionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    maxHeight: 150,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  colorOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  pickerWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  petDetailsContainer: {
    alignItems: 'center',
  },
  petDetailsImage: {
    width: "90%",
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  petDetailsInfo: {
    width: '100%',
    marginBottom: 20,
  },
  petDetailTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  petDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  genderIconInTitle: {
    marginLeft: 10,
  },
  petDetailItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  galleryContainer: {
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  editFormContainer: {
    width: '100%',
    marginBottom: 20,
  },
  petDetailsButtonContainer: {
    width: '100%',
    marginTop: 20,
  },
  modalEditButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalDeleteButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageButton: {
    backgroundColor: '#000000ff',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  previewImageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  deleteImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  asterisk: {
    color: 'red',
    fontWeight: 'bold',
  },
  datePickerButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  moneyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  moneyInput: {
    flex: 1,
    padding: 12,
    paddingLeft: 0, // Remove left padding since we have the currency symbol
    fontWeight: 'bold',
  },
  locationSelectorContainer: {
    marginBottom: 15,
  },
  locationButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
    fontWeight: 'bold',
  },
  customLocationButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  customLocationText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  locationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationModalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  locationList: {
    maxHeight: 300,
  },
  locationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: 'bold',
  },
  noLocationsText: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  customLocationOptionButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customLocationOptionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  customLocationIcon: {
    marginRight: 10,
  },
  mapButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToListButton: {
    marginLeft: 10,
    padding: 5,
  },
  backToListText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 5,
  },
  possibleMatchContainer: {
    width: '100%',
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  possibleMatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  possibleMatchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginLeft: 10,
  },
  matchCardContainer: {
    width: '100%',
  },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  matchImageAndScore: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  matchImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
  },
  matchScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  matchScoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  matchScoreLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: 'bold',
  },
  matchDetails: {
    padding: 15,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  matchComparisonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  comparisonColumn: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  comparisonItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  matchingItem: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  nonMatchingItem: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  matchFoundLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  viewMatchButton: {
    backgroundColor: '#FFA000',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewMatchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  matchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchModalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  matchModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  matchDetailsContainer: {
    alignItems: 'center',
  },
  matchDetailImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  matchDetailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  matchDetailInfoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  matchDetailItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  matchFoundInfo: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  matchContactInfo: {
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  matchModalButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactMatchButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  contactMatchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeMatchButton: {
    flex: 1,
    backgroundColor: '#9E9E9E',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeMatchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default MisMascotas;