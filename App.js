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
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
];

const Tab = createBottomTabNavigator();

const HomeScreen = () => <Inicio />;
const MascotasScreen = () => <Mascotas />;
const RegistrarScreen = () => <Registrar />;
const AdoptaScreen = () => <Adoptar />;
const PerfilScreen = () => <Cuenta />;

const App = () => {
  const [selectedEstado, setSelectedEstado] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre inicio y registro
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para manejar el login
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  const PerfilScreen = () => <Cuenta setIsLoggedIn={setIsLoggedIn} />;

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.containerApp}>
          <ImageBackground
            source={require('./assets/dddepth-169.jpg')}
            style={styles.card}
            resizeMode="cover">
            <ScrollView>
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
              <TextInput
                placeholder="Correo electrónico"
                style={styles.input}
                placeholderTextColor="#888888"
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Contraseña"
                  secureTextEntry={!showPassword} // Mostrar u ocultar contraseña
                  style={styles.input}
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
                    color="#888888"
                  />
                </TouchableOpacity>
              </View>
              {isSignUp && (
                <>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Confirmar contraseña"
                      secureTextEntry={!showPassword} // Mostrar u ocultar contraseña
                      style={styles.input}
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
                        color="#888888"
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                </>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (isSignUp && password !== confirmPassword) {
                    setPasswordError('La contraseña no coincide');
                  } else {
                    setIsLoggedIn(true);
                  }
                }}
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
          headerStyle: { backgroundColor: 'indianred' },
          headerTintColor: 'white',
        })}>
        <Tab.Screen name="Perfil" component={PerfilScreen} />
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Mascotas" component={MascotasScreen} />
        <Tab.Screen name="Registrar" component={RegistrarScreen} />
        <Tab.Screen name="Adopción" component={AdoptaScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;