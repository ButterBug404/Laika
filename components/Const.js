// Listas de razas por especie
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

// Colores generales
export const colores = [
  { label: 'Selecciona un color', value: '', color: '#transparent', imagenColor: 'URL' },
  { label: 'Negro', value: 'Negro', color: '#000000', imagenColor: 'URL' },
  { label: 'Blanco', value: 'Blanco', color: '#FFFFFF', imagenColor: 'URL' },
  { label: 'Marrón', value: 'Marrón', color: '#8B4513', imagenColor: 'URL' },
  { label: 'Gris', value: 'Gris', color: '#808080', imagenColor: 'URL' },
  // ...el resto igual
];

// Colores específicos
export const ColorPoodle = [/* ...igual que antes */];
export const ColorChihuahua = [/* ...igual que antes */];
export const ColorPug = [/* ...igual que antes */];
export const ColorPoredarian = [/* ...igual que antes */];

// ICONO DE ESPECIE
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
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