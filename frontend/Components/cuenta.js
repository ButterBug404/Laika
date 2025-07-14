import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import shared data
import { getMascotas } from './MascotasData';

const Perfil = ({ setIsLoggedIn }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [nombre, setNombre] = useState('Juan Pérez');
  const [correo, setCorreo] = useState('juan.perez@hotmail.com');
  const [telefono, setTelefono] = useState('3326551124');
  const [perros, setPerros] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Load and filter mascotas data when component mounts or when screen is focused
  useEffect(() => {
    if (isFocused) {
      // Get all pets
      const allPets = getMascotas();
      
      // Filter out adoption and found pets - only show user's own pets
      const userPets = allPets.filter(pet => 
        pet.tipoRegistro !== 'adopcion' && 
        pet.tipoRegistro !== 'encontrada'
      );
      
      setPerros(userPets);
    }
  }, [isFocused]);

  // Filter pets by state for display
  const getMascotasByStatus = (status) => {
    return perros.filter(pet => pet.estado === status);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Validación básica
      const emailPattern = /^[a-zA-Z0-9._%+-]+@(hotmail|gmail)\.com$/;
      const phonePattern = /^\d+$/;

      if (!nombre || !correo || !telefono) {
        Alert.alert('Error', 'Por favor, completa todos los campos correctamente.');
        return;
      }

      if (!emailPattern.test(correo)) {
        Alert.alert('Error', 'Por favor, introduce un correo válido (hotmail o gmail).');
        return;
      }

      if (!phonePattern.test(telefono)) {
        Alert.alert('Error', 'Por favor, introduce un número de teléfono válido.');
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Cambia el estado de sesión a no logueado
  };

  // Function to navigate to mis_mascotas.js
  const handleNavigateToMisMascotas = (perro) => {
    navigation.navigate('Mascotas', { perroId: perro.id });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.containerPerfil}>
        {/* Nombre */}
        {isEditing ? (
          <TextInput
            style={styles.inputPerfil}
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            placeholder="Nombre completo"
          />
        ) : (
          <Text style={styles.nombrePerfil}>{nombre}</Text>
        )}
        {/* Correo */}
        {isEditing ? (
          <TextInput
            style={styles.inputPerfil}
            value={correo}
            onChangeText={(text) => setCorreo(text)}
            keyboardType="email-address"
            placeholder="Correo electrónico"
          />
        ) : (
          <Text style={styles.correoPerfil}>{correo}</Text>
        )}
        {/* Teléfono */}
        {isEditing ? (
          <TextInput
            style={styles.inputPerfil}
            value={telefono}
            onChangeText={(text) => setTelefono(text)}
            keyboardType="phone-pad"
            placeholder="Teléfono"
          />
        ) : (
          <Text style={styles.telefonoPerfil}>{telefono}</Text>
        )}

        {/* Mascotas Presentes */}
        {getMascotasByStatus('Presente').length > 0 && (
          <>
            <Text style={styles.mascotasTitulo}>Mis Mascotas</Text>
            <View style={styles.perrosContainer}>
              {getMascotasByStatus('Presente').map((perro) => (
                <TouchableOpacity 
                  key={perro.id} 
                  style={styles.perroIconContainer} 
                  onPress={() => handleNavigateToMisMascotas(perro)}
                >
                  <Image 
                    source={{ uri: perro.imagen }} 
                    style={styles.perroImagen} 
                  />
                  <Text style={styles.perroText}>{perro.nombre}</Text>
                  <Text style={[styles.perroEstado, styles.estadoPresente]}>
                    {perro.estado}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Mascotas Desaparecidas */}
        {getMascotasByStatus('Desaparecido').length > 0 && (
          <>
            <Text style={styles.mascotasTitulo}>Mascotas Desaparecidas</Text>
            <View style={styles.perrosContainer}>
              {getMascotasByStatus('Desaparecido').map((perro) => (
                <TouchableOpacity 
                  key={perro.id} 
                  style={[styles.perroIconContainer, styles.perroDesaparecidoContainer]} 
                  onPress={() => handleNavigateToMisMascotas(perro)}
                >
                  <Image 
                    source={{ uri: perro.imagen }} 
                    style={styles.perroImagen} 
                  />
                  <Text style={styles.perroText}>{perro.nombre}</Text>
                  <Text style={[styles.perroEstado, styles.estadoDesaparecido]}>
                    {perro.estado}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* No Pets Message */}
        {perros.length === 0 && (
          <Text style={styles.noMascotasText}>
            No tienes mascotas registradas. Registra una mascota desde la sección "Registrar".
          </Text>
        )}

        {/* Botón para editar el perfil */}
        <TouchableOpacity
          style={[styles.botonPerfil, isEditing && styles.botonEditarPerfil]}
          onPress={handleEditToggle}
        >
          <Text style={styles.textoBotonPerfil}>
            {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
          </Text>
        </TouchableOpacity>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity
          style={styles.botonCerrarSesion}
          onPress={handleLogout}
        >
          <Text style={styles.textoBotonCerrarSesion}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  containerPerfil: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    padding: 20,
  },
  inputPerfil: {
  padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderColor: '#DDD',

  },
  nombrePerfil: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  correoPerfil: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  telefonoPerfil: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  mascotasTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  perrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  perroIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: 150,
    height: 180,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 10,
  },
  perroImagen: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  perroText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
  },
  perroEstado: {
    fontSize: 14,
    marginTop: 5,
  },
  estadoPresente: {
    color: '#32CD32',
  },
  estadoDesaparecido: {
    color: '#FF6347',
  },
  botonPerfil: {
    width: '90%',
    backgroundColor: '#e07978',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  botonEditarPerfil: {
    backgroundColor: '#8e7b85', // Cambiar color para el estado de edición
  },
  textoBotonPerfil: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonCerrarSesion: {
    backgroundColor: '#b04f4f',
    width: '90%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  textoBotonCerrarSesion: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  perroDesaparecidoContainer: {
    borderColor: '#FF6347',
    borderWidth: 2,
  },
  noMascotasText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    margin: 20,
    fontStyle: 'italic',
  },
});

export default Perfil;