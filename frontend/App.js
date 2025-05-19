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
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Archivos de componentes
import Adoptar from './Components/adoptar';
import Cuenta from './Components/cuenta';
import Inicio from './Components/Home';
import Mascotas from './Components/mis_mascotas.js';
import Registrar from './Components/registrar';
import styles from './Components/estilos.js';

// Lista de estados
const estados = [
  'Selecciona Estado',
  'Ciudad de México (CDMX)',
  'Estado de México',
  'Jalisco',
];

const Tab = createBottomTabNavigator();

const HomeScreen = () => <Inicio />;
const MascotasScreen = () => <Mascotas />;
const RegistrarScreen = () => <Registrar />;
const AdoptaScreen = () => <Adoptar />;
const PerfilScreen = ({ setIsLoggedIn }) => (
  <Cuenta setIsLoggedIn={setIsLoggedIn} />
);

const App = () => {
  const [selectedEstado, setSelectedEstado] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre inicio y registro
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para manejar el login
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
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
      setTelefono('');
      setSelectedEstado('Selecciona Estado');
      setPasswordError('');
    }
  };

  const handleLogin = () => {
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
      setIsLoggedIn(true);
      setPasswordError('');
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.containerApp}>
          <ImageBackground
            source={require('./assets/dddepth-169.jpg')}
            style={styles.card}
            resizeMode="cover"
            imageStyle={styles.backgroundImage}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}>
              <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                <Image
                  source={require('./assets/Mod1.gif')}
                  style={styles.logoApp}
                />

                <Text style={styles.title}>Laika</Text>

                <Text style={styles.subtitle2}>
                  buscaremos a tu peludito en todo el universo.
                </Text>
                <Text style={styles.subtitle}>
                  {isSignUp
                    ? 'Regístrate para buscar a tu peludito.'
                    : 'Inicia sesión para continuar.'}
                </Text>
                {isSignUp && (
                  <>
                    <TextInput
                      placeholder="Nombre completo"
                      style={styles.input}
                      placeholderTextColor="#888888"
                      value={nombre}
                      onChangeText={(text) => setNombre(text)}
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
              </ScrollView>
            </KeyboardAvoidingView>
          </ImageBackground>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
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
          headerStyle: { backgroundColor: '#b04f4f' },
          headerTintColor: '#f6d3c3',
        })}>
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Mascotas" component={MascotasScreen} />
        <Tab.Screen name="Registrar" component={RegistrarScreen} />
        <Tab.Screen name="Adopción" component={AdoptaScreen} />
        <Tab.Screen name="Perfil">
          {() => <PerfilScreen setIsLoggedIn={setIsLoggedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
