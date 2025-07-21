import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Anuncio8 = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Vacunación</Text>
          <Text style={styles.content}>
            Mantén al día el calendario de vacunas de tu mascota. Información completa sobre vacunas obligatorias y opcionales, frecuencia de aplicación y la importancia de la prevención de enfermedades.
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#843947',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: 'black',
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default Anuncio8;
