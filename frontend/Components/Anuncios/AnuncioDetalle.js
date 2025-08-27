import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

const AnuncioDetalle = () => {
  const route = useRoute();
  const { anuncioId } = route.params;
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnuncio = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ButterBug404/ejemplo_de_un_json/refs/heads/main/anuncios.json');
        const data = await response.json();
        let foundAnuncio = null;
        for (const seccion of data.secciones) {
          foundAnuncio = seccion.anuncios.find(a => a.id === anuncioId);
          if (foundAnuncio) break;
        }
        
        if (foundAnuncio) {
          setAnuncio(foundAnuncio);
        } else {
          setError('Anuncio no encontrado. ');
        }
      } catch (e) {
        setError('No se pudo cargar el anuncio. ');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncio();
  }, [anuncioId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#843947" />
      </View>
    );
  }

  if (error || !anuncio) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'No se pudo cargar el contenido. '}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>{anuncio.titulo}</Text>
          <Text style={styles.content}>{anuncio.contenido}</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    fontSize: 16,
    color: '#843947',
  },
});

export default AnuncioDetalle;
