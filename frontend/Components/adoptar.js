import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Modal, Pressable, Button, ScrollView, Linking, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';

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

// Contactos para mascotas
const contactos = {
  // Contactos de empresas (con email)
  empresas: [
    { 
      id: 'e1', 
      nombre: 'Asociación Amigos Caninos', 
      telefono: '523326551124', 
      email: 'contacto@amigoscaninos.org', 
      tipo: 'asociación' 
    },
    { 
      id: 'e2', 
      nombre: 'Fundación Felina', 
      telefono: '525523456789', 
      email: 'adopciones@fundacionfelina.mx', 
      tipo: 'asociación' 
    },
    { 
      id: 'e3', 
      nombre: 'Refugio Pequeñas Patitas', 
      telefono: '525534567890', 
      email: 'info@pequeñaspatitas.com', 
      tipo: 'asociación' 
    },
    { 
      id: 'e4', 
      nombre: 'Santuario de Aves', 
      telefono: '525545678901', 
      email: 'aves@santuariomx.org', 
      tipo: 'asociación' 
    }
  ],
  
  // Contactos personales
  personales: [
    { id: 'p1', nombre: 'Carlos Martínez - Voluntario', telefono: '525587456321', tipo: 'personal' },
    { id: 'p2', nombre: 'Ana López - Rescatista', telefono: '525591234567', tipo: 'personal' },
    { id: 'p3', nombre: 'Miguel Sánchez - Especialista', telefono: '525589012345', tipo: 'personal' },
    { id: 'p4', nombre: 'Laura Rodríguez - Veterinaria', telefono: '525578901234', tipo: 'personal' }
  ]
};

const todasLasMascotas = [
  // Perros
  { 
    id: '1', 
    nombre: 'Firulais', 
    edad: '2 años', 
    raza: 'Golden Retriever', 
    color: 'Dorado', 
    tamaño: 'Grande', 
    vacunado: true, 
    descripcion: 'Es muy juguetón y le encanta jugar con niños y agua.', 
    imagen: getImageForAnimal('perro'), 
    especie: 'perro',
    contacto: contactos.empresas[0] // Asociación Amigos Caninos
  },
  { 
    id: '2', 
    nombre: 'Luna', 
    edad: '1 año', 
    raza: 'Pastor Alemán', 
    color: 'Negro y fuego', 
    tamaño: 'Grande', 
    vacunado: true, 
    descripcion: 'Muy inteligente y protectora, ideal para entrenar.', 
    imagen: getImageForAnimal('perro'), 
    especie: 'perro',
    contacto: contactos.personales[0] // Carlos Martínez - Voluntario
  },
  { 
    id: '3', 
    nombre: 'Max', 
    edad: '3 años', 
    raza: 'Labrador', 
    color: 'Chocolate', 
    tamaño: 'Grande', 
    vacunado: false, 
    descripcion: 'Cariñoso y sociable, le encanta correr y jugar con pelotas.', 
    imagen: getImageForAnimal('perro'), 
    especie: 'perro',
    contacto: contactos.empresas[0] // Asociación Amigos Caninos
  },
  { 
    id: '4', 
    nombre: 'Nina', 
    edad: '4 años', 
    raza: 'Poodle', 
    color: 'Blanco', 
    tamaño: 'Mediano', 
    vacunado: true, 
    descripcion: 'Tranquila y obediente, ideal para casas pequeñas.', 
    imagen: getImageForAnimal('perro'), 
    especie: 'perro',
    contacto: contactos.personales[0] // Carlos Martínez - Voluntario
  },
  
  // Gatos
  { 
    id: '5', 
    nombre: 'Michi', 
    edad: '2 años', 
    raza: 'Siamés', 
    color: 'Crema y marrón', 
    tamaño: 'Pequeño', 
    vacunado: true, 
    descripcion: 'Juguetón y vocal, le encanta recibir atención y mimos.', 
    imagen: getImageForAnimal('gato'), 
    especie: 'gato',
    contacto: contactos.empresas[1] // Fundación Felina
  },
  { 
    id: '6', 
    nombre: 'Salem', 
    edad: '3 años', 
    raza: 'Negro común', 
    color: 'Negro', 
    tamaño: 'Mediano', 
    vacunado: true, 
    descripcion: 'Tranquilo y observador, prefiere lugares elevados y cálidos.', 
    imagen: getImageForAnimal('gato'), 
    especie: 'gato',
    contacto: contactos.personales[1] // Ana López - Rescatista
  },
  { 
    id: '7', 
    nombre: 'Pelusa', 
    edad: '1 año', 
    raza: 'Persa', 
    color: 'Blanco', 
    tamaño: 'Mediano', 
    vacunado: false, 
    descripcion: 'Muy cariñoso y perezoso, adora que lo cepillen.', 
    imagen: getImageForAnimal('gato'), 
    especie: 'gato',
    contacto: contactos.empresas[1] // Fundación Felina
  },
  
  // Conejos
  { 
    id: '8', 
    nombre: 'Tambor', 
    edad: '1 año', 
    raza: 'Mini Lop', 
    color: 'Gris y blanco', 
    tamaño: 'Pequeño', 
    vacunado: true, 
    descripcion: 'Muy activo y curioso, le encanta explorar.', 
    imagen: getImageForAnimal('conejo'), 
    especie: 'conejo',
    contacto: contactos.empresas[2] // Refugio Pequeñas Patitas
  },
  { 
    id: '9', 
    nombre: 'Copito', 
    edad: '2 años', 
    raza: 'Cabeza de león', 
    color: 'Blanco', 
    tamaño: 'Pequeño', 
    vacunado: true, 
    descripcion: 'Tranquilo y amigable, perfecto para niños.', 
    imagen: getImageForAnimal('conejo'), 
    especie: 'conejo',
    contacto: contactos.personales[2] // Miguel Sánchez - Especialista
  },
  
  // Aves
  { 
    id: '10', 
    nombre: 'Piolín', 
    edad: '3 años', 
    raza: 'Canario', 
    color: 'Amarillo', 
    tamaño: 'Muy pequeño', 
    vacunado: false, 
    descripcion: 'Canta hermoso por las mañanas, alegra cualquier hogar.', 
    imagen: getImageForAnimal('ave'), 
    especie: 'ave',
    contacto: contactos.empresas[3] // Santuario de Aves
  },
  { 
    id: '11', 
    nombre: 'Pepe', 
    edad: '1 año', 
    raza: 'Periquito', 
    color: 'Verde y azul', 
    tamaño: 'Pequeño', 
    vacunado: false, 
    descripcion: 'Muy sociable, puede aprender a hablar con entrenamiento.', 
    imagen: getImageForAnimal('ave'), 
    especie: 'ave',
    contacto: contactos.personales[3] // Laura Rodríguez - Veterinaria
  },
  { 
    id: '12', 
    nombre: 'Lola', 
    edad: '5 años', 
    raza: 'Loro gris', 
    color: 'Gris con cola roja', 
    tamaño: 'Mediano', 
    vacunado: true, 
    descripcion: 'Inteligente y habladora, ya sabe varias palabras.', 
    imagen: getImageForAnimal('ave'), 
    especie: 'ave',
    contacto: contactos.empresas[3] // Santuario de Aves
  },
];

const Adopta = () => {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [contactoModalVisible, setContactoModalVisible] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [especieSeleccionada, setEspecieSeleccionada] = useState('todas');
  
  // Handle navigation parameters
  useEffect(() => {
    if (route.params?.filtroEspecie) {
      setEspecieSeleccionada(route.params.filtroEspecie);
    }
  }, [route.params]);

  const mascotasFiltradas = especieSeleccionada === 'todas'
    ? todasLasMascotas
    : todasLasMascotas.filter(mascota => mascota.especie === especieSeleccionada);

  const openModal = (mascota) => {
    setSelectedMascota(mascota);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMascota(null);
  };

  const abrirModalContactos = () => {
    setContactoModalVisible(true);
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