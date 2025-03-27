import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from '../Components/estilos.js';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import Inicio from '../App';

const Perfil = () => {
  const navigation = useNavigation(); // Utiliza el hook de navegación
  const [nombre, setNombre] = useState('Juan Pérez');
  const [correo, setCorreo] = useState('juan.perez@example.com');
  const [telefono, setTelefono] = useState('(555) 123-4567');
  const [perros, setPerros] = useState(2);
  const [imagenPerfil, setImagenPerfil] = useState('https://via.placeholder.com/150'); // Imagen inicial
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // Validación básica
      if (!nombre || !correo || !telefono || isNaN(perros)) {
        Alert.alert('Error', 'Por favor, completa todos los campos correctamente.');
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  const handleImageChange = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('El usuario canceló la selección de imagen');
        } else if (response.errorMessage) {
          console.error('Error al seleccionar imagen:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          setImagenPerfil(uri);
        }
      }
    );
  };

  const handleLogout = () => {
    navigation.navigate('Home'); // Navega a la pantalla Home
  };

  return (
    <View style={styles.containerCuenta}>
      {/* Imagen de perfil */}
      <TouchableOpacity onPress={handleImageChange}>
        <Image source={{ uri: imagenPerfil }} style={styles.logo} />
        <Text style={styles.changeImageText}>Cambiar imagen de perfil</Text>
      </TouchableOpacity>
      {/* Nombre */}
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={(text) => setNombre(text)}
          placeholder="Nombre completo"
        />
      ) : (
        <Text style={styles.title}>{nombre}</Text>
      )}
      {/* Correo */}
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={(text) => setCorreo(text)}
          keyboardType="email-address"
          placeholder="Correo electrónico"
        />
      ) : (
        <Text style={styles.subtitle}>{correo}</Text>
      )}
      {/* Teléfono */}
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={(text) => setTelefono(text)}
          keyboardType="phone-pad"
          placeholder="Teléfono"
        />
      ) : (
        <Text style={styles.subtitle}>{telefono}</Text>
      )}
      
      {/* Perros registrados */}
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={String(perros)}
          onChangeText={(text) => setPerros(Number(text))}
          keyboardType="numeric"
          placeholder="Número de perros registrados"
        />
      ) : (
        <Text style={styles.subtitle}>Perros registrados: {perros}</Text>
      )}

      {/* Botón para editar el perfil */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleEditToggle}
      >
        <Text style={styles.buttonText}>
          {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
        </Text>
      </TouchableOpacity>

      {/* Botón para cerrar sesión */}
      <TouchableOpacity
  style={styles.button}
  onPress={handleLogout}
>
  <Text style={styles.buttonText}>Cerrar Sesión</Text>
</TouchableOpacity>
    </View>
  );
};

export default Perfil;