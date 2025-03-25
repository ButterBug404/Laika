import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Home = () => {
  const [mascotas, setMascotas] = React.useState([
    {
      id: '1',
      nombre: 'Firulais',
      edad: '2 años',
      raza: 'Golden Retriever',
      estado: 'Presente',
      imagen: 'https://imgs.search.brave.com/ZafHjAFOxVGuNnA9MVvKkjxki8VGsscankVblDP-lbg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzExLzM1LzY1LzMz/LzM2MF9GXzExMzU2/NTMzODJfQ0pEZmc4/R3hCMEljalhIOFVi/QmRUYk1DRE8yb213/YnYuanBn',
    },
    {
      id: '2',
      nombre: 'Luna',
      edad: '1 año',
      raza: 'Pastor Alemán',
      estado: 'Desaparecido',
      imagen: 'https://imgs.search.brave.com/NCAUWm_n09bDpCb1rqmrjsoyzNHj41b6HuhxpA9K3jY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50Lm5hdGlvbmFs/Z2VvZ3JhcGhpYy5j/b20uZXMvbWVkaW8v/MjAyNC8wNy8wNS9v/am9zLXBlcnJvcy00/XzVlY2YxYjFhXzI0/MDcwNTA4NDE0OF84/MDB4ODAwLmpwZw',
    },
    {
      id: '3',
      nombre: 'Max',
      edad: '3 años',
      raza: 'Labrador',
      estado: 'Presente',
      imagen: 'https://imgs.search.brave.com/-QvVD1JB8mK_vBIdzVGSHS6ROqbb2QkLHxrVsERFE-o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4Lzk3LzIwLzc0/LzM2MF9GXzg5NzIw/NzQ4OV9pSGtqOFZF/ZVI1aUJXZ2NpdHEx/MVJDYXZvbU1WTU13/VS5qcGc',
    },
  ]);

  const handleReportarDesaparecido = (id) => {
    // Lógica para cambiar el estado a "Desaparecido"
    const nuevasMascotas = mascotas.map(mascota =>
      mascota.id === id ? { ...mascota, estado: 'Desaparecido' } : mascota
    );
    setMascotas(nuevasMascotas);
  };

  const handleReportarEncontrado = (id) => {
    // Lógica para cambiar el estado a "Presente"
    const nuevasMascotas = mascotas.map(mascota =>
      mascota.id === id ? { ...mascota, estado: 'Presente' } : mascota
    );
    setMascotas(nuevasMascotas);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>Mis Mascotas registradas</Text>
        <View style={styles.verticalContainer}>
          {mascotas.map((mascota) => (
            <View key={mascota.id} style={styles.verticalBox}>
              <Image style={styles.imageVertical} source={{ uri: mascota.imagen }} />
              <View style={styles.verticalTextContainer}>
                <Text style={styles.verticalName}>{mascota.nombre}</Text>
                <Text style={styles.verticalDetail}>Edad: {mascota.edad}</Text>
                <Text style={styles.verticalDetail}>Raza: {mascota.raza}</Text>
                <Text style={styles.verticalDetail}>Estado: {mascota.estado}</Text>
                {mascota.estado === 'Presente' ? (
                  <TouchableOpacity
                    style={styles.botonDesaparecido}
                    onPress={() => handleReportarDesaparecido(mascota.id)}
                  >
                    <Text style={styles.botonTexto}>Reportar como desaparecido</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.botonEncontrado}
                    onPress={() => handleReportarEncontrado(mascota.id)}
                  >
                    <Text style={styles.botonTexto}>Reportar como encontrado</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  verticalContainer: {
    marginTop: 10,
  },
  verticalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageVertical: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  verticalTextContainer: {
    flex: 1,
  },
  verticalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  verticalDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  botonDesaparecido: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  botonEncontrado: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Home;