import React, { useState, useEffect, useRef } from 'react';
import { 
  Text, 
  TextInput, 
  View, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Switch,
  Dimensions,
  Animated, 
  Modal
} from 'react-native';
import { Image } from 'expo-image';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { addMascota } from '../MascotasData'; // Import the function to add new pets
import Presente from './presente';
import Perdida from './perdida';
import Encontrada from './encontrada';
import R_Adopcion from './r_adopcion';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Define breed lists for each species
export const razasPerro = [
  'Selecciona una raza',
  'Mestizo',
  'Chihuahua',
  'Poodle', 
  'Labrador Retriever',
  'Golden Retriever',
  'Pug',
  'Pomeranian',
  'Otro/Desconocido'
];

export const razasGato = [
  'Selecciona una raza',
  'Siamés',
  'Persa',
  'American Shorthair',
  'Gato Bombay',
  'Azul Ruso',
  'Esfinge',
  'Mestizo',
  'Otro/Desconocido'
];

export const razasConejo = [
  'Selecciona una raza',
  'Cabeza de León',
  'Conejo Enano o Toy',
  'Mini Lop',
  'Conejo Rex',
  'Mestizo',
  'Otro/Desconocido'
];

export const razasAve = [
  'Selecciona una raza',
  'Gallina/Gallo',
  'Pato',
  'Ganso',
  'Canario', 
  'Perico',
  'Perico Australiano',
  'Cacatúa', 
  'Guacamayo',  
  'Ninfa', 
  'Otro/Desconocido'
];

// Define color options with their corresponding color codes
export const colores = [
  { label: 'Selecciona un color', value: '', color: '#transparent', imagenColor: 'https://imgs.search.brave.com/i96_j2mllX9hm98UoJW2ye89TYUi-BLWTiev7UVVm2k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdw/cm94eS5kb21lc3Rp/a2Eub3JnL3Vuc2Fm/ZS9zOjEyODoxMjgv/cnM6ZmlsbC9leDp0/cnVlL2VsOnRydWUv/cGxhaW4vc3JjOi8v/YXZhdGFycy8wMDYv/MDkwLzc5NC82MDkw/Nzk0LW9yaWdpbmFs/LnBuZz8xNjE0MDU1/NzU0' },
  { label: 'Negro', value: 'Negro', color: '#000000', imagenColor: 'https://imgs.search.brave.com/uh84bAITfa4o5Vp9C3vUcnQEJ8iTLTRMaMmZCp0e5rc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzcyL2E2/L2ZkLzcyYTZmZDhk/ZTIxN2EzZjhlNWMx/YzJmZjBjNjM4NTVj/LmpwZw' },
  { label: 'Blanco', value: 'Blanco', color: '#FFFFFF', imagenColor: 'https://example.com/blanco.png' },
  { label: 'Marrón', value: 'Marrón', color: '#8B4513', imagenColor: 'https://example.com/marron.png' },
  { label: 'Gris', value: 'Gris', color: '#808080', imagenColor: 'https://example.com/gris.png' },
  { label: 'Dorado', value: 'Dorado', color: '#FFD700', imagenColor: 'https://example.com/dorado.png' },
  { label: 'Crema', value: 'Crema', color: '#F5F5DC', imagenColor: 'https://example.com/crema.png' },
  { label: 'Atigrado', value: 'Atigrado', color: '#D2691E', imagenColor: 'https://example.com/otro_multicolor.png' },
  { label: 'Manchado', value: 'Manchado', color: '#F4A460', imagenColor: 'https://example.com/otro_multicolor.png' },
  { label: 'Tricolor', value: 'Tricolor', color: '#8B4513', imagenColor: 'https://example.com/otro_multicolor.png' },
  { label: 'Anaranjado', value: 'Anaranjado', color: '#FF4500', imagenColor: 'https://example.com/anaranjado.png' },
  { label: 'Otro/Multicolor', value: 'Otro/Multicolor', color: '#FF69B4', imagenColor: 'https://example.com/otro_multicolor.png' }
];

export const ColorPoodle = [
  { label: 'Selecciona un color', value: '', color: '#transparent', imagenColor: 'https://imgs.search.brave.com/i96_j2mllX9hm98UoJW2ye89TYUi-BLWTiev7UVVm2k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdw/cm94eS5kb21lc3Rp/a2Eub3JnL3Vuc2Fm/ZS9zOjEyODoxMjgv/cnM6ZmlsbC9leDp0/cnVlL2VsOnRydWUv/cGxhaW4vc3JjOi8v/YXZhdGFycy8wMDYv/MDkwLzc5NC82MDkw/Nzk0LW9yaWdpbmFs/LnBuZz8xNjE0MDU1/NzU0' },
  { label: 'Negro', value: 'Negro', color: '#000000', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793428_Fv25RqTIKJQkBHu.png' },
  { label: 'Blanco', value: 'Blanco', color: '#FFFFFF', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793452_bMTxEAnKV9ri4JM.png' },
  { label: 'Marrón', value: 'Marrón', color: '#8B4513', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793460_cLJemfghY8LlD7e.png' },
  { label: 'Gris', value: 'Gris', color: '#808080', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793468_Pij6iFrV2lYHXof.png' },
  { label: 'Beige', value: 'Beige', color: '#F5F5DC', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793539_jHpgYkWiTRnbZGm.png' },
  { label: 'Apricot/Rojo', value: 'Rojo', color: '#D2B48C', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793554_QYEqnHCYd2p2rPw.png' },
  { label: 'Tricolor', value: 'Tricolor', color: '#8B4513', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793483_yI7vuxPb4KzPZPL.png' },
  { label: 'Tuxtedo', value: 'Tuxtedo', color: '#000000 y #FFFFFF', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793523_yJ4EqNm6qPcauXf.png' },
  { label: 'Particolor', value: 'Particolor', color: '#D3D3D3', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793508_i9qLfwGcMUKfADr.png' },
  { label: 'Otro', value: 'Otro', color: '#A9A9A9', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793480_4H5Z5H5H5H5H5H5.png' }
];

export const ColorChihuahua = [
  { label: 'Selecciona un color', value: '', color: '#transparent', imagenColor: 'https://imgs.search.brave.com/i96_j2mllX9hm98UoJW2ye89TYUi-BLWTiev7UVVm2k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdw/cm94eS5kb21lc3Rp/a2Eub3JnL3Vuc2Fm/ZS9zOjEyODoxMjgv/cnM6ZmlsbC9leDp0/cnVlL2VsOnRydWUv/cGxhaW4vc3JjOi8v/YXZhdGFycy8wMDYv/MDkwLzc5NC82MDkw/Nzk0LW9yaWdpbmFs/LnBuZz8xNjE0MDU1/NzU0' },
  { label: 'Crema o beige', value: 'Crema o beige', color: '#F5F5DC', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793539_jHpgYkWiTRnbZGm.png' },
  { label: 'Negro', value: 'Negro', color: '#000000', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793428_Fv25RqTIKJQkBHu.png' },
  { label: 'Leonado (Fawn)', value: 'Leonado (Fawn)', color: '#E5AA70', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793554_QYEqnHCYd2p2rPw.png' },
  { label: 'Chocolate o marrón', value: 'Chocolate o marrón', color: '#8B4513', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793460_cLJemfghY8LlD7e.png' },
  { label: 'Rojo o cobre', value: 'Rojo o cobre', color: '#B55239', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793554_QYEqnHCYd2p2rPw.png' },
  { label: 'Azul o gris', value: 'Azul o gris', color: '#808080', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793468_Pij6iFrV2lYHXof.png' },
  { label: 'Negro y fuego (Black and tan)', value: 'Negro y fuego (Black and tan)', color: '#000000', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793523_yJ4EqNm6qPcauXf.png' },
  { label: 'Azul y fuego (Blue and tan)', value: 'Azul y fuego (Blue and tan)', color: '#808080', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793477_5H5H5H5H5H5H5H.png' },
  { label: 'Chocolate y fuego (Chocolate and tan)', value: 'Chocolate y fuego (Chocolate and tan)', color: '#8B4513', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793483_yI7vuxPb4KzPZPL.png' },
  { label: 'Particolor (manchado)', value: 'Particolor (manchado)', color: '#D3D3D3', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793508_i9qLfwGcMUKfADr.png' }
];

export const ColorPug = [
  { label: 'Selecciona un color', value: '', color: '#transparent', imagenColor: 'https://imgs.search.brave.com/i96_j2mllX9hm98UoJW2ye89TYUi-BLWTiev7UVVm2k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdw/cm94eS5kb21lc3Rp/a2Eub3JnL3Vuc2Fm/ZS9zOjEyODoxMjgv/cnM6ZmlsbC9leDp0/cnVlL2VsOnRydWUv/cGxhaW4vc3JjOi8v/YXZhdGFycy8wMDYv/MDkwLzc5NC82MDkw/Nzk0LW9yaWdpbmFs/LnBuZz8xNjE0MDU1/NzU0' },
  { label: 'Negro', value: 'Negro', color: '#000000', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793428_Fv25RqTIKJQkBHu.png' },
  { label: 'Albaricoque', value: 'Albaricoque', color: '#FBCEB1', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793452_bMTxEAnKV9ri4JM.png' },
]

export const ColorPoredarian = [
  { label: 'Selecciona un color', value: '', color: '#transparent', imagenColor: 'https://imgs.search.brave.com/i96_j2mllX9hm98UoJW2ye89TYUi-BLWTiev7UVVm2k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdw/cm94eS5kb21lc3Rp/a2Eub3JnL3Vuc2Fm/ZS9zOjEyODoxMjgv/cnM6ZmlsbC9leDp0/cnVlL2VsOnRydWUv/cGxhaW4vc3JjOi8v/YXZhdGFycy8wMDYv/MDkwLzc5NC82MDkw/Nzk0LW9yaWdpbmFs/LnBuZz8xNjE0MDU1/NzU0' },
  { label: 'Negro', value: 'Negro', color: '#000000', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793428_Fv25RqTIKJQkBHu.png' },
  { label: 'Albaricoque', value: 'Albaricoque', color: '#FBCEB1', imagenColor: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106793452_bMTxEAnKV9ri4JM.png' },
]

export const EspecieIcon = ({ name, size = 30, size2 = 42, color = "black", style }) => {
  switch (name) {
    case 'perro':
      return <FontAwesome5 name="dog" size={size} color={color} style={style} />;
    case 'gato':
      return <FontAwesome5 name="cat" size={size} color={color} style={style} />;
    case 'ave':
      return <FontAwesome5 name="dove" size={size} color={color} style={style} />;
    case 'conejo':
      return <MaterialCommunityIcons name="rabbit" size={size2} color={color} style={style} />;
    default:
      return <Ionicons name="paw-outline" size={size} color={color} style={style} />;
  }
};

const Registrar = () => {
  const [tipoRegistro, setTipoRegistro] = useState('presente');
  
  // Only keep the registration type picker and delegate the rest
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Tipo de Registro: <Text style={styles.asterisk}>*</Text></Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoRegistro}
            style={styles.picker}
            onValueChange={(itemValue) => setTipoRegistro(itemValue)}
          >
            <Picker.Item label="Selecciona una opción" value="" />
            <Picker.Item label="Registrar Mascota Presente" value="presente" />
            <Picker.Item label="Perdí mi mascota" value="perdida" />
            <Picker.Item label="Encontré una mascota" value="encontrada" />
            <Picker.Item label="Ofrecer en adopción" value="adopcion" />
          </Picker>
        </View>
        {/* Render the corresponding registration form */}
        {tipoRegistro === 'presente' && <Presente />}
        {tipoRegistro === 'perdida' && <Perdida />}
        {tipoRegistro === 'encontrada' && <Encontrada />}
        {tipoRegistro === 'adopcion' && <R_Adopcion />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efedeaff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  asterisk: {
    color: 'red',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden', // Ensures the Picker respects the border radius
  },
  picker: {
    backgroundColor: 'transparent', // To see the container's background
    borderWidth: 0, // Handled by container
    fontWeight: 'bold',
  },

});

export default Registrar;