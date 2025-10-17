import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, TextInput, Picker, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { razasPerro, razasGato, razasConejo, razasAve, colores, ColorPoodle, ColorChihuahua, EspecieIcon } from '../Registrar';
import { addMascota } from '../MascotasData';

const Perdida = () => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [color, setColor] = useState('');
  const [tamano, setTamano] = useState('');
  const [sexo, setSexo] = useState('');
  const [edad, setEdad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [ubicacion, setUbicacion] = useState('');
  const [contacto, setContacto] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const manejarRegistro = () => {
    // ...lógica para manejar el registro de mascota perdida...
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Registrar Mascota Perdida</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la mascota"
        value={nombre}
        onChangeText={setNombre}
      />
      <Picker
        selectedValue={especie}
        style={styles.picker}
        onValueChange={(itemValue) => setEspecie(itemValue)}
      >
        <Picker.Item label="Selecciona la especie" value="" />
        <Picker.Item label="Perro" value="perro" />
        <Picker.Item label="Gato" value="gato" />
        <Picker.Item label="Conejo" value="conejo" />
        <Picker.Item label="Ave" value="ave" />
      </Picker>
      {/* ...otros campos del formulario... */}
      <TouchableOpacity style={styles.button} onPress={manejarRegistro}>
        <Text style={styles.buttonText}>Registrar Perdida</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={mostrarModal}
        onRequestClose={() => setMostrarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{mensajeExito}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setMostrarModal(false)}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
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
    marginBottom: 20,
    textAlign: 'center',
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
    borderRadius: 5,
    paddingVertical: 15,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
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
  modalMessage: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Perdida;
