import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {/* Título principal */}
        <Text style={styles.titulo}>Bienvenido a Laika</Text>
        <Text style={styles.bienvenida}>
          Cuidamos de tus mascotas con amor.
        </Text>
        <Text style={styles.mensaje}>
          Encuentra todo lo que necesitas para el bienestar de tus amigos peludos: adopción, cuidados y más.
        </Text>

        {/* Imagen principal */}

        {/* Promociones */}
        <Text style={styles.titulo2}>Anuncios y Promociones</Text>
        <Image
          style={styles.imagedisc}
          source={{
            uri: 'https://cdn.dribbble.com/userupload/18393115/file/original-fb008dece589292713f4d18a636b8a98.png?resize=1200x1200&vertical=center',
          }}
        />
        <Text style={styles.subtitulo}>
          Grandes descuentos en productos para tus mascotas.
        </Text>

        {/* Productos destacados */}
        <ScrollView horizontal style={styles.scrollView}>
          <View style={styles.box}>
            <Image
              style={styles.imagebox}
              source={{
                uri: 'https://imgs.search.brave.com/-QvVD1JB8mK_vBIdzVGSHS6ROqbb2QkLHxrVsERFE-o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4Lzk3LzIwLzc0/LzM2MF9GXzg5NzIw/NzQ4OV9pSGtqOFZF/ZVI1aUJXZ2NpdHEx/MVJDYXZvbU1WTU13/VS5qcGc',
              }}
            />
            <Text>Juguetes para perros</Text>
          </View>
          <View style={styles.box}>
            <Image
              style={styles.imagebox}
              source={{
                uri: 'https://imgs.search.brave.com/NCAUWm_n09bDpCb1rqmrjsoyzNHj41b6HuhxpA9K3jY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50Lm5hdGlvbmFs/Z2VvZ3JhcGhpYy5j/b20uZXMvbWVkaW8v/MjAyNC8wNy8wNS9v/am9zLXBlcnJvcy00/XzVlY2YxYjFhXzI0/MDcwNTA4NDE0OF84/MDB4ODAwLmpwZw',
              }}
            />
            <Text>Rascadores para gatos</Text>
          </View>
          <View style={styles.box}>
            <Image
              style={styles.imagebox}
              source={{
                uri: 'https://imgs.search.brave.com/ZafHjAFOxVGuNnA9MVvKkjxki8VGsscankVblDP-lbg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzExLzM1LzY1LzMz/LzM2MF9GXzExMzU2/NTMzODJfQ0pEZmc4/R3hCMEljalhIOFVi/QmRUYk1DRE8yb213/YnYuanBn',
              }}
            />
            <Text>Comida Premium</Text>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: 'black',
  },
  titulo2: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: 'black'
    //color: '#4682B4', color azul
  },
  bienvenida: {
    fontSize: 19,
    textAlign: 'center',
    color: '#333',
  },
  mensaje: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    color: 'black',
  },
  /*image: {
    width: 380,
    height: 380,
    resizeMode: 'cover',
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 5,
    borderRadius: 10,
  },*/
  imagedisc: {
    width: 400,
    height: 150,
    margin: 10,
    resizeMode: 'cover',
    shadowColor: '#000',
    borderRadius: 10,
  },
  subtitulo: {
    color: 'black',
    paddingHorizontal: 40,
    textAlign: 'center',
  },
  scrollView: {
    marginHorizontal: 20,
  },
  imagebox: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  box: {
    width: 160,
    height: 160,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
