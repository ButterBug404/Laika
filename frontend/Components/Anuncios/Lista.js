import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Lista_Anuncios = () => {
  const navigation = useNavigation();
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ButterBug404/ejemplo_de_un_json/refs/heads/main/anuncios.json');
        const data = await response.json();
        setSecciones(data.secciones);
      } catch (e) {
        setError('No se pudieron cargar los anuncios. ');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncios();
  }, []);

  const renderAnuncio = (anuncio) => (
    <TouchableOpacity
      key={anuncio.id}
      style={styles.anuncioItem}
      onPress={() => navigation.navigate('AnuncioDetalle', { anuncioId: anuncio.id, titulo: anuncio.titulo })}
    >
      <Text style={styles.anuncioTitulo}>{anuncio.titulo}</Text>
      <Text style={styles.anuncioDescripcion}>{anuncio.descripcion}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#b04f4f" />
        <Text style={styles.mensaje}>Cargando anuncios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.mainTitle}>Lista de Anuncios</Text>
          
          {secciones.map((seccion, index) => (
            <View key={index} style={styles.seccion}>
              <Text style={styles.seccionTitulo}>{seccion.titulo}</Text>
              {seccion.anuncios.map(renderAnuncio)}
            </View>
          ))}
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
  mensaje: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginVertical: 20,
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
    color: 'black',
    lineHeight: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Lista_Anuncios;
