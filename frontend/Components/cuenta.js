import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

// Import shared data
import { getMascotas } from './MascotasData';
import { useUser } from './UserContext';

const Perfil = ({ setIsLoggedIn }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { userProfile, updateUserProfile, getFullName } = useUser();
  const [perros, setPerros] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(userProfile);
  const [emailUsername, setEmailUsername] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');

  const emailDomains = ['gmail.com', 'hotmail.com', 'outlook.com'];

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

  useEffect(() => {
    setEditableProfile(userProfile);
    // Split email when component mounts or userProfile changes
    const emailParts = userProfile.correo.split('@');
    if (emailParts.length === 2) {
      setEmailUsername(emailParts[0]);
      setEmailDomain(emailParts[1]);
    }
  }, [userProfile]);

  // Filter pets by state for display
  const getMascotasByStatus = (status) => {
    return perros.filter(pet => pet.estado === status);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (isEditing) {
        setEditableProfile(prev => ({ ...prev, profileImage: result.assets[0].uri }));
      } else {
        updateUserProfile({ profileImage: result.assets[0].uri });
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Construct full email from username and domain
      const fullEmail = `${emailUsername}@${emailDomain}`;
      const updatedProfile = { ...editableProfile, correo: fullEmail };
      
      // Validación básica
      const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.com$/;
      const phonePattern = /^\d+$/;

      if (!updatedProfile.nombre || !updatedProfile.apellidoPaterno || !updatedProfile.apellidoMaterno || !emailUsername || !updatedProfile.telefono) {
        Alert.alert('Error', 'Por favor, completa todos los campos correctamente.');
        return;
      }

      if (!emailPattern.test(fullEmail)) {
        Alert.alert('Error', 'Por favor, introduce un correo válido.');
        return;
      }

      if (!phonePattern.test(updatedProfile.telefono)) {
        Alert.alert('Error', 'Por favor, introduce un número de teléfono válido.');
        return;
      }

      updateUserProfile(updatedProfile);
    } else {
      setEditableProfile(userProfile);
      const emailParts = userProfile.correo.split('@');
      if (emailParts.length === 2) {
        setEmailUsername(emailParts[0]);
        setEmailDomain(emailParts[1]);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            setIsLoggedIn(false); // Cambia el estado de sesión a no logueado
          },
        },
      ]
    );
  };

  // Function to navigate to mis_mascotas.js
  const handleNavigateToMisMascotas = (perro) => {
    navigation.navigate('Mascotas', { perroId: perro.id });
  };

  const renderEmailDisplay = () => {
    const emailParts = userProfile.correo.split('@');
    if (emailParts.length === 2) {
      return (
        <View style={styles.emailDisplayContainer}>
          <Text style={styles.emailUsername}>{emailParts[0]}</Text>
          <Text style={styles.emailDomain}>@{emailParts[1]}</Text>
        </View>
      );
    }
    return <Text style={styles.infoValue}>{userProfile.correo}</Text>;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.containerPerfil}>
        {/* Profile Image */}
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          <Image 
            source={{ uri: isEditing ? editableProfile.profileImage : userProfile.profileImage }} 
            style={styles.profileImage} 
          />
          <View style={styles.editImageOverlay}>
            <Ionicons name="camera" size={24} color="white" />
          </View>
        </TouchableOpacity>

        {/* User Information */}
        <View style={styles.userInfoContainer}>
          {/* Nombre */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            {isEditing ? (
              <TextInput
                style={styles.inputPerfil}
                value={editableProfile.nombre}
                onChangeText={(text) => setEditableProfile(prev => ({ ...prev, nombre: text }))}
                placeholder="Nombre"
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile.nombre}</Text>
            )}
          </View>

          {/* Apellido Paterno */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Apellido Paterno:</Text>
            {isEditing ? (
              <TextInput
                style={styles.inputPerfil}
                value={editableProfile.apellidoPaterno}
                onChangeText={(text) => setEditableProfile(prev => ({ ...prev, apellidoPaterno: text }))}
                placeholder="Apellido Paterno"
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile.apellidoPaterno}</Text>
            )}
          </View>

          {/* Apellido Materno */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Apellido Materno:</Text>
            {isEditing ? (
              <TextInput
                style={styles.inputPerfil}
                value={editableProfile.apellidoMaterno}
                onChangeText={(text) => setEditableProfile(prev => ({ ...prev, apellidoMaterno: text }))}
                placeholder="Apellido Materno"
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile.apellidoMaterno}</Text>
            )}
          </View>

          {/* Correo */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Correo:</Text>
            {isEditing ? (
              <View style={styles.emailEditContainer}>
                <TextInput
                  style={styles.emailUsernameInput}
                  value={emailUsername}
                  onChangeText={setEmailUsername}
                  placeholder="usuario"
                />
                <Text style={styles.atSymbol}>@</Text>
                <Picker
                  selectedValue={emailDomain}
                  style={styles.domainPicker}
                  onValueChange={setEmailDomain}
                >
                  {emailDomains.map((domain) => (
                    <Picker.Item key={domain} label={domain} value={domain} />
                  ))}
                </Picker>
              </View>
            ) : (
              renderEmailDisplay()
            )}
          </View>

          {/* Teléfono */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono:</Text>
            {isEditing ? (
              <TextInput
                style={styles.inputPerfil}
                value={editableProfile.telefono}
                onChangeText={(text) => setEditableProfile(prev => ({ ...prev, telefono: text }))}
                keyboardType="phone-pad"
                placeholder="Teléfono"
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile.telefono}</Text>
            )}
          </View>
        </View>

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

        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  containerPerfil: {
    flex: 1,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
  },
  userInfoContainer: {
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  inputPerfil: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderWidth: 1,
    textAlign: 'right',
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
    backgroundColor: '#000000ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 5 },
    shadowOpacity: 10,
    shadowRadius: 13,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: '#000000ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
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
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e07978',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 5,
  },
  apellidoPerfil: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  emailDisplayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  emailUsername: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  emailDomain: {
    fontSize: 14,
    color: '#999',
    textAlign: 'right',
  },
  emailEditContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  emailUsernameInput: {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderWidth: 1,
    textAlign: 'right',
    marginRight: 5,
  },
  atSymbol: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 2,
  },
  domainPicker: {
    flex: 1,
    height: 40,
  },
});

export default Perfil;