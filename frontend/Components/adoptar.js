import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Modal, Pressable, Button, ScrollView, Linking, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { getAdoptionPets } from './MascotasData';
import AuthenticatedImage from './AuthenticatedImage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const Adopta = () => {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [contactoModalVisible, setContactoModalVisible] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [especieSeleccionada, setEspecieSeleccionada] = useState('todas');
  const [mascotasData, setMascotasData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const adoptionPets = await getAdoptionPets();
        
        const processedPets = adoptionPets.map(pet => ({
          id: pet.id,
          nombre: pet.name,
          especie: pet.species.toLowerCase(),
          raza: pet.breed,
          edad: `${pet.age} ${pet.age_unit.toLowerCase()}`,
          color: pet.color,
          tamaño: pet.size,
          vacunado: pet.vaccinated,
          descripcion: pet.description,
          face_image: pet.face_image,
          images: pet.images,
          contacto: {
            tipo: 'personal', // Assuming all adoption pets are listed by individuals for now
            nombre: pet.owner_name,
            telefono: pet.contact_info || pet.owner_phone,
            email: pet.owner_email,
          },
          isUserPet: false // All pets fetched here are for adoption, not the current user's
        }));
        
        setMascotasData(processedPets);
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
          dropdownIconColor="#e07978"
        >
          <Picker.Item label="Todas las especies" value="todas" style={styles.pickerItem} />
          <Picker.Item label="Perros" value="dog" style={styles.pickerItem} />
          <Picker.Item label="Gatos" value="cat" style={styles.pickerItem} />
          <Picker.Item label="Conejos" value="bunny" style={styles.pickerItem} />
          <Picker.Item label="Aves" value="bird" style={styles.pickerItem} />
        </Picker>
      </View>

      <FlatList
        data={mascotasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => openModal(item)}>
            <AuthenticatedImage petId={item.id} type="faces" style={styles.imagen} />
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.detalle}>Edad: {item.edad}</Text>
            <Text style={styles.detalle}>Especie: {item.especie.charAt(0).toUpperCase() + item.especie.slice(1)}</Text>
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
                <AuthenticatedImage petId={selectedMascota.id} type="faces" style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedMascota.nombre}</Text>
                <Text style={styles.modalDetail}>Especie: {selectedMascota.especie.charAt(0).toUpperCase() + selectedMascota.especie.slice(1)}</Text>
                <Text style={styles.modalDetail}>Edad: {selectedMascota.edad}</Text>
                <Text style={styles.modalDetail}>Raza: {selectedMascota.raza}</Text>
                <Text style={styles.modalDetail}>Color: {selectedMascota.color}</Text>
                <Text style={styles.modalDetail}>Tamaño: {selectedMascota.tamaño}</Text>
                <Text style={styles.modalDetail}>Vacunado: {selectedMascota.vacunado ? 'Sí' : 'No'}</Text>
                <Text style={styles.modalDetail}>Descripción: {selectedMascota.descripcion}</Text>
                
                <Button 
                  title="Contactar para adoptar" 
                  onPress={abrirModalContactos}
                  color="#e07978"
                  style={styles.closeButton}
                />
                
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
                  {selectedMascota.contacto.telefono && (
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
                  )}
                  
                  {/* Email */}
                  {selectedMascota.contacto.email && (
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 10, // Increase elevation to render on top of other elements
    height: 60, // Increase height
  },
  pickerItem: {
    color: '#000', // Explicitly set text color
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
});

export default Adopta;