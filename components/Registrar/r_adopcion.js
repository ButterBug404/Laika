import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, TextInput, Picker, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { razasPerro, razasGato, razasConejo, razasAve, colores, ColorPoodle, ColorChihuahua, EspecieIcon } from '../Registrar';
import { addMascota } from '../MascotasData';

const R_Adopcion = () => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [color, setColor] = useState('');
  const [tamano, setTamano] = useState('');
  const [edad, setEdad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const manejarRegistro = () => {
    // Lógica para manejar el registro de la mascota
    // ...validaciones y procesamiento de datos...

    // Simular registro exitoso
    setMensajeExito('¡Registro exitoso!');
    setMostrarModal(true);

    // Reiniciar formulario
    setNombre('');
    setEspecie('');
    setRaza('');
    setColor('');
    setTamano('');
    setEdad('');
    setDescripcion('');
    setFoto(null);
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Registrar Mascota para Adopción</Text>
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
        <Picker.Item label="Seleccione una especie" value="" />
        <Picker.Item label="Perro" value="perro" />
        <Picker.Item label="Gato" value="gato" />
        <Picker.Item label="Conejo" value="conejo" />
        <Picker.Item label="Ave" value="ave" />
      </Picker>
      {/* ...otros campos del formulario... */}
      <TouchableOpacity style={styles.button} onPress={manejarRegistro}>
        <Text style={styles.buttonText}>Registrar Mascota</Text>
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
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default R_Adopcion;
