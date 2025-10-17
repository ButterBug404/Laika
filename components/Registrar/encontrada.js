import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, TextInput, Picker, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { razasPerro, razasGato, razasConejo, razasAve, colores, ColorPoodle, ColorChihuahua, EspecieIcon } from '../Registrar';
import { addMascota } from '../MascotasData';

const Encontrada = () => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [color, setColor] = useState('');
  const [tamano, setTamano] = useState('');
  const [sexo, setSexo] = useState('');
  const [edad, setEdad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    // ...código para cargar razas, colores, etc., según la especie seleccionada...
  }, [especie]);

  const manejarRegistro = () => {
    // ...código para manejar el registro de la mascota encontrada...
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Registrar Mascota Encontrada</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <Picker
          selectedValue={especie}
          style={styles.picker}
          onValueChange={(itemValue) => setEspecie(itemValue)}
        >
          <Picker.Item label="Seleccione una especie" value="" />
          <Picker.Item label="Perro" value="perro" />
          <Picker.Item label="Gato" value="gato" />
          <Picker.Item label="Conejo" value="conejo" />
          <Picker.Item label="Ave" value="ave" />
        </Picker>
        {/* ...resto de los campos del formulario... */}
        <TouchableOpacity style={styles.button} onPress={manejarRegistro}>
          <Text style={styles.buttonText}>Registrar Encontrada</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={mostrarModal}
        onRequestClose={() => setMostrarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mascota Registrada</Text>
            <TouchableOpacity onPress={() => setMostrarModal(false)}>
              <Text style={styles.closeButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
  },
  container: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Encontrada;
