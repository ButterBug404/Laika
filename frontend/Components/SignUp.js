import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from './Estilos/Estilos';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Registro = ({ onCancel }) => {
	const [locations, setLocations] = useState({ estados: [] });
	const [selectedEstado, setSelectedEstado] = useState('');
	const [selectedMunicipio, setSelectedMunicipio] = useState('Selecciona Municipio');
	const [correo, setCorreo] = useState('');
	const [nombre, setNombre] = useState('');
	const [apellidoPaterno, setApellidoPaterno] = useState('');
	const [apellidoMaterno, setApellidoMaterno] = useState('');
	const [telefono, setTelefono] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [image, setImage] = useState(null);

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				const response = await fetch('https://raw.githubusercontent.com/ButterBug404/ejemplo_de_un_json/refs/heads/main/lugares.json');
				const data = await response.json();
				setLocations(data);
			} catch (error) {
				Alert.alert("Error", "No se pudieron cargar las ubicaciones.");
			}
		};
		fetchLocations();
	}, []);

	const validatePassword = (password) => {
		const passwordPattern = /^(?=.*[A-Z]).{6,}$/;
		return passwordPattern.test(password);
	};

	const getMunicipiosByEstado = (estado) => {
		if (!locations.estados || locations.estados.length === 0) {
			return ['Selecciona Municipio'];
		}
		const estadoData = locations.estados.find(e => e.nombre === estado);
		return estadoData ? ['Selecciona Municipio', ...estadoData.municipios] : ['Selecciona Municipio'];
	};

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos');
			return;
		}
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});
		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const removeImage = () => {
		setImage(null);
		Alert.alert("Foto eliminada", "La foto de perfil ha sido eliminada");
	};

	const handleRegister = async () => {
		if (
			!correo ||
			!password ||
			!nombre ||
			!apellidoPaterno ||
			!apellidoMaterno ||
			!telefono ||
			!selectedEstado ||
			selectedEstado === 'Selecciona Estado' ||
			!selectedMunicipio ||
			selectedMunicipio === 'Selecciona Municipio'
		) {
			Alert.alert('Error', 'Por favor, completa todos los campos correctamente.');
			return;
		}

		if (!validatePassword(password)) {
			setPasswordError('La contraseña debe tener al menos 6 caracteres y una mayúscula.');
			return;
		}

		if (password !== confirmPassword) {
			setPasswordError('La contraseña no coincide.');
			return;
		}

		try {
			const response = await fetch(`${apiUrl}/api/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: nombre,
					pat_name: apellidoPaterno,
					mat_name: apellidoMaterno,
					email: correo,
					password: password,
					phone: telefono,
					state: selectedEstado,
					municipality: selectedMunicipio,
					image: image || null,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				Alert.alert('Registro exitoso', 'Se ha registrado exitosamente.');
				// reset form
				setCorreo('');
				setPassword('');
				setConfirmPassword('');
				setNombre('');
				setApellidoPaterno('');
				setApellidoMaterno('');
				setTelefono('');
				setSelectedEstado('');
				setSelectedMunicipio('Selecciona Municipio');
				setPasswordError('');
				setImage(null);
				if (onCancel) onCancel();
			} else {
				Alert.alert('Error', data.error || 'Algo salió mal al registrar el usuario.');
			}
		} catch (err) {
			console.log(err);
			Alert.alert('Error', 'No se pudo conectar al servidor.');
		}
	};


  return (
    <>
      <View style={{ alignItems: 'center', marginVertical: 15 }}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 10,
                borderWidth: 2,
                borderColor: '#b04f4f',
              }}
            />
          ) : (
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: '#f0f0f0',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                borderWidth: 2,
                borderColor: '#b04f4f',
              }}
            >
              <Ionicons name="camera" size={40} color="#b04f4f" />
            </View>
          )}
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={pickImage}>
            <Text style={{ color: '#b04f4f', fontWeight: 'bold', marginRight: image ? 10 : 0 }}>
              {image ? 'Cambiar foto' : 'Añadir foto de perfil'}
            </Text>
          </TouchableOpacity>
          {image && (
            <TouchableOpacity 
              onPress={removeImage}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: '#ffebeb',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 15,
                marginLeft: 5
              }}
            >
              <Ionicons name="trash-outline" size={16} color="#b04f4f" style={{ marginRight: 5 }} />
              <Text style={{ color: '#b04f4f', fontWeight: 'bold' }}>
                Eliminar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TextInput
        placeholder="Nombre"
        style={styles.input}
        placeholderTextColor="#888888"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Apellido Paterno"
        style={styles.input}
        placeholderTextColor="#888888"
        value={apellidoPaterno}
        onChangeText={setApellidoPaterno}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Apellido Materno"
        style={styles.input}
        placeholderTextColor="#888888"
        value={apellidoMaterno}
        onChangeText={setApellidoMaterno}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        placeholderTextColor="#888888"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Teléfono"
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#888888"
        value={telefono}
        onChangeText={setTelefono}
      />
      <Picker
        selectedValue={selectedEstado}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setSelectedEstado(itemValue);
          setSelectedMunicipio('Selecciona Municipio');
        }}>
        <Picker.Item label="Selecciona Estado" value="" />
        {locations.estados.map((estado, index) => (
          <Picker.Item
            key={index}
            label={estado.nombre}
            value={estado.nombre}
          />
        ))}
      </Picker>
      {selectedEstado && selectedEstado !== 'Selecciona Estado' && (
        <Picker
          selectedValue={selectedMunicipio}
          style={styles.picker}
          onValueChange={setSelectedMunicipio}>
          {getMunicipiosByEstado(selectedEstado).map((municipio, index) => (
            <Picker.Item
              key={index}
              label={municipio}
              value={municipio}
            />
          ))}
        </Picker>
      )}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          style={styles.inputPassword}
          placeholderTextColor="#888888"
          value={password}
          autoCapitalize="none"
          onChangeText={(text) => {
            setPassword(text);
            if (confirmPassword && text !== confirmPassword) {
              setPasswordError('La contraseña no coincide');
            } else {
              setPasswordError('');
            }
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#000000"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirmar contraseña"
          secureTextEntry={!showPassword}
          style={styles.inputPassword}
          placeholderTextColor="#888888"
          value={confirmPassword}
          autoCapitalize="none"
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (password && text !== password) {
              setPasswordError('La contraseña no coincide');
            } else {
              setPasswordError('');
            }
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="#000000"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      <Text style={styles.passwordHint}>
        La contraseña debe tener al menos 6 caracteres y una mayúscula.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={password !== confirmPassword || !password || !confirmPassword}
      >
        <Text style={styles.buttonText}>
          Registrarse
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default Registro;
