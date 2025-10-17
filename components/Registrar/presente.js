import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, TextInput, Switch, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { razasPerro, razasGato, razasConejo, razasAve, colores, ColorPoodle, ColorChihuahua, EspecieIcon } from '../Registrar';
import { addMascota } from '../MascotasData';

const Presente = () => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [color, setColor] = useState('');
  const [tamano, setTamano] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [esterilizado, setEsterilizado] = useState(false);
  const [chip, setChip] = useState('');
  const [vacunas, setVacunas] = useState(false);
  const [foto, setFoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegistrar = () => {
    // ...handle registration logic, similar to the 'presente' case in Registrar.js...
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Registrar Mascota Presente</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          value={nombre}
          onChangeText={setNombre}
        />
        <Picker
          selectedValue={especie}
          onValueChange={(itemValue) => setEspecie(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una especie" value="" />
          <Picker.Item label="Perro" value="perro" />
          <Picker.Item label="Gato" value="gato" />
          <Picker.Item label="Conejo" value="conejo" />
          <Picker.Item label="Ave" value="ave" />
        </Picker>
        {/* ...rest of the form inputs for raza, color, tamaño, edad, sexo, etc... */}
        <TouchableOpacity onPress={handleRegistrar} style={styles.button}>
          <Text style={styles.buttonText}>Registrar Mascota</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Mascota registrada con éxito!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(false);
              // ...navigate to another screen or reset form...
            }}
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
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
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
});

export default Presente;
