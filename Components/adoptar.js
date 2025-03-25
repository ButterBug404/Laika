import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Modal, Pressable, Button, ScrollView } from 'react-native';

const imgNodisponible = 'https://cdn.dribbble.com/userupload/6113043/file/original-b2a7a299d9bba74d1d4ea1fed5457051.png?resize=1200x900&vertical=center';

const mascotas = [
  { id: '1', nombre: 'Firulais', edad: '2 años', raza: 'Golden Retriever', color: 'Dorado', tamaño: 'Grande', vacunado: true, descripcion: 'Es muy juguetón y le encanta jugar con niños y agua.', imagen: imgNodisponible },
  { id: '2', nombre: 'Luna', edad: '1 año', raza: 'Pastor Alemán', color: 'Negro y fuego', tamaño: 'Grande', vacunado: true, descripcion: 'Muy inteligente y protectora, ideal para entrenar.', imagen: imgNodisponible },
  { id: '3', nombre: 'Max', edad: '3 años', raza: 'Labrador', color: 'Chocolate', tamaño: 'Grande', vacunado: false, descripcion: 'Cariñoso y sociable, le encanta correr y jugar con pelotas.', imagen: imgNodisponible },
  { id: '4', nombre: 'Nina', edad: '4 años', raza: 'Poodle', color: 'Blanco', tamaño: 'Mediano', vacunado: true, descripcion: 'Tranquila y obediente, ideal para casas pequeñas.', imagen: imgNodisponible },
];
const Adopta = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState(null);

  const openModal = (mascota) => {
    setSelectedMascota(mascota);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMascota(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adopción</Text>
      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => openModal(item)}>
            <Image source={{ uri: item.imagen }} style={styles.imagen} />
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.detalle}>Edad: {item.edad}</Text>
            <Text style={styles.detalle}>Raza: {item.raza}</Text>
          </Pressable>
        )}
      />

      {/* Modal con ScrollView */}
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
                <Image source={{ uri: selectedMascota.imagen }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedMascota.nombre}</Text>
                <Text style={styles.modalDetail}>Edad: {selectedMascota.edad}</Text>
                <Text style={styles.modalDetail}>Raza: {selectedMascota.raza}</Text>
                <Text style={styles.modalDetail}>Color: {selectedMascota.color}</Text>
                <Text style={styles.modalDetail}>Tamaño: {selectedMascota.tamaño}</Text>
                <Text style={styles.modalDetail}>Vacunado: {selectedMascota.vacunado ? 'Sí' : 'No'}</Text>
                <Text style={styles.modalDetail}>Descripción: {selectedMascota.descripcion}</Text>
                <Button title="Adoptar" onPress={() => alert('¡Gracias por querer adoptar a ' + selectedMascota.nombre + '!')} />
                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </ScrollView>
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
    color: '#555',
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
    backgroundColor: '#ff5c5c',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Adopta;
