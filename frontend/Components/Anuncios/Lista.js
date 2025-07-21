import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Lista_Anuncios = () => {
  const navigation = useNavigation();

  const seccion1 = [
    { id: 'Anuncio1', titulo: 'Cuidado Básico de Mascotas', descripcion: 'Guía completa para el cuidado diario' },
    { id: 'Anuncio2', titulo: 'Servicios Veterinarios', descripcion: 'Encuentra el mejor veterinario cerca' },
    { id: 'Anuncio3', titulo: 'Higiene y Limpieza', descripcion: 'Mantén a tu mascota limpia y saludable' },
  ];

  const seccion2 = [
    { id: 'Anuncio4', titulo: 'Adopción Responsable', descripcion: 'Todo lo que necesitas saber antes de adoptar' },
    { id: 'Anuncio5', titulo: 'Nutrición Animal', descripcion: 'Alimentación balanceada para tu mascota' },
    { id: 'Anuncio6', titulo: 'Entrenamiento Canino', descripcion: 'Técnicas básicas de adiestramiento' },
  ];

  const seccion3 = [
    { id: 'Anuncio7', titulo: 'Primeros Auxilios', descripcion: 'Qué hacer en emergencias veterinarias' },
    { id: 'Anuncio8', titulo: 'Vacunación', descripcion: 'Calendario de vacunas para mascotas' },
  ];

  const renderAnuncio = (anuncio) => (
    <TouchableOpacity
      key={anuncio.id}
      style={styles.anuncioItem}
      onPress={() => navigation.navigate(anuncio.id)}
    >
      <Text style={styles.anuncioTitulo}>{anuncio.titulo}</Text>
      <Text style={styles.anuncioDescripcion}>{anuncio.descripcion}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.mainTitle}>Lista de Anuncios</Text>
          
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Sección 1 - Cuidados Básicos</Text>
            {seccion1.map(renderAnuncio)}
          </View>

          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Sección 2 - Adopción y Entrenamiento</Text>
            {seccion2.map(renderAnuncio)}
          </View>

          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Sección 3 - Salud y Emergencias</Text>
            {seccion3.map(renderAnuncio)}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#843947',
    textAlign: 'center',
    marginBottom: 30,
  },
  seccion: {
    marginBottom: 25,
  },
  seccionTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#af4f52',
    marginBottom: 15,
    textAlign: 'center',
  },
  anuncioItem: {
    backgroundColor: '#f6d3c3',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  anuncioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#843947',
    marginBottom: 5,
  },
  anuncioDescripcion: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default Lista_Anuncios;
