import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import ProfileImage from './ProfileImage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import store from '../utils/store';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Import shared data
import { useUser } from './UserContext';

import { getMascotas } from './MascotasData';

const Perfil = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { userProfile, updateUserProfile, getFullName, logoutUser } = useUser();
  const [perros, setPerros] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editableProfile, setEditableProfile] = useState(userProfile);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isFocused && userProfile && userProfile.id) {
      const fetchPets = async () => {
        try {
					const allMascotas = await getMascotas();
          setPerros(allMascotas);
        } catch (err) {
          console.error("Failed to fetch pets:", err.response?.data || err.message);
        }
      };

      fetchPets();
    }
  }, [isFocused, userProfile.id]);

  useEffect(() => {
    setEditableProfile(userProfile);
  }, [userProfile]);

  // Filter pets by state for display
  const getMascotasByStatus = (status) => {
    return perros.filter(pet => pet.estado === status);
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // Check if there were any changes
      const hasChanges = 
        editableProfile.nombre !== userProfile.nombre ||
        editableProfile.apellidoPaterno !== userProfile.apellidoPaterno ||
        editableProfile.apellidoMaterno !== userProfile.apellidoMaterno ||
        editableProfile.correo !== userProfile.correo ||
        editableProfile.telefono !== userProfile.telefono;

      if (!hasChanges) {
        Alert.alert('Sin Cambios', 'No has realizado ningún cambio en tu perfil.');
        setIsEditing(false);
        return;
      }

      // Validación básica
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phonePattern = /^\d+$/;

      if (!editableProfile.nombre || !editableProfile.apellidoPaterno || !editableProfile.apellidoMaterno || !editableProfile.correo || !editableProfile.telefono) {
        Alert.alert('Error', 'Por favor, completa todos los campos correctamente.');
        return;
      }

      if (!emailPattern.test(editableProfile.correo)) {
        Alert.alert('Error', 'Por favor, introduce un correo válido.');
        return;
      }

      if (!phonePattern.test(editableProfile.telefono)) {
        Alert.alert('Error', 'Por favor, introduce un número de teléfono válido.');
        return;
      }

      try {
        const token = await getValueFor('jwt');
        await axios.put(`${apiUrl}/api/update-user`, {
          name: editableProfile.nombre,
          pat_name: editableProfile.apellidoPaterno,
          mat_name: editableProfile.apellidoMaterno,
          email: editableProfile.correo,
          phone: editableProfile.telefono,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        updateUserProfile(editableProfile);
        Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      } catch (err) {
        console.error("Failed to update profile:", err.response?.data || err.message);
        Alert.alert('Error', 'No se pudo actualizar el perfil.');
      }
    } else {
      setEditableProfile(userProfile);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableProfile(userProfile);
  };

  const handleEditPassword = async () => {
    if (isEditingPassword) {
      // Validar campos
      if (!oldPassword) {
        Alert.alert('Error', 'Por favor, introduce tu contraseña actual.');
        return;
      }

      if (newPassword.length < 8) {
        Alert.alert('Error', 'La nueva contraseña debe tener al menos 8 caracteres.');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }

      if (oldPassword === newPassword) {
        Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual.');
        return;
      }

      try {
        const token = await store.getValueFor('jwt');
        await axios.put(`${apiUrl}/api/update-password`, {
          old_password: oldPassword,
          new_password: newPassword,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Limpiar campos y salir del modo de edición
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsEditingPassword(false);
        
        Alert.alert('Éxito', 'Tu contraseña ha sido actualizada.');
      } catch (err) {
        console.error("Failed to update password:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          Alert.alert('Error', 'La contraseña actual es incorrecta.');
        } else {
          Alert.alert('Error', 'No se pudo actualizar la contraseña.');
        }
      }
    } else {
      // Entrar en modo de edición de contraseña
      setIsEditingPassword(true);
    }
  };

  const cancelPasswordEdit = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditingPassword(false);
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
          onPress: async () => {
            try {
              const token = await store.getValueFor('jwt');
              await axios.post(`${apiUrl}/api/logout`, {}, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            } catch (error) {
              console.error("Failed to logout:", error.response?.data || error.message);
            } finally {
              logoutUser(); // Use logoutUser from context
            }
          },
        },
      ]
    );
  };

  // Función para navegar a mis_mascotas.js
  const handleNavigateToMisMascotas = (perro) => {
    navigation.navigate('Mascotas', { perroId: perro.id });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.containerPerfil}>
        {/* Profile Image */}
        <ProfileImage 
          user_id={userProfile.id}
          style={styles.profileImage} 
          editable={true}
          onImageChange={(uri) => setEditableProfile(prev => ({ ...prev, profileImage: uri }))}
        />

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
              <TextInput
                style={styles.inputPerfil}
                value={editableProfile.correo}
                onChangeText={(text) => setEditableProfile(prev => ({ ...prev, correo: text }))}
                placeholder="correo@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.infoValue}>{userProfile.correo}</Text>
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
          disabled={isEditingPassword}
        >
          <Text style={styles.textoBotonPerfil}>
            {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
          </Text>
        </TouchableOpacity>

        {/* Botón para cancelar la edición del perfil */}
        {isEditing && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelEdit}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}

        {/* Botón para editar contraseña */}
        <TouchableOpacity
          style={[styles.botonPerfil, isEditingPassword && styles.botonEditarPerfil]}
          onPress={handleEditPassword}
          disabled={isEditing}
        >
          <Text style={styles.textoBotonPerfil}>
            {isEditingPassword ? 'Guardar Contraseña' : 'Cambiar Contraseña'}
          </Text>
        </TouchableOpacity>

        {/* Formulario de edición de contraseña */}
        {isEditingPassword && (
          <View style={styles.passwordEditContainer}>
            <Text style={styles.passwordEditTitle}>Cambiar Contraseña</Text>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña actual"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.cancelPasswordButton}
              onPress={cancelPasswordEdit}
            >
              <Text style={styles.cancelPasswordText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

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
                    source={{ uri: perro.imagencara }} 
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
                    source={{ uri: perro.imagencara }} 
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  containerPerfil: {
    flex: 1,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    paddingTop: 30,
  },
  userInfoContainer: {
    width: '100%',
    marginVertical: 25,
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 12,
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
    fontWeight: 'semibold',
  },
  inputPerfil: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderWidth: 1,
    textAlign: 'right',
    minHeight: 44,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
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
    fontWeight: 'bold',
  },
  estadoDesaparecido: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
  botonPerfil: {
    backgroundColor: '#000000ff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
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
    fontWeight: 'semibold',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e07978',
  },
  passwordEditContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordEditTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  passwordInput: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 12,
    minHeight: 48,
  },
  cancelPasswordButton: {
    alignSelf: 'center',
    marginTop: 5,
    padding: 10,
  },
  cancelPasswordText: {
    color: '#666666ff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Perfil;
