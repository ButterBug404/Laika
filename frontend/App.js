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
  PermissionsAndroid,
  Linking
} from 'react-native';
import { Image } from 'expo-image';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';

import { 
	startSocket, 
	stopSocket, 
	getSocket, 
	sendMessage 
} from './utils/BackgroundSocketService.js';

// Archivos de componentes
import Inicio from './Components/Home';
import Registrar from './Components/registrar.js';
import Mascotas from './Components/mis_mascotas.js';
import Adoptar from './Components/adoptar.js';
import Cuenta from './Components/cuenta.js';
import UserContext, { useUser } from './Components/UserContext';
import MissingPetAlertModal from './Components/MissingPetAlertModal.js';
import { registerForPushNotificationsAsync } from './utils/pushNotifications.js';

// Estilos
import styles from './Components/Estilos/Estilos.js';

import AnuncioDetalle from './Components/Anuncios/AnuncioDetalle.js';
import Lista_Anuncios from './Components/Anuncios/Lista.js';
import { UserProvider } from './Components/UserContext'; //DATOS USUARIO
import Creditos from './Components/Creditos'; //CREDITOS DE LOS DESARROLLADORES Y MAS
import Registro from './Components/SignUp.js'; // REGISTRAR CUENTA

//Utils
import store from './utils/store';

//Env variables
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

console.log(apiUrl);

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
  const { loginUser, setIsLoggedIn } = useUser();
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
  const [image, setImage] = useState(null);

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

  const getMunicipiosByEstado = (estado) => {
    if (!locations.estados || locations.estados.length === 0) {
      return ['Selecciona Municipio'];
    }
    const estadoData = locations.estados.find(e => e.nombre === estado);
    return estadoData ? ['Selecciona Municipio', ...estadoData.municipios] : ['Selecciona Municipio'];
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos');
      return;
    }
    
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
      setImage(null);
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
			try{
				const token = await loginUser(correo, password);

				if (!token) {
					Alert.alert('Error', 'Correo o contraseña incorrectos.');
					setPasswordError('Correo o contraseña incorrectos.');
				}else{
					setIsLoggedIn(true);
					store.save('jwt', token);
				}
			}catch(error){
				console.error('Login error:', error);
				Alert.alert('Error', error.msg || error.message || 'Unknown error');
				setPasswordError('Correo o contraseña incorrectos');
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
		{isSignUp ? (
			<Registro
			onCancel={() => setIsSignUp(false)}
			/>
		) : (
			<>
			<TextInput
			placeholder="Correo electrónico"
			style={styles.input}
			placeholderTextColor="#888888"
			value={correo}
			onChangeText={(text) => setCorreo(text)}
			autoCapitalize="none"
			keyboardType="email-address"
			/>
			<View style={styles.passwordContainer}>
			<TextInput
			placeholder="Contraseña"
			secureTextEntry={!showPassword}
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
			{passwordError ? (
				<Text style={styles.errorText}>{passwordError}</Text>
			) : null}
			<TouchableOpacity
			style={styles.button}
			onPress={handleLogin}
			>
			<Text style={styles.buttonText}>
			Iniciar Sesión
			</Text>
			</TouchableOpacity>
			</>
		)}
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


// ... (imports remain the same)

// ... (HomeStack, HomeScreen, etc. remain the same)

// ... (LoginScreen remains the same)

const AppContent = () => {
	const { isLoggedIn, user } = useUser();
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const [isConnected, setIsConnected] = useState(true);
	const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
	const [alertData, setAlertData] = useState(null);


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

	useEffect(() => {
		const setupNotificationsAndSockets = async () => {
			if (isLoggedIn && user) {
				// Register for push notifications
				const token = await store.getValueFor('jwt');
				registerForPushNotificationsAsync(user.id, token);

				// Setup sockets
				const SOCKET_URL = apiUrl.replace(/^https/, 'wss');
				startSocket(SOCKET_URL);

				const socket = getSocket();
				if (socket) {
					socket.on('connect', () => {
						if (user && user.id) {
							sendMessage('registerUser', { userId: user.id });
						}
						if (user && user.municipality) {
							sendMessage('joinMunicipality', user.municipality);
						}
					});

					socket.on('newMissingAlert', (data) => {
						setAlertData(data);
						setIsAlertModalVisible(true);
					});
				}

				// Handle notifications received while the app is open
				const notificationListener = Notifications.addNotificationReceivedListener(notification => {
					// This listener fires whenever a notification is received while the app is foregrounded
					// We might want to show an in-app alert or update UI, but for now, we'll just log it.
					console.log("Notification received while app is open:", notification);
				});

				// Handle notification responses (when user taps on a notification)
				const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
					console.log("Notification response received:", response);
					const { data } = response.notification.request.content;
					if (data && data.pet && data.user && data.alert) {
						setAlertData(data);
						setIsAlertModalVisible(true);
					}
				});

				// Handle case where app is opened by tapping a notification (app was closed)
				const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
				if (lastNotificationResponse) {
					console.log("App opened by notification:", lastNotificationResponse);
					const { data } = lastNotificationResponse.notification.request.content;
					if (data && data.pet && data.user && data.alert) {
						setAlertData(data);
						setIsAlertModalVisible(true);
					}
				}

				return () => {
					Notifications.removeNotificationSubscription(notificationListener);
					Notifications.removeNotificationSubscription(responseListener);
				};
			}
		};

		setupNotificationsAndSockets();

		return () => {
			if (isLoggedIn) {
				stopSocket();
			}
		};
	}, [isLoggedIn, user]);


  if (!isConnected) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6d3c3' }}>
          <Ionicons name="paw-outline" size={80} color="#b04f4f" />
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#b04f4f', marginTop: 20, textAlign: 'center' }}>
            Sin conexión a Internet
          </Text>
          <Text style={{ fontSize: 16, color: '#b04f4f', marginTop: 10, textAlign: 'center', paddingHorizontal: 20 }}>
            Por favor, conéctate a una red para continuar usando Laika.
          </Text>
          <Image source={require('./assets/offline.png')} style={{ width: 260, height: 260, marginTop: 30, borderRadius: 25 }} contentFit="contain" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

	if (!isLoggedIn) {
		// Añadir este log para depuración
		return <LoginScreen />;
	}



	return (
		<View style={{ flex: 1 }}>
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
							headerTitle: 'Laika - Busca a tu mascota', // Cambia el título del header a "Laika"
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
			<MissingPetAlertModal
				visible={isAlertModalVisible}
				alertData={alertData}
				onClose={() => setIsAlertModalVisible(false)}
			/>
		</View>
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
