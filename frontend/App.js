import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import {
  ImageBackground,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated, 
} from 'react-native';
import { Image } from 'expo-image';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'; // Add this import for image picking
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';

// Archivos de componentes
import Inicio from './Components/Home';
import Registrar from './Components/registrar';
import Mascotas from './Components/mis_mascotas';
import Adoptar from './Components/adoptar';
import Cuenta from './Components/cuenta';

// Estilos
import styles from './Components/Estilos/Estilos.js';

import AnuncioDetalle from './Components/Anuncios/AnuncioDetalle.js';
import Lista_Anuncios from './Components/Anuncios/Lista.js';
import { UserProvider } from './Components/UserContext';
import Creditos from './Components/Creditos';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={Inicio}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Lista"
      component={Lista_Anuncios}
      options={{
        title: 'Lista de Anuncios',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      }}
    />
    <Stack.Screen
      name="AnuncioDetalle"
      component={AnuncioDetalle}
      options={({ route }) => ({
        title: route.params?.titulo || 'Detalle del Anuncio',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      })}
    />
    <Stack.Screen
      name="Creditos"
      component={Creditos}
      options={{
        title: 'Créditos',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      }}
    />
  </Stack.Navigator>
);

const HomeScreen = () => <Inicio />;
const MascotasScreen = () => <Mascotas />;
const RegistrarScreen = () => <Registrar />;
const AdoptaScreen = () => <Adoptar />;
const PerfilScreen = () => (
  <Cuenta />
);

const LoginScreen = () => {
  const { loginUser } = useUser();
  // Multiple animation values for different elements
  const fadeAnim = useRef(new Animated.Value(0)).current; // For overall app
  const slideAnim = useRef(new Animated.Value(-50)).current; // For slide-in effect (from left)
  const titleAnim = useRef(new Animated.Value(-30)).current; // For title elements
  const formAnim = useRef(new Animated.Value(-20)).current; // For form elements
  
  const [locations, setLocations] = useState({ estados: [] });
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('Selecciona Municipio');
  const [isSignUp, setIsSignUp] = useState(false);
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null); // Add state for storing the selected image

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ButterBug404/ejemplo_de_un_json/refs/heads/main/lugares.json');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        Alert.alert("Error", "No se pudieron cargar las ubicaciones.");
      }
    };
    fetchLocations();
  }, []);

  // Set up the animations when the component mounts
  useEffect(() => {
    // Sequence the animations
    Animated.stagger(150, [
      // Overall fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Logo slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      // Title slide in
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Form elements slide in
      Animated.timing(formAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z]).{6,}$/;
    return passwordPattern.test(password);
  };

  // Function to get municipalities based on selected state
  const getMunicipiosByEstado = (estado) => {
    if (!locations.estados || locations.estados.length === 0) {
      return ['Selecciona Municipio'];
    }
    const estadoData = locations.estados.find(e => e.nombre === estado);
    return estadoData ? ['Selecciona Municipio', ...estadoData.municipios] : ['Selecciona Municipio'];
  };

  // Add function to pick an image from gallery
  const pickImage = async () => {
    // Ask for permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos');
      return;
    }
    
    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Add new function to remove the selected image
  const removeImage = () => {
    setImage(null);
    Alert.alert("Foto eliminada", "La foto de perfil ha sido eliminada");
  };

  const handleRegister = () => {
    if (
      !correo ||
      !password ||
      !nombre ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !telefono ||
      selectedEstado === 'Selecciona Estado' ||
      selectedMunicipio === 'Selecciona Municipio' ||
      !selectedEstado ||
      !selectedMunicipio
    ) {
      Alert.alert(
        'Error',
        'Por favor, completa todos los campos correctamente.'
      );
    } else if (!validatePassword(password)) {
      setPasswordError(
        'La contraseña debe tener al menos 6 caracteres y una mayúscula.'
      );
    } else if (password !== confirmPassword) {
      setPasswordError('La contraseña no coincide.');
    } else {
      Alert.alert('Registro exitoso', 'Se ha registrado exitosamente.');
      setIsSignUp(false); // Volver a la pantalla de inicio de sesión
      setCorreo('');
      setPassword('');
      setConfirmPassword('');
      setNombre('');
      setApellidoPaterno('');
      setApellidoMaterno('');
      setTelefono('');
      setSelectedEstado('Selecciona Estado');
      setSelectedMunicipio('Selecciona Municipio');
      setPasswordError('');
      setImage(null); // Clear the selected image
    }
  };

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert(
        'Error',
        'Por favor, completa todos los campos correctamente.'
      );
    } else if (!validatePassword(password)) {
      setPasswordError(
        'La contraseña debe tener al menos 6 caracteres y una mayúscula.'
      );
    } else {
      const success = loginUser(correo, password);
      if (!success) {
        Alert.alert('Error', 'Correo o contraseña incorrectos.');
        setPasswordError('Correo o contraseña incorrectos.');
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.containerApp}>
        <ImageBackground
          source={require('./assets/background.jpg')}
          style={styles.card}
          resizeMode="cover"
          imageStyle={styles.backgroundImage}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}>
            <ScrollView
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}>
              {/* Animated GIF */}
              <Animated.View style={{
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
              }}>
                <Image
                  source={require('./assets/Login.gif')}
                  style={[
                    styles.logoApp,
                    { 
                      width: 300,
                      height: 300,
                    }
                  ]}
                  contentFit="contain"
                />
              </Animated.View>
              
              <View style={[styles.formContainer, { paddingBottom: 120 }]}>
                {/* Animated Title Text */}
                <Animated.View style={{
                  opacity: fadeAnim,
                  transform: [{ translateX: titleAnim }]
                }}>
                  <Text style={styles.title}>Laika</Text>
                  <Text style={styles.subtitle2}>
                    Buscaremos a tu mascota en todo el universo.
                  </Text>
                  <Text style={styles.subtitle}>
                    {isSignUp
                      ? 'Regístrate para buscar a tu peludito.'
                      : 'Inicia sesión para continuar.'}
                  </Text>
                </Animated.View>

                {/* Animated Form Elements */}
                <Animated.View style={{
                  opacity: fadeAnim,
                  transform: [{ translateX: formAnim }],
                  width: '100%'
                }}>
                  {isSignUp && (
                    <>
                      {/* Image Picker UI */}
                      <View style={{ alignItems: 'center', marginVertical: 15 }}>
                        <TouchableOpacity onPress={pickImage}>
                          {image ? (
                            <Image
                              source={{ uri: image }}
                              style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                marginBottom: 10,
                                borderWidth: 2,
                                borderColor: '#b04f4f',
                              }}
                            />
                          ) : (
                            <View
                              style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                backgroundColor: '#f0f0f0',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 10,
                                borderWidth: 2,
                                borderColor: '#b04f4f',
                              }}
                            >
                              <Ionicons name="camera" size={40} color="#b04f4f" />
                            </View>
                          )}
                        </TouchableOpacity>
                        
                        {/* Modified this section to include delete option */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <TouchableOpacity onPress={pickImage}>
                            <Text style={{ color: '#b04f4f', fontWeight: 'bold', marginRight: image ? 10 : 0 }}>
                              {image ? 'Cambiar foto' : 'Añadir foto de perfil'}
                            </Text>
                          </TouchableOpacity>
                          
                          {image && (
                            <TouchableOpacity 
                              onPress={removeImage}
                              style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                backgroundColor: '#ffebeb',
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                borderRadius: 15,
                                marginLeft: 5
                              }}
                            >
                              <Ionicons name="trash-outline" size={16} color="#b04f4f" style={{ marginRight: 5 }} />
                              <Text style={{ color: '#b04f4f', fontWeight: 'bold' }}>
                                Eliminar
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      
                      <TextInput
                        placeholder="Nombre"
                        style={styles.input}
                        placeholderTextColor="#888888"
                        value={nombre}
                        onChangeText={(text) => setNombre(text)}
                        autoCapitalize="words"
                      />
                      <TextInput
                        placeholder="Apellido Paterno"
                        style={styles.input}
                        placeholderTextColor="#888888"
                        value={apellidoPaterno}
                        onChangeText={(text) => setApellidoPaterno(text)}
                        autoCapitalize="words"
                      />
                      <TextInput
                        placeholder="Apellido Materno"
                        style={styles.input}
                        placeholderTextColor="#888888"
                        value={apellidoMaterno}
                        onChangeText={(text) => setApellidoMaterno(text)}
                        autoCapitalize="words"
                      />
                      <TextInput
                        placeholder="Correo electrónico"
                        style={styles.input}
                        placeholderTextColor="#888888"
                        value={correo}
                        onChangeText={(text) => setCorreo(text)}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                      <TextInput
                        placeholder="Teléfono"
                        keyboardType="phone-pad"
                        style={styles.input}
                        placeholderTextColor="#888888"
                        value={telefono}
                        onChangeText={(text) => setTelefono(text)}
                      />
                      <Picker
                        selectedValue={selectedEstado}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                          setSelectedEstado(itemValue);
                          setSelectedMunicipio('Selecciona Municipio'); // Reset municipality when state changes
                        }}>
                        <Picker.Item label="Selecciona Estado" value="" />
                        {locations.estados.map((estado, index) => (
                          <Picker.Item
                            key={index}
                            label={estado.nombre}
                            value={estado.nombre}
                          />
                        ))}
                      </Picker>
                      {selectedEstado && selectedEstado !== 'Selecciona Estado' && (
                        <Picker
                          selectedValue={selectedMunicipio}
                          style={styles.picker}
                          onValueChange={(itemValue) =>
                            setSelectedMunicipio(itemValue)
                          }>
                          {getMunicipiosByEstado(selectedEstado).map((municipio, index) => (
                            <Picker.Item
                              key={index}
                              label={municipio}
                              value={municipio}
                            />
                          ))}
                        </Picker>
                      )}
                    </>
                  )}
                  {!isSignUp && (
                    <TextInput
                      placeholder="Correo electrónico"
                      style={styles.input}
                      placeholderTextColor="#888888"
                      value={correo}
                      onChangeText={(text) => setCorreo(text)}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  )}
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Contraseña"
                      secureTextEntry={!showPassword} // Mostrar u ocultar contraseña
                      style={styles.inputPassword}
                      placeholderTextColor="#888888"
                      value={password}
                      autoCapitalize="none"
                      onChangeText={(text) => {
                        setPassword(text);
                        if (confirmPassword && text !== confirmPassword) {
                          setPasswordError('La contraseña no coincide');
                        } else {
                          setPasswordError('');
                        }
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.iconContainer}>
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#000000"
                      />
                    </TouchableOpacity>
                  </View>
                  {isSignUp && (
                    <View style={styles.passwordContainer}>
                      <TextInput
                        placeholder="Confirmar contraseña"
                        secureTextEntry={!showPassword} // Mostrar u ocultar contraseña
                        style={styles.inputPassword}
                        placeholderTextColor="#888888"
                        value={confirmPassword}
                        autoCapitalize="none"
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          if (password && text !== password) {
                            setPasswordError('La contraseña no coincide');
                          } else {
                            setPasswordError('');
                          }
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.iconContainer}>
                        <Ionicons
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={24}
                          color="#000000"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                  {isSignUp && (
                    <Text style={styles.passwordHint}>
                      La contraseña debe tener al menos 6 caracteres y una
                      mayúscula.
                    </Text>
                  )}

                  <TouchableOpacity
                    style={styles.button}
                    onPress={isSignUp ? handleRegister : handleLogin}
                    disabled={
                      isSignUp &&
                      (password !== confirmPassword ||
                        !password ||
                        !confirmPassword)
                    }>
                    <Text style={styles.buttonText}>
                      {isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                    <Text style={styles.toggleText}>
                      {isSignUp
                        ? '¿Ya tienes cuenta? Inicia sesión'
                        : '¿No tienes cuenta? Regístrate'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const AppContent = () => {
  const { isLoggedIn } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoggedIn]);

  console.log("Estado de autenticación:", isLoggedIn); // Añadir este log para depuración

  if (!isConnected) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6d3c3' }}>
          <Ionicons name="wifi-outline" size={80} color="#b04f4f" />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#b04f4f', marginTop: 20, textAlign: 'center' }}>
            Sin conexión a Internet
          </Text>
          <Text style={{ fontSize: 16, color: '#b04f4f', marginTop: 10, textAlign: 'center', paddingHorizontal: 20 }}>
            Por favor, conéctate a una red para continuar usando Laika.
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!isLoggedIn) {
 // Añadir este log para depuración
    return <LoginScreen />;
  }


  
  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              switch (route.name) {
                case 'Inicio':
                  iconName = focused ? 'home-sharp' : 'home-outline';
                  break;
                case 'Mascotas':
                  iconName = focused ? 'paw-sharp' : 'paw-outline';
                  break;
                case 'Registrar':
                  iconName = focused ? 'add-circle-sharp' : 'add-circle-sharp';
                  break;
                case 'Adopción':
                  iconName = focused ? 'heart-sharp' : 'heart-outline';
                  break;
                case 'Configurar':
                  iconName = focused ? 'settings-sharp' : 'settings-outline';
                  break;
                default:
                  iconName = focused
                    ? 'help-circle-sharp'
                    : 'help-circle-outline';
                  break;
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },

            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#777',
            headerTitle: 'Laika', // Cambia el título del header a "Laika"
            headerTitleAlign: 'center', // Centra el título
            headerStyle: { backgroundColor: '#E07978' },
            headerTintColor: '#ffffffff',
          })}>
          
          <Tab.Screen name="Inicio" component={HomeStack} />
          <Tab.Screen name="Mascotas" component={MascotasScreen} />
          <Tab.Screen name="Registrar" component={RegistrarScreen} />
          <Tab.Screen name="Adopción" component={AdoptaScreen} />
          <Tab.Screen name="Configurar" component={PerfilScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Animated.View>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;

{ 
  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert(
        'Error',
        'Por favor, completa todos los campos correctamente.'
      );
    } else if (!validatePassword(password)) {
      setPasswordError(
        'La contraseña debe tener al menos 6 caracteres y una mayúscula.'
      );
    } else {
      console.log('LOG: do it');
      const res = await fetch(Constants.expoConfig.extra.API_URL + '/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: correo, password: password}),
      });
      const data = await res.json();
      console.log('LOG: ', data);
      if (data.success) {
        setIsLoggedIn(true);
        setPasswordError('');
      }
    }
  };
}
  if (!isLoggedIn) {
    return (
      <UserProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.containerApp}>
            <ImageBackground
              source={require('./assets/background.jpg')}
              style={styles.card}
              resizeMode="cover"
              imageStyle={styles.backgroundImage}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}>
                <ScrollView
                  contentContainerStyle={styles.scrollContentContainer}
                  showsVerticalScrollIndicator={false}>
                  <Image
                    source={require('./assets/Login.gif')}
                    style={styles.logoApp}
                  />
                  <View style={[styles.formContainer, { flex: 1 }]}>
                    <Text style={styles.title}>Laika</Text>

                    <Text style={styles.subtitle2}>
                      Buscaremos a tu peludito en todo el universo.
                    </Text>
                    <Text style={styles.subtitle}>
                      {isSignUp
                        ? 'Regístrate para buscar a tu peludito.'
                        : 'Inicia sesión para continuar.'}
                    </Text>
                    {isSignUp && (
                      <>
                        <TextInput
                          placeholder="Nombre"
                          style={styles.input}
                          placeholderTextColor="#888888"
                          value={nombre}
                          onChangeText={(text) => setNombre(text)}
                        />
                        <TextInput
                          placeholder="Apellido Paterno"
                          style={styles.input}
                          placeholderTextColor="#888888"
                          value={apellidoPaterno}
                          onChangeText={(text) => setApellidoPaterno(text)}
                        />
                        <TextInput
                          placeholder="Apellido Materno"
                          style={styles.input}
                          placeholderTextColor="#888888"
                          value={apellidoMaterno}
                          onChangeText={(text) => setApellidoMaterno(text)}
                        />
                        <TextInput
                          placeholder="Correo electrónico"
                          style={styles.input}
                          placeholderTextColor="#888888"
                          value={correo}
                          onChangeText={(text) => setCorreo(text)}
                        />
                        <TextInput
                          placeholder="Teléfono"
                          keyboardType="phone-pad"
                          style={styles.input}
                          placeholderTextColor="#888888"
                          value={telefono}
                          onChangeText={(text) => setTelefono(text)}
                        />
                        <Picker
                          selectedValue={selectedEstado}
                          style={styles.picker}
                          onValueChange={(itemValue) => {
                            setSelectedEstado(itemValue);
                            setSelectedMunicipio('Selecciona Municipio'); // Reset municipality when state changes
                          }}>
                          {estados.map((estado, index) => (
                            <Picker.Item
                              key={index}
                              label={estado}
                              value={estado}
                            />
                          ))}
                        </Picker>
                        {selectedEstado && selectedEstado !== 'Selecciona Estado' && (
                          <Picker
                            selectedValue={selectedMunicipio}
                            style={styles.picker}
                            onValueChange={(itemValue) =>
                              setSelectedMunicipio(itemValue)
                            }>
                            {getMunicipiosByEstado(selectedEstado).map((municipio, index) => (
                              <Picker.Item
                                key={index}
                                label={municipio}
                                value={municipio}
                              />
                            ))}
                          </Picker>
                        )}
                      </>
                    )}
                    {!isSignUp && (
                      <TextInput
                        placeholder="Correo electrónico"
                        style={styles.input}
                        placeholderTextColor="#888888"
                        value={correo}
                        onChangeText={(text) => setCorreo(text)}
                      />
                    )}
                    <View style={styles.passwordContainer}>
                      <TextInput
                        placeholder="Contraseña"
                        secureTextEntry={!showPassword} // Mostrar u ocultar contraseña
                        style={styles.inputPassword}
                        placeholderTextColor="#888888"
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          if (confirmPassword && text !== confirmPassword) {
                            setPasswordError('La contraseña no coincide');
                          } else {
                            setPasswordError('');
                          }
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.iconContainer}>
                        <Ionicons
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={24}
                          color="#000000"
                        />
                      </TouchableOpacity>
                    </View>
                    {isSignUp && (
                      <View style={styles.passwordContainer}>
                        <TextInput
                          placeholder="Confirmar contraseña"
                          secureTextEntry={!showPassword} // Mostrar u ocultar contraseña
                          style={styles.inputPassword}
                          placeholderTextColor="#888888"
                          value={confirmPassword}
                          onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (password && text !== password) {
                              setPasswordError('La contraseña no coincide');
                            } else {
                              setPasswordError('');
                            }
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.iconContainer}>
                          <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={24}
                            color="#000000"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    {passwordError ? (
                      <Text style={styles.errorText}>{passwordError}</Text>
                    ) : null}
                    {isSignUp && (
                      <Text style={styles.passwordHint}>
                        La contraseña debe tener al menos 6 caracteres y una
                        mayúscula.
                      </Text>
                    )}

                    <TouchableOpacity
                      style={styles.button}
                      onPress={isSignUp ? handleRegister : handleLogin}
                      disabled={
                        isSignUp &&
                        (password !== confirmPassword ||
                          !password ||
                          !confirmPassword)
                      }>
                      <Text style={styles.buttonText}>
                        {isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                      <Text style={styles.toggleText}>
                        {isSignUp
                          ? '¿Ya tienes cuenta? Inicia sesión'
                          : '¿No tienes cuenta? Regístrate'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </ImageBackground>
          </SafeAreaView>
        </SafeAreaProvider>
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              switch (route.name) {
                case 'Inicio':
                  iconName = focused ? 'home-sharp' : 'home-outline';
                  break;
                case 'Mascotas':
                  iconName = focused ? 'paw-sharp' : 'paw-outline';
                  break;
                case 'Registrar':
                  iconName = focused ? 'add-circle-sharp' : 'add-circle-sharp';
                  break;
                case 'Adopción':
                  iconName = focused ? 'heart-sharp' : 'heart-outline';
                  break;
                case 'Perfil':
                  iconName = focused ? 'person-sharp' : 'person-outline';
                  break;
                default:
                  iconName = focused
                    ? 'help-circle-sharp'
                    : 'help-circle-outline';
                  break;
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },

            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#777',
            headerTitle: 'Laika', // Cambia el título del header a "Laika"
            headerTitleAlign: 'center', // Centra el título
            headerStyle: { backgroundColor: '#E07978' },
            headerTintColor: '#ffffffff',
          })}>
          
          <Tab.Screen name="Inicio" component={HomeStack} />
          <Tab.Screen name="Mascotas" component={MascotasScreen} />
          <Tab.Screen name="Registrar" component={RegistrarScreen} />
          <Tab.Screen name="Adopción" component={AdoptaScreen} />
          <Tab.Screen name="Perfil">
            {() => <PerfilScreen setIsLoggedIn={setIsLoggedIn} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
