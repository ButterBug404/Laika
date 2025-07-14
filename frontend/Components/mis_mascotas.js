import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute, useIsFocused } from '@react-navigation/native';

// Import shared data
import { getMascotas, updateMascotaEstado, updateMascotaData } from './MascotasData';

const MisMascotas = () => {
  const route = useRoute();
  const [mascotas, setMascotas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const isFocused = useIsFocused();

  // Get categorized mascotas
  const getMascotasByType = (type) => {
    return mascotas.filter(pet => pet.tipoRegistro === type);
  };

  const getMascotasByStatus = (status) => {
    return mascotas.filter(pet => pet.estado === status);
  };

  useEffect(() => {
    // Load all mascotas from shared data when screen is focused
    if (isFocused) {
      setMascotas(getMascotas());
    }

    // If a specific pet was selected from Cuenta.js, scroll to it
    if (route.params && route.params.perroId) {
      // Implement scroll to specific pet if needed
    }
  }, [route.params, isFocused]);

  const handleReportarDesaparecido = (id) => {
    // Update the shared data and local state
    const updatedMascotas = updateMascotaEstado(id, 'Desaparecido');
    setMascotas([...updatedMascotas]);
  };

  const handleReportarEncontrado = (id) => {
    // Update the shared data and local state
    const updatedMascotas = updateMascotaEstado(id, 'Presente');
    setMascotas([...updatedMascotas]);
  };

  const startEditing = (mascota) => {
    setEditingId(mascota.id);
    setEditData({
      nombre: mascota.nombre,
      edad: mascota.edad,
      raza: mascota.raza
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEditing = (id) => {
    // Validate input
    if (!editData.nombre || !editData.edad || !editData.raza) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Update mascota data
    const updatedMascotas = updateMascotaData(id, editData);
    setMascotas([...updatedMascotas]);
    setEditingId(null);
    setEditData({});
    
    Alert.alert('Éxito', 'Datos actualizados correctamente.');
  };

  const handleEditChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value
    });
  };

  const getPetTypeLabel = (pet) => {
    if (pet.tipoRegistro === 'adopcion') return 'En adopción';
    if (pet.tipoRegistro === 'encontrada') return 'Encontrada';
    return pet.estado;
  };

  const getPetTypeColor = (pet) => {
    if (pet.tipoRegistro === 'adopcion') return '#4682B4'; // Steel Blue
    if (pet.tipoRegistro === 'encontrada') return '#9370DB'; // Medium Purple
    return pet.estado === 'Presente' ? '#32CD32' : '#FF6347';
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Text style={styles.titulo}>Mis Mascotas registradas</Text>
          
          {/* Group pets by type/status for better organization */}
          {mascotas.length > 0 ? (
            <View style={styles.verticalContainer}>
              {mascotas.map((mascota) => (
                <View key={mascota.id} style={[
                  styles.verticalBox, 
                  { borderLeftWidth: 5, borderLeftColor: getPetTypeColor(mascota) }
                ]}>
                  <Image style={styles.imageVertical} source={{ uri: mascota.imagen }} />
                  <View style={styles.verticalTextContainer}>
                    {editingId === mascota.id ? (
                      // Editing mode
                      <>
                        <TextInput
                          style={styles.editInput}
                          value={editData.nombre}
                          onChangeText={(text) => handleEditChange('nombre', text)}
                          placeholder="Nombre"
                        />
                        <TextInput
                          style={styles.editInput}
                          value={editData.edad}
                          onChangeText={(text) => handleEditChange('edad', text)}
                          placeholder="Edad"
                        />
                        <TextInput
                          style={styles.editInput}
                          value={editData.raza}
                          onChangeText={(text) => handleEditChange('raza', text)}
                          placeholder="Raza"
                        />
                        <Text style={styles.verticalDetail}>Estado: {mascota.estado}</Text>
                        
                        <View style={styles.editButtonsContainer}>
                          <TouchableOpacity
                            style={styles.botonGuardar}
                            onPress={() => saveEditing(mascota.id)}
                          >
                            <Text style={styles.botonTexto}>Guardar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.botonCancelar}
                            onPress={cancelEditing}
                          >
                            <Text style={styles.botonTexto}>Cancelar</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      // View mode
                      <>
                        <View style={styles.petHeaderContainer}>
                          <Text style={styles.verticalName}>{mascota.nombre}</Text>
                          <Text style={[
                            styles.petTypeLabel, 
                            { backgroundColor: getPetTypeColor(mascota) }
                          ]}>
                            {getPetTypeLabel(mascota)}
                          </Text>
                        </View>
                        
                        <Text style={styles.verticalDetail}>Edad: {mascota.edad}</Text>
                        <Text style={styles.verticalDetail}>Raza: {mascota.raza}</Text>
                        <Text style={styles.verticalDetail}>Estado: {mascota.estado}</Text>
                        
                        {/* Only show status change buttons for user's own pets */}
                        {mascota.tipoRegistro === 'perdida' && (
                          <View style={styles.buttonRow}>
                            <TouchableOpacity
                              style={styles.botonEditar}
                              onPress={() => startEditing(mascota)}
                            >
                              <Text style={styles.botonTexto}>Editar Datos</Text>
                            </TouchableOpacity>
                            
                            {mascota.estado === 'Presente' ? (
                              <TouchableOpacity
                                style={styles.botonDesaparecido}
                                onPress={() => handleReportarDesaparecido(mascota.id)}
                              >
                                <Text style={styles.botonTexto}>Reportar como desaparecido</Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={styles.botonEncontrado}
                                onPress={() => handleReportarEncontrado(mascota.id)}
                              >
                                <Text style={styles.botonTexto}>Reportar como encontrado</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noMascotasText}>
              No hay mascotas registradas todavía.
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  verticalContainer: {
    marginTop: 10,
  },
  verticalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageVertical: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  verticalTextContainer: {
    flex: 1,
  },
  verticalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  verticalDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  botonDesaparecido: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  botonEncontrado: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'column',
    marginTop: 10,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonEditar: {
    backgroundColor: '#8e7b85',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  botonGuardar: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#777',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  petHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  petTypeLabel: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  noMascotasText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    margin: 20,
    fontStyle: 'italic',
  },
});

export default MisMascotas;