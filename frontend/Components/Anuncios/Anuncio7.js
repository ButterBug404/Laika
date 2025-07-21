import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Anuncio7 = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Primeros Auxilios</Text>
          <Text style={styles.content}>
            Conoce los procedimientos básicos de primeros auxilios para mascotas. Aprende qué hacer en caso de heridas, intoxicaciones, golpes de calor y otras emergencias veterinarias hasta llegar al veterinario.
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

export default Anuncio7;
