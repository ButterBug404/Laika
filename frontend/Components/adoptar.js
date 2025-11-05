import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Modal, Pressable, Button, ScrollView, Linking, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { getMascotas } from './MascotasData';

// Replace the function to directly return required local images
const getImageForAnimal = (especie) => {
  switch(especie) {
    case 'perro':
      return require('../assets/PerroIcon.png');
    case 'gato':
      return require('../assets/GatoIcon.png');
    case 'conejo':
      return require('../assets/ConejoIcon.png');
    case 'ave':
      return require('../assets/AveIcon.png');
    default:
      return { uri: 'https://cdn.dribbble.com/userupload/6113043/file/original-b2a7a299d9bba74d1d4ea1fed5457051.png?resize=1200x900&vertical=center' };
  }
};

const Adopta = () => {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [contactoModalVisible, setContactoModalVisible] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [especieSeleccionada, setEspecieSeleccionada] = useState('todas');
  const [mascotasData, setMascotasData] = useState([]);
  const [contactosData, setContactosData] = useState({ empresas: [], personales: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data from GitHub JSON and combine with local pets
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get user's local pets for adoption - FILTER OUT ADOPTED PETS
        const userPets = await getMascotas();
        const availablePets = userPets.filter(pet => 
          pet.tipoRegistro === 'adopcion' && pet.estado !== 'Adoptada'
        );
        
        // Process user pets to match structure and mark them as user's own
        const processedUserPets = availablePets.map(pet => ({
          ...pet,
          contacto: {
            tipo: 'personal',
            nombre: 'Mi contacto',
            telefono: pet.contacto || 'Contactar através del perfil',
            // Add default email if needed
          },
          isUserPet: true // Mark as user's own pet
        }));
        
        // Set the processed pets
        setMascotasData(processedUserPets);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle navigation parameters
  useEffect(() => {
    if (route.params?.filtroEspecie) {
      setEspecieSeleccionada(route.params.filtroEspecie);
    }
  }, [route.params]);

  // Filter mascotas based on selected species
  const mascotasFiltradas = especieSeleccionada === 'todas'
    ? mascotasData
    : mascotasData.filter(mascota => mascota.especie === especieSeleccionada);

  const openModal = (mascota) => {
    setSelectedMascota(mascota);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMascota(null);
  };

  const abrirModalContactos = () => {
    // Check if the selected pet is the user's own
    if (selectedMascota.isUserPet) {
      Alert.alert(
        'Esta es tu mascota',
        'No puedes adoptar tu propia mascota que has puesto en adopción.',
        [{ text: 'Entendido' }]
      );
    } else {
      setContactoModalVisible(true);
    }
  };

  const cerrarModalContactos = () => {
    setContactoModalVisible(false);
  };

  const enviarWhatsApp = (telefono, mascota) => {
    const mensaje = `Hola, estoy interesado en adoptar a ${mascota.nombre}, ${mascota.especie} de raza ${mascota.raza} que vi en la aplicación. ¿Podría darme más información?`;
    const url = `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            'Error', 
            'WhatsApp no está instalado en este dispositivo.',
            [{ text: 'OK' }]
          );
        }
      })
      .catch(err => console.error('Error al abrir WhatsApp:', err));
  };

  const enviarEmail = (email, mascota) => {
    const asunto = `Interés en adopción de ${mascota.nombre}`;
    const cuerpo = `Hola,\n\nEstoy interesado en adoptar a ${mascota.nombre}, ${mascota.especie} de raza ${mascota.raza} que vi en la aplicación. ¿Podrían darme más información?\n\nGracias por su atención.`;
    const url = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            'Error', 
            'No se pudo abrir la aplicación de correo.',
            [{ text: 'OK' }]
          );
        }
      })
      .catch(err => console.error('Error al abrir email:', err));
  };

  const getIconoPorTipo = (tipo) => {
    return tipo === 'asociación' ? '🏢' : '👤';
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e07978" />
        <Text style={styles.loadingText}>Cargando mascotas...</Text>
      </View>
    );
  }

  // Show error message if there was an error
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Reintentar" 
          onPress={() => window.location.reload()}
          color="#e07978"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adopción</Text>
      
      {/* Picker para filtrar por especies */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Filtrar por especie:</Text>
        <Picker
          selectedValue={especieSeleccionada}
          style={styles.picker}
          onValueChange={(itemValue) => setEspecieSeleccionada(itemValue)}
        >
          <Picker.Item label="Todas las especies" value="todas" />
          <Picker.Item label="Perros" value="perro" />
          <Picker.Item label="Gatos" value="gato" />
          <Picker.Item label="Conejos" value="conejo" />
          <Picker.Item label="Aves" value="ave" />
        </Picker>
      </View>

      <FlatList
        data={mascotasFiltradas}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => openModal(item)}>
            <Image source={item.imagen} style={styles.imagen} />
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.detalle}>Edad: {item.edad}</Text>
            <Text style={styles.detalle}>Especie: {item.especie.charAt(0).toUpperCase() + item.especie.slice(1)}</Text>
            {item.isUserPet && (
              <View style={styles.userPetBadge}>
                <Text style={styles.userPetText}>Tu mascota</Text>
              </View>
            )}
          </Pressable>
        )}
      />

      {/* Modal con detalles de la mascota */}
      {selectedMascota && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Image source={selectedMascota.imagen} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedMascota.nombre}</Text>
                <Text style={styles.modalDetail}>Especie: {selectedMascota.especie.charAt(0).toUpperCase() + selectedMascota.especie.slice(1)}</Text>
                <Text style={styles.modalDetail}>Edad: {selectedMascota.edad}</Text>
                <Text style={styles.modalDetail}>Raza: {selectedMascota.raza}</Text>
                <Text style={styles.modalDetail}>Color: {selectedMascota.color}</Text>
                <Text style={styles.modalDetail}>Tamaño: {selectedMascota.tamaño}</Text>
                <Text style={styles.modalDetail}>Vacunado: {selectedMascota.vacunado ? 'Sí' : 'No'}</Text>
                <Text style={styles.modalDetail}>Descripción: {selectedMascota.descripcion}</Text>
                
                {selectedMascota.isUserPet ? (
                  <View style={styles.ownPetNotice}>
                    <Text style={styles.ownPetNoticeText}>Esta es tu mascota en adopción</Text>
                    <Text style={styles.ownPetNoticeSubtext}>No puedes adoptar tu propia mascota</Text>
                  </View>
                ) : (
                  <Button 
                    title="Contactar para adoptar" 
                    onPress={abrirModalContactos}
                    color="#e07978"
                    style={styles.closeButton}
                  />
                )}
                
                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal de contacto para adopción */}
      {selectedMascota && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={contactoModalVisible}
          onRequestClose={cerrarModalContactos}
        >
          <View style={styles.modalContainer}>
            <View style={styles.contactModalContent}>
              <Text style={styles.contactModalTitle}>Contacto para adopción</Text>
              <Text style={styles.contactModalSubtitle}>
                Puedes contactar para adoptar a {selectedMascota.nombre}:
              </Text>
              
              {/* Solo se muestra un contacto por mascota */}
              <View style={[
                styles.contactoCard, 
                selectedMascota.contacto.tipo === 'asociación' ? styles.contactoAsociacion : styles.contactoPersonal
              ]}>
                <View style={styles.contactoHeader}>
                  <Text style={styles.contactoTipo}>{getIconoPorTipo(selectedMascota.contacto.tipo)}</Text>
                  <Text style={styles.contactoName}>{selectedMascota.contacto.nombre}</Text>
                </View>
                
                <View style={styles.contactoDetailsContainer}>
                  {/* Teléfono con opción de WhatsApp */}
                  <Pressable 
                    style={styles.contactoMethod} 
                    onPress={() => enviarWhatsApp(selectedMascota.contacto.telefono, selectedMascota)}
                  >
                    <Text style={styles.contactoMethodIcon}>📱</Text>
                    <View style={styles.contactoMethodDetail}>
                      <Text style={styles.contactoMethodLabel}>WhatsApp</Text>
                      <Text style={styles.contactoMethodValue}>
                        {selectedMascota.contacto.telefono.replace("52", "+52 ")}
                      </Text>
                    </View>
                  </Pressable>
                  
                  {/* Email solo para contactos de tipo asociación */}
                  {selectedMascota.contacto.tipo === 'asociación' && (
                    <Pressable 
                      style={styles.contactoMethod} 
                      onPress={() => enviarEmail(selectedMascota.contacto.email, selectedMascota)}
                    >
                      <Text style={styles.contactoMethodIcon}>📧</Text>
                      <View style={styles.contactoMethodDetail}>
                        <Text style={styles.contactoMethodLabel}>Email</Text>
                        <Text style={styles.contactoMethodValue}>
                          {selectedMascota.contacto.email}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
              </View>
              
              <Pressable style={styles.closeButton} onPress={cerrarModalContactos}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  pickerContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    
  },
  imagen: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detalle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#8e7b85',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    maxHeight: '80%',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDetail: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#b04f4f',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Estilos para el modal de contactos
  contactModalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  contactModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  contactModalSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactoCard: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  contactoAsociacion: {
    borderColor: '#25D366',
    borderWidth: 2,
  },
  contactoPersonal: {
    borderColor: '#128C7E',
    borderWidth: 2,
  },
  contactoHeader: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  contactoTipo: {
    fontSize: 20,
    marginRight: 10,
  },
  contactoName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contactoDetailsContainer: {
    padding: 10,
  },
  contactoMethod: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  contactoMethodIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  contactoMethodDetail: {
    flex: 1,
  },
  contactoMethodLabel: {
    fontSize: 12,
    color: '#555',
  },
  contactoMethodValue: {
    fontSize: 14,
    color: '#333',
  },
  userPetBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  userPetText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ownPetNotice: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  ownPetNoticeText: {
    color: '#721c24',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  ownPetNoticeSubtext: {
    color: '#721c24',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default Adopta;