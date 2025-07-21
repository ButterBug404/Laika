import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Anuncio5 = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Nutrición Animal</Text>
          <Text style={styles.content}>
            La alimentación balanceada es fundamental para la salud de tu mascota. Aquí encontrarás información sobre los nutrientes esenciales, tipos de alimento según la edad y raza, y consejos para establecer horarios de comida saludables.
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

export default Anuncio5;
