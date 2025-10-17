import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';

const Creditos = () => {
  // Estado para almacenar los datos de los créditos
  const [credits, setCredits] = useState([]);
  // Estado para manejar el estado de carga de los datos
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta una vez cuando el componente se monta
  useEffect(() => {
    // Función asíncrona para obtener los datos del JSON
    const fetchCredits = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ButterBug404/ejemplo_de_un_json/refs/heads/main/creditos.json');
        const data = await response.json();
        // Accedemos a la propiedad "creditos" del JSON
        setCredits(data.creditos);
      } catch (error) {
        console.error("Error al cargar los créditos:", error);
      } finally {
        // Establecer loading a false una vez que la carga finaliza (éxito o error)
        setLoading(false);
      }
    };

    fetchCredits();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez

  if (loading) {
    // Mostrar un indicador de carga mientras se obtienen los datos
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando créditos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créditos:</Text>
      {credits.map((credito, index) => (
        <View key={index} style={styles.creditItem}>
          <Text style={styles.tipo}>{credito.tipo}</Text>
          <Text>Nombre: {credito.nombre}</Text>
          <Text>Descripción: {credito.descripcion}</Text>
          {/* Usar "link" en lugar de "github" y asegurar que el link exista antes de mostrarlo */}
          {credito.link && <Text>Link: {credito.link}</Text>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  creditItem: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#b04f4f',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Creditos;
