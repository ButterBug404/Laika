import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ImageBackground,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

// Archivos de componentes
import Inicio from './Components/Home';
import Registrar from './Components/Registrar';
import Mascotas from './Components/Mis_Mascotas';
import Adoptar from './Components/Adoptar';
import Cuenta from './Components/Cuenta';

// Estilos
import styles from './Components/Estilos/Estilos.js';
import Anuncio1 from './Components/Anuncios/Anuncio1.js';
import Anuncio2 from './Components/Anuncios/Anuncio2.js';
import Anuncio3 from './Components/Anuncios/Anuncio3.js';
import Anuncio4 from './Components/Anuncios/Anuncio4.js';
import Anuncio5 from './Components/Anuncios/Anuncio5.js';
import Anuncio6 from './Components/Anuncios/Anuncio6.js';
import Anuncio7 from './Components/Anuncios/Anuncio7.js';
import Anuncio8 from './Components/Anuncios/Anuncio8.js';
import Lista_Anuncios from './Components/Anuncios/Lista.js';
import { UserProvider } from './Components/UserContext';

const estados = [
  'Selecciona Estado',
  'Ciudad de México',
  'Estado de México',
  'Jalisco',
];

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
      name="Anuncio1"
      component={Anuncio1}
      options={{
        title: 'Anuncio 1',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      }}
    />
    <Stack.Screen
      name="Anuncio2"
      component={Anuncio2}
      options={{
        title: 'Anuncio 2',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      }}
    />
    <Stack.Screen
      name="Anuncio3"
      component={Anuncio3}
      options={{
        title: 'Anuncio 3',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      }}
    />
    <Stack.Screen
      name="Anuncio4"
      component={Anuncio4}
      options={{
        title: 'Anuncio 4',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      }}
    />
    <Stack.Screen
      name="Anuncio5"
      component={Anuncio5}
      options={{
        title: 'Nutrición Animal',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      }}
    />
    <Stack.Screen
      name="Anuncio6"
      component={Anuncio6}
      options={{
        title: 'Entrenamiento Canino',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      }}
    />
    <Stack.Screen
      name="Anuncio7"
      component={Anuncio7}
      options={{
        title: 'Primeros Auxilios',
        headerStyle: { backgroundColor: '#b04f4f' },
        headerTintColor: '#f6d3c3',
      }}
    />
    <Stack.Screen
      name="Anuncio8"
      component={Anuncio8}
      options={{
        title: 'Vacunación',
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
const AnunciosScreen = () => <Anuncio1 />;
const PerfilScreen = ({ setIsLoggedIn }) => (
  <Cuenta setIsLoggedIn={setIsLoggedIn} />
);

const App = () => {
  const [selectedEstado, setSelectedEstado] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre inicio y registro
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Estado para manejar el login
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z]).{6,}$/;
    return passwordPattern.test(password);
  };

  const handleRegister = () => {
    if (
      !correo ||
      !password ||
      !nombre ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !telefono ||
      selectedEstado === 'Selecciona Estado'
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
      setPasswordError('');
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
      console.log('LOG: do it');
      const res = await fetch(process.env.EXPO_PUBLIC_API_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: correo }),
      });
      const data = await res.json();
      console.log('LOG: ', data);
      if (data.success) {
        setIsLoggedIn(true);
        setPasswordError('');
      }
    }
  };

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
                          onValueChange={(itemValue) =>
                            setSelectedEstado(itemValue)
                          }>
                          {estados.map((estado, index) => (
                            <Picker.Item
                              key={index}
                              label={estado}
                              value={estado}
                            />
                          ))}
                        </Picker>
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