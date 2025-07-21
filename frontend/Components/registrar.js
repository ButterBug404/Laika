import React, { useState, useEffect } from 'react';
import { 
  Text, 
  TextInput, 
  View, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  Switch,
  Dimensions,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { addMascota } from './MascotasData'; // Import the function to add new pets

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Registrar = () => {
  // Registration type state
  const [tipoRegistro, setTipoRegistro] = useState('presente');
  
  // Existing states
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [raza, setRaza] = useState('');
  const [especie, setEspecie] = useState('perro');
  const [color, setColor] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState({
    latitude: 19.4326,  // Default to Mexico City
    longitude: -99.1332,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenCara, setImagenCara] = useState(null);
  const [vacunado, setVacunado] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // Add missing pet specific fields
  const [ultimaVezVisto, setUltimaVezVisto] = useState('');
  const [recompensa, setRecompensa] = useState('');
  const [tieneRecompensa, setTieneRecompensa] = useState('no');
  const [montoRecompensa, setMontoRecompensa] = useState('');
  const [showPhotoInstructions, setShowPhotoInstructions] = useState(false);

  // Define breed lists for each species
  const razasPerro = [
    'Selecciona una raza',
    'Labrador Retriever', 
    'Pastor Alemán', 
    'Bulldog', 
    'Golden Retriever', 
    'Poodle', 
    'Chihuahua', 
    'Husky Siberiano', 
    'Boxer', 
    'Dálmata', 
    'Rottweiler',
    'Mestizo',
    'Otro/Desconocido'
  ];
  
  const razasGato = [
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
  
  const razasConejo = [
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
  
  const razasAve = [
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
  const colores = [
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
    // Show photo instructions modal first
    setShowPhotoInstructions(true);
  };

  const pickImageCara = async () => {
    // Direct image picker for face identification
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImagenCara(result.assets[0].uri);
    }
  };

  const proceedWithImagePicker = async () => {
    setShowPhotoInstructions(false);
    
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
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

  const handleSubmit = () => {
    // Validate form fields based on registration type
    if (tipoRegistro === 'perdida') {
      if (!nombre || !edad || !raza || !imagen || !imagenCara || !color || !tamaño || !ultimaVezVisto) {
        Alert.alert('Error', 'Por favor, completa todos los campos obligatorios y añade ambas imágenes');
        return;
      }
      
      // Validate reward amount if reward is selected
      if (tieneRecompensa === 'si' && (!montoRecompensa || parseInt(montoRecompensa) <= 0)) {
        Alert.alert('Error', 'Por favor, ingresa una cantidad válida para la recompensa');
        return;
      }
    } else if (tipoRegistro === 'presente') {
      if (!nombre || !edad || !raza || !imagen || !imagenCara || !color || !tamaño) {
        Alert.alert('Error', 'Por favor, completa todos los campos obligatorios y añade ambas imágenes');
        return;
      }
    } else if (tipoRegistro === 'encontrada') {
      if (!especie || !color || !tamaño || !imagen || !imagenCara) {
        Alert.alert('Error', 'Por favor, completa la información básica de la mascota encontrada y añade ambas imágenes');
        return;
      }
    } else { // adopcion
      if (!nombre || !edad || !raza || !imagen || !imagenCara || !color || !tamaño) {
        Alert.alert('Error', 'Por favor, completa todos los campos obligatorios para la adopción y añade ambas imágenes');
        return;
      }
    }

    if ((raza === 'Selecciona una raza' && tipoRegistro !== 'encontrada') || color === 'Selecciona un color') {
      Alert.alert('Error', 'Por favor, selecciona opciones válidas en los menús desplegables');
      return;
    }

    // Prepare reward text
    const recompensaText = tieneRecompensa === 'si' 
      ? `$${montoRecompensa} MXN` 
      : 'Sin recompensa';

    // Create the new pet object with consistent structure
    const newPet = {
      id: Date.now().toString(), // Generate a unique ID based on timestamp
      nombre: tipoRegistro === 'encontrada' ? `Mascota encontrada ${especie}` : nombre,
      edad: edad ? `${edad} años` : 'Desconocido',
      raza: tipoRegistro === 'encontrada' ? 'Desconocido' : raza,
      especie,
      color,
      tamaño,
      descripcion: descripcion || '',
      estado: tipoRegistro === 'perdida' ? 'Desaparecido' : 'Presente',
      imagen,
      imagenCara,
      vacunado: vacunado || false,
      contacto: contacto || 'Contactar através del perfil',
      fechaRegistro: new Date().toISOString(),
      tipoRegistro,
      ubicacion: {
        latitude: ubicacion.latitude,
        longitude: ubicacion.longitude,
        direccion
      },
      // Add missing pet specific fields if it's a lost pet
      ...(tipoRegistro === 'perdida' && {
        ultimaVezVisto: ultimaVezVisto || 'Recién reportada',
        ubicacionPerdida: direccion,
        recompensa: recompensaText
      }),
      // Add found pet specific fields
      ...(tipoRegistro === 'encontrada' && {
        ubicacionEncontrada: direccion,
        fechaEncontrada: new Date().toISOString()
      }),
      // Add adoption specific fields
      ...(tipoRegistro === 'adopcion' && {
        disponibleAdopcion: true,
        requisitosAdopcion: 'Contactar para más información'
      })
    };

    // Add the pet to the global pets list
    addMascota(newPet);

    Alert.alert('Éxito', `Registro de mascota ${tipoRegistro} realizado correctamente`);
    
    // Reset form
    setTipoRegistro('presente');
    setNombre('');
    setEdad('');
    setRaza('');
    setEspecie('perro');
    setImagen(null);
    setImagenCara(null);
    setVacunado(false);
    setColor('');
    setTamaño('');
    setDescripcion('');
    setContacto('');
    setUltimaVezVisto('');
    setRecompensa('');
    setTieneRecompensa('no');
    setMontoRecompensa('');
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
        <Text style={styles.label}>Tipo de Registro:</Text>
        <Picker
          selectedValue={tipoRegistro}
          style={styles.picker}
          onValueChange={(itemValue) => setTipoRegistro(itemValue)}
        >
          <Picker.Item label="Registrar Mascota Presente" value="presente" />
          <Picker.Item label="Perdí mi mascota" value="perdida" />
          <Picker.Item label="Encontré una mascota" value="encontrada" />
          <Picker.Item label="Ofrecer en adopción" value="adopcion" />
        </Picker>
        
        <Text style={styles.title}>{getTitleByType()}</Text>
        
        {/* Optional fields for encontrada */}
        {tipoRegistro !== 'encontrada' && (
          <TextInput
            style={styles.input}
            placeholder="Nombre de la mascota"
            value={nombre}
            onChangeText={setNombre}
          />
        )}
        
        {tipoRegistro !== 'encontrada' && (
          <TextInput
            style={styles.input}
            placeholder="Edad (solo números)"
            value={edad}
            onChangeText={handleEdadChange}
            keyboardType="numeric"
          />
        )}
        
        {/* Different UI hint based on registration type */}
        {tipoRegistro === 'presente' && (
          <Text style={styles.typeHint}>
            *Registra tus mascotas para mantener un registro de sus datos importantes.*
          </Text>
        )}
        
        {tipoRegistro === 'perdida' && (
          <Text style={styles.typeHint}>
            *Al registrar una mascota perdida, será visible para que otros usuarios puedan ayudarte a encontrarla.*
          </Text>
        )}

        <View style={styles.imageContainer}>
          <Text style={styles.label}>Predicción por IA:</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <View style={styles.buttonContent}>
              <Text style={styles.imageButtonText}>Predecir con IA </Text>
              <Ionicons name="sparkles-outline" size={20} color="white" />
            </View>
          </TouchableOpacity>
          {imagen && <Image source={{ uri: imagen }} style={styles.previewImage} />}
          <Text style={styles.aiHint}>
            *Sube una foto y nuestra IA predecirá automáticamente la raza, especie y características de tu mascota*
          </Text>
        </View>
        
        <Text style={styles.label}>Especie:</Text>
        <Picker
          selectedValue={especie}
          style={styles.picker}
          onValueChange={(itemValue) => setEspecie(itemValue)}
        >
          <Picker.Item label="Perro" value="perro" />
          <Picker.Item label="Gato" value="gato" />
          <Picker.Item label="Conejo" value="conejo" />
          <Picker.Item label="Ave" value="ave" />
        </Picker>
        
        {tipoRegistro !== 'encontrada' && (
          <>
            <Text style={styles.label}>Raza:</Text>
            <Picker
              selectedValue={raza}
              style={styles.picker}
              onValueChange={(itemValue) => setRaza(itemValue)}
            >
              {getRazasList().map((razaOption, index) => (
                <Picker.Item key={index} label={razaOption} value={razaOption} />
              ))}
            </Picker>
          </>
        )}
        
        <Text style={styles.label}>Color:</Text>
        <TouchableOpacity
          style={styles.customPickerButton}
          onPress={() => setShowColorPicker(!showColorPicker)}
        >
          <View style={styles.colorPreview}>
            {color && color !== 'Selecciona un color' && (
              <View style={[styles.colorSquare, { backgroundColor: colores.find(c => c.value === color)?.color || '#transparent' }]} />
            )}
            <Text style={styles.customPickerText}>
              {color || 'Selecciona un color'}
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
                <View style={[
                  styles.colorSquare, 
                  { 
                    backgroundColor: colorOption.color,
                    borderColor: colorOption.color === '#FFFFFF' ? '#ccc' : 'transparent'
                  }
                ]} />
                <Text style={styles.colorOptionText}>{colorOption.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
        <Text style={styles.label}>Tamaño:</Text>
        <Picker
          selectedValue={tamaño}
          style={styles.picker}
          onValueChange={(itemValue) => setTamaño(itemValue)}
        >
          <Picker.Item label="Selecciona un tamaño" value="" />
          <Picker.Item label="Pequeño" value="pequeño" />
          <Picker.Item label="Mediano" value="mediano" />
          <Picker.Item label="Grande" value="grande" />
        </Picker>
        
        {/* Show additional fields for lost pets */}
        {tipoRegistro === 'perdida' && (
          <>
            <Text style={styles.label}>¿Cuándo fue la última vez que viste a tu mascota?*</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Hace 2 días, Esta mañana, etc."
              value={ultimaVezVisto}
              onChangeText={setUltimaVezVisto}
            />

            <Text style={styles.label}>¿Tendrá recompensa?</Text>
            <Picker
              selectedValue={tieneRecompensa}
              style={styles.picker}
              onValueChange={(itemValue) => setTieneRecompensa(itemValue)}
            >
              <Picker.Item label="No" value="no" />
              <Picker.Item label="Sí" value="si" />
            </Picker>

            {tieneRecompensa === 'si' && (
              <>
                <Text style={styles.label}>Cantidad de recompensa (solo números)*</Text>
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
{/* Show vaccination option for present pets and adoption */}
        {(tipoRegistro === 'presente' || tipoRegistro === 'adopcion') && (
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>¿Está vacunado?</Text>
            <Switch
              value={vacunado}
              onValueChange={setVacunado}
              trackColor={{ false: "#767577", true: "#b04f4f" }}
              thumbColor={vacunado ? "#f6d3c3" : "#f4f3f4"}
            />
          </View>
        )}
        <TextInput
          style={styles.inputMultiline}
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
        />
        
        {/* Map Location Selector */}
        {(tipoRegistro === 'perdida' || tipoRegistro === 'encontrada') && (
          <>
            <Text style={styles.label}>Ubicación:</Text>
            <View style={styles.mapContainer}>
              {loadingLocation ? (
                <Text style={styles.loadingText}>Cargando ubicación...</Text>
              ) : (
                <>
                  <MapView
                    style={styles.map}
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
          {imagenCara && <Image source={{ uri: imagenCara }} style={styles.previewImage} />}
          <Text style={styles.aiHint}>
            *Esta imagen se usará para identificar a tu mascota mediante reconocimiento facial*
          </Text>
        </View>
        
        
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Registrar</Text>
        </TouchableOpacity>
      </ScrollView>

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
              source={{ uri: 'https://placehold.co/200x200.png' }}
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
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
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
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
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#b04f4f',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  inputMultiline: {
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
  typeHint: {
    fontSize: 14,
    color: 'red',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
    paddingHorizontal: 10,
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
    flex: 1,
  },
  customPickerText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  colorOptionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
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
  },
  aiHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default Registrar;