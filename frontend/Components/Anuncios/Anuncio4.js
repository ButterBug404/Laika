import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Anuncio4 = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Anuncio 4</Text>
          <Text style={styles.content}>
            Contenido del cuarto anuncio sobre cuidado de mascotas y servicios veterinarios.
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

export default Anuncio4;
