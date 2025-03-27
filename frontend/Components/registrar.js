// RegistroMascotaPerdida.js
import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

const RegistroMascotaPerdida = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [color, setColor] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [contacto, setContacto] = useState('');
  const [imagen, setImagen] = useState(null);
  const [estadoDesaparecido, setEstadoDesaparecido] = useState(true); // true = desaparecido, false = encontrado
  const [fechaDesaparicion, setFechaDesaparicion] = useState('');
  const [horaDesaparicion, setHoraDesaparicion] = useState('');
  const [motivoDesaparicion, setMotivoDesaparicion] = useState('');
  const [tipoRegistro, setTipoRegistro] = useState('perdida'); // 'perdida' o 'encontrada'

  const handleRegistro = () => {
    if (nombre && edad && especie && color && contacto && (tipoRegistro === 'perdida' ? ubicacion && fechaDesaparicion && motivoDesaparicion : true)) {
      Alert.alert(
        'Registro Exitoso',
        `¡Se ha registrado a ${nombre} como ${tipoRegistro === 'perdida' ? 'desaparecido' : 'encontrado'}!`,
      );
      console.log({ nombre, edad, especie, raza, color, ubicacion, contacto, imagen, estadoDesaparecido, fechaDesaparicion, motivoDesaparicion });
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
    }
  };

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permiso.granted) {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!resultado.canceled) {
        setImagen(resultado.assets[0].uri);
      }
    } else {
      Alert.alert('Permiso Denegado', 'Se necesita acceso a tu galería para seleccionar una imagen.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Registro de Mascota {tipoRegistro === 'perdida' ? 'Perdida' : 'Encontrada'}</Text>
      {/* Tipo de registro */}
      <Text style={styles.label}>Tipo de Registro:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoRegistro}
          onValueChange={(itemValue) => setTipoRegistro(itemValue)}
        >
          <Picker.Item label="Perdí una mascota" value="perdida" />
          <Picker.Item label="Encontré una mascota" value="encontrada" />
        </Picker>
      </View>

      {/* Nombre de la mascota */}
      <Text style={styles.label}>Nombre de la Mascota:</Text>
      <TextInput style={styles.input} placeholder="Ingresa el nombre" value={nombre} onChangeText={setNombre} />

      {/* Edad */}
      <Text style={styles.label}>Edad (en años):</Text>
      <TextInput style={styles.input} placeholder="Ejemplo: 3" keyboardType="numeric" value={edad} onChangeText={setEdad} />
      {/* Especie*/}
      <Text style={styles.label}>Especie:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={especie} onValueChange={(itemValue) => setEspecie(itemValue)}>
          <Picker.Item label="Selecciona una especie" value="" />
          <Picker.Item label="Perro" value="Perro" />
          <Picker.Item label="Gato" value="Gato" />
          <Picker.Item label="Conejo" value="Conejo" />
          <Picker.Item label="Ave" value="Ave" />
        </Picker>
      </View>

      {tipoRegistro === 'perdida' && (
        <>
          <Text style={styles.label}>Última Ubicación:</Text>
          <TextInput style={styles.input} placeholder="Ejemplo: Parque Central" value={ubicacion} onChangeText={setUbicacion} />

          <Text style={styles.label}>Fecha de Desaparición:</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={fechaDesaparicion} onChangeText={setFechaDesaparicion} />

          <Text style={styles.label}>Hora de Desaparición:</Text>
          <TextInput style={styles.input} placeholder="HH:MM" value={horaDesaparicion} onChangeText={setHoraDesaparicion} />

          <Text style={styles.label}>Motivo de Desaparición:</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={motivoDesaparicion} onValueChange={setMotivoDesaparicion}>
              <Picker.Item label="Robado" value="Robado" />
              <Picker.Item label="Extraviado" value="Extraviado" />
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>Foto de la Mascota:</Text>
      <TouchableOpacity style={styles.button} onPress={seleccionarImagen}>
        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {imagen && <Image source={{ uri: imagen }} style={styles.imagen} />}

      <TouchableOpacity style={styles.button} onPress={handleRegistro}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '90%',
    backgroundColor: '#820034',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f2f2f2',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  imagen: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 15,
  },
});

export default RegistroMascotaPerdida;