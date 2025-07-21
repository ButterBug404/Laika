import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Import shared data
import { getMascotas, updateMascotaEstado, updateMascotaData } from './MascotasData';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
  
  // Missing pet form states
  const [ultimaVezVisto, setUltimaVezVisto] = useState('');
  const [descripcionPerdida, setDescripcionPerdida] = useState('');
  const [contacto, setContacto] = useState('');
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
      setMascotas(getMascotas());
    }

    // If a specific pet was selected from Cuenta.js, scroll to it
    if (route.params && route.params.perroId) {
      // Implement scroll to specific pet if needed
    }
  }, [route.params, isFocused]);

  // Get current location when missing form opens
  useEffect(() => {
    if (showMissingForm) {
      getCurrentLocation();
    }
  }, [showMissingForm]);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
      return;
    }

    setLoadingLocation(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      setUbicacionPerdida({
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
        setDireccionPerdida(addressText);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
    } finally {
      setLoadingLocation(false);
    }
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
    setDescripcionPerdida('');
    setContacto('');
    setRecompensa('');
    setTieneRecompensa('no');
    setMontoRecompensa('');
    setDireccionPerdida('');
  };

  // Validate numeric input for reward amount
  const handleMontoRecompensaChange = (text) => {
    // Only allow digits
    const numericValue = text.replace(/[^0-9]/g, '');
    setMontoRecompensa(numericValue);
  };

  const handleSubmitMissingReport = () => {
    // Validate required fields
    if (!ultimaVezVisto || !descripcionPerdida) {
      Alert.alert('Error', 'Por favor, completa los campos obligatorios (última vez visto y descripción)');
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
      descripcion: descripcionPerdida,
      contacto: contacto || 'Contactar através del perfil',
      recompensa: recompensaText,
      ubicacionPerdida: direccionPerdida,
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
    // Initialize edit data in case user wants to edit
    setEditData({
      nombre: mascota.nombre,
      edad: mascota.edad,
      raza: mascota.raza,
      color: mascota.color || '',
      tamaño: mascota.tamaño || '',
      descripcion: mascota.descripcion || ''
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

    // Update mascota data
    const updatedMascotas = updateMascotaData(selectedPetDetails.id, editData);
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

  const getPetTypeLabel = (pet) => {
    if (pet.tipoRegistro === 'adopcion') {
      return pet.estado === 'Adoptada' ? 'Adoptada' : 'En adopción';
    }
    if (pet.tipoRegistro === 'encontrada') return 'Encontrada';
    return pet.estado;
  };

  const getPetTypeColor = (pet) => {
    if (pet.tipoRegistro === 'adopcion') {
      return pet.estado === 'Adoptada' ? '#888888' : '#4682B4'; // Gray for adopted, Steel Blue for adoption
    }
    if (pet.tipoRegistro === 'encontrada') return '#9370DB'; // Medium Purple
    return pet.estado === 'Presente' ? '#32CD32' : '#FF6347';
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
                  <Image style={styles.imageVertical} source={{ uri: mascota.imagen }} />
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
                          <Text style={styles.verticalName}>{mascota.nombre}</Text>
                          <Text style={[
                            styles.petTypeLabel, 
                            { backgroundColor: getPetTypeColor(mascota) }
                          ]}>
                            {getPetTypeLabel(mascota)}
                          </Text>
                        </View>
                        
                        <Text style={styles.verticalDetail}>Edad: {mascota.edad}</Text>
                        <Text style={styles.verticalDetail}>Raza: {mascota.raza}</Text>

                        
                        {/* Show buttons for user's own pets and found pets */}
                        <View style={styles.buttonRow}>
                          <TouchableOpacity
                            style={styles.botonEditar}
                            onPress={() => handleShowPetDetails(mascota)}
                          >
                            <Text style={styles.botonTexto}>Mas Info.</Text>
                          </TouchableOpacity>
                          
                          {mascota.tipoRegistro !== 'encontrada' && (
                            <>
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
                    source={{ uri: selectedPetDetails.imagen }} 
                  />
                  
                  {isEditingInModal ? (
                    // Edit mode in modal
                    <View style={styles.editFormContainer}>
                      <TextInput
                        style={styles.modalInput}
                        value={editData.nombre}
                        onChangeText={(text) => handleEditChange('nombre', text)}
                        placeholder="Nombre"
                      />
                      <TextInput
                        style={styles.modalInput}
                        value={editData.edad}
                        onChangeText={(text) => handleEditChange('edad', text)}
                        placeholder="Edad"
                      />
                      <TextInput
                        style={styles.modalInput}
                        value={editData.raza}
                        onChangeText={(text) => handleEditChange('raza', text)}
                        placeholder="Raza"
                      />
                      <TextInput
                        style={styles.modalInput}
                        value={editData.color}
                        onChangeText={(text) => handleEditChange('color', text)}
                        placeholder="Color"
                      />
                      <TextInput
                        style={styles.modalInput}
                        value={editData.tamaño}
                        onChangeText={(text) => handleEditChange('tamaño', text)}
                        placeholder="Tamaño"
                      />
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
                      <Text style={styles.petDetailTitle}>{selectedPetDetails.nombre}</Text>
                      <Text style={styles.petDetailItem}>Edad: {selectedPetDetails.edad}</Text>
                      <Text style={styles.petDetailItem}>Raza: {selectedPetDetails.raza}</Text>
                      <Text style={styles.petDetailItem}>Color: {selectedPetDetails.color || 'No especificado'}</Text>
                      <Text style={styles.petDetailItem}>Tamaño: {selectedPetDetails.tamaño || 'No especificado'}</Text>
                      <Text style={styles.petDetailItem}>Estado: {selectedPetDetails.estado}</Text>
                      <Text style={styles.petDetailItem}>Tipo: {getPetTypeLabel(selectedPetDetails)}</Text>
                      
                      {selectedPetDetails.descripcion && (
                        <Text style={styles.petDetailItem}>Descripción: {selectedPetDetails.descripcion}</Text>
                      )}
                      
                      {/* Show missing pet details if available */}
                      {selectedPetDetails.ultimaVezVisto && (
                        <>
                          <Text style={styles.petDetailItem}>Última vez visto: {selectedPetDetails.ultimaVezVisto}</Text>
                          <Text style={styles.petDetailItem}>Recompensa: {selectedPetDetails.recompensa}</Text>
                          <Text style={styles.petDetailItem}>Contacto: {selectedPetDetails.contacto}</Text>
                          <Text style={styles.petDetailItem}>Ubicación perdida: {selectedPetDetails.ubicacionPerdida}</Text>
                        </>
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
              
              <Text style={styles.modalLabel}>¿Cuándo fue la última vez que viste a tu mascota?*</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ej: Hace 2 días, Esta mañana, etc."
                value={ultimaVezVisto}
                onChangeText={setUltimaVezVisto}
              />

              <Text style={styles.modalLabel}>Descripción de la desaparición*</Text>
              <TextInput
                style={styles.modalInputMultiline}
                placeholder="Describe las circunstancias de la desaparición, características distintivas, etc."
                value={descripcionPerdida}
                onChangeText={setDescripcionPerdida}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.modalLabel}>Información de contacto (opcional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Teléfono, email adicional, etc."
                value={contacto}
                onChangeText={setContacto}
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
                  <Text style={styles.modalLabel}>Cantidad de recompensa (solo números)*</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ej: 500, 1000, etc."
                    value={montoRecompensa}
                    onChangeText={handleMontoRecompensaChange}
                    keyboardType="numeric"
                  />
                </>
              )}

              <Text style={styles.modalLabel}>Ubicación donde se perdió</Text>
              <View style={styles.mapContainer}>
                {loadingLocation ? (
                  <Text style={styles.loadingText}>Cargando ubicación...</Text>
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
                      />
                    </MapView>
                    <Text style={styles.addressText}>{direccionPerdida}</Text>
                  </>
                )}
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleSubmitMissingReport}
                >
                  <Text style={styles.modalButtonText}>Reportar como Desaparecida</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowMissingForm(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
    backgroundColor: '#4682B4',
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
  },
  loadingText: {
    padding: 20,
    textAlign: 'center',
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
    backgroundColor: '#777',
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
  petDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  petDetailItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 10,
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
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalDeleteButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
});

export default MisMascotas;