import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current image index
  const images = [
    'https://cdn.dribbble.com/userupload/31327514/file/original-d1987ba9dd857296cec6d191af277cf8.jpg?resize=1504x1128&vertical=center',
    'https://placehold.co/600x400.png',
    'https://cdn.dribbble.com/userupload/16493537/file/original-1fa9e0ee297c3dac63716aacad2ef3c2.jpg?resize=1504x1128&vertical=center',
    'https://cdn.dribbble.com/userupload/5227491/file/original-876bccc45bcc26f66335323dfef3fc37.png?resize=752x564&vertical=center',
  ];

  const scrollViewRef = useRef(null); // Ref for the ScrollView

    // Use useEffect to monitor scrollX and update currentIndex
    useEffect(() => {
        const listener = scrollX.addListener(({ value }) => {
            const index = Math.floor(value / windowWidth);
            if (index !== currentIndex) {
                setCurrentIndex(index);
            }
        });

        return () => {
            scrollX.removeAllListeners();
        };
    }, [scrollX, currentIndex]);

    // Function to handle automatic scrolling and looping
    useEffect(() => {
        let intervalId;

        const startAutoScroll = () => {
            intervalId = setInterval(() => {
                // Calculate the next index
                let nextIndex = (currentIndex + 1) % images.length;

                // Scroll to the next image
                if (scrollViewRef.current) { // Check if scrollViewRef.current is defined
                  scrollViewRef.current.scrollTo({
                    x: nextIndex * windowWidth,
                    animated: true,
                  });
                }

                // Update the current index after the scroll animation starts
                setCurrentIndex(nextIndex);
            }, 5000); // Change slide every 5 seconds (adjust as needed)
        };

        const stopAutoScroll = () => {
            clearInterval(intervalId);
        };

        // Start auto-scrolling when the component mounts
        startAutoScroll();

        // Stop auto-scrolling when the component unmounts or when the user starts scrolling
        return () => {
            stopAutoScroll();
        };
    }, [currentIndex, images.length]); // Add currentIndex and images.length as dependencies

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.containerHome}>
        <ScrollView>
          {/* Carrusel */}
          <Text style={styles.titleHome}>Bienvenidos</Text>
          <Text style={styles.textoHome}>
            Laika es un proyecto hecho por voluntarios, para informar, prevenir y ayuda de encontrar mascotas perdidas o que necesitan un hogar.
          </Text>
          <View style={styles.scrollContainerHome}>
            <ScrollView
              ref={scrollViewRef} // Attach the ref here
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={1}

            >
              {images.map((image, index) => (
                <View key={index} style={{ width: windowWidth, height: 300 }}>
                  <Animated.Image
                    source={{ uri: image }}
                    style={styles.imageHome}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.indicatorContainerHome}>
              {images.map((_, index) => {
                const width = scrollX.interpolate({
                  inputRange: [
                    windowWidth * (index - 1),
                    windowWidth * index,
                    windowWidth * (index + 1),
                  ],
                  outputRange: [8, 16, 8],
                  extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                    inputRange: [
                      windowWidth * (index - 1),
                      windowWidth * index,
                      windowWidth * (index + 1),
                    ],
                    outputRange: [0.5, 1, 0.5], // Opacity varies from 0.5 to 1 to 0.5
                    extrapolate: 'clamp',
                  });
                return <Animated.View key={index} style={[styles.normalDotHome, { width, opacity }]} />;
              })}
            </View>
          </View>

          {/* Sección de adopciones */}
          <Text style={styles.title2Home}>Adopciones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.adopcionScrollHome}>
            <TouchableOpacity onPress={() => navigation.navigate('Adopción')}>
              <View style={styles.boxHome}>
                <Image
                  style={styles.imageboxHome}
                  source={require('../assets/GatoIcon.png')}
                />
                <Text style={styles.cardTextHome}>Gatos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Adopción')}>
              <View style={styles.boxHome}>
                <Image
                  style={styles.imageboxHome}
                  source={require('../assets/PerroIcon.png')}
                />
                <Text style={styles.cardTextHome}>Perros</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Adopción')}>
              <View style={styles.boxHome}>
                <Image
                  style={styles.imageboxHome}
                  source={require('../assets/ConejoIcon.png')}
                />
                <Text style={styles.cardTextHome}>Conejos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Adopción')}>
              <View style={styles.boxHome}>
                <Image
                  style={styles.imageboxHome}
                  source={require('../assets/AveIcon.png')}
                />
                <Text style={styles.cardTextHome}>Aves</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Sección de patrocinadores */}
          <Text style={styles.title2Home}>Patrocinadores</Text>
          <View style={styles.patrocinadoresContainerHome}>
            <Text style={styles.patrocinadoresTextHome}>Patrocinador 1</Text>
<TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/people/VeteriDoocs/100063755374822/?mibextid=LQQJ4d')}>
  <View style={styles.boxHome}>
                <Image
                  style={styles.imagePatrocinador}
                  source={{ uri: 'https://placehold.co/400x400.png' }}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.patrocinadoresTextHome}>Patrocinador 2</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Adopción')}>
              <View style={styles.boxHome}>
                <Image
                  style={styles.imagePatrocinador}
                  source={{ uri: 'https://imgs.search.brave.com/5aUe1OqAMSQUntmkHF4m5nnluOnlvGyzulHcL4_y6wo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2l4c3RhdGlj/LmNvbS9tZWRpYS9l/NGMzOThfZGFmOGQy/MjM2ZjdjNGMzY2Jm/OGVkZDAwOWZmYjZi/Y2R-bXYyLnBuZy92/MS9jcm9wL3hfMCx5/XzQsd18zMDAsaF8x/NjEvZmlsbC93XzI1/NixoXzE0MSxhbF9j/LHFfODUsdXNtXzAu/NjZfMS4wMF8wLjAx/LGVuY19hdmlmLHF1/YWxpdHlfYXV0by9u/dXBlYy1sb2dvLUNB/MEJBMkVFOTYtc2Vl/a2xvZ29fY29tLnBu/Zw' }}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.patrocinadoresTextHome}>Patrocinador 3</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Adopción')}>
              <View style={styles.boxHome}>
                <Image
                  style={styles.imagePatrocinador}
                  source={{ uri: 'https://www.adopta.mx/wp-content/uploads/2018/07/adopta-logo2017-270x90.png' }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainerHome: {
    height: 250,
    overflow: 'hidden',
  },
  textoHome: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    lineHeight: 20,
    fontFamily: 'sans-serif',
    fontWeight: '600',
    textAlign: 'justify', // Justificar el texto
    marginBottom: 20, // Añadir un margen inferior para separar del carrusel
    marginTop: 10, // Añadir un margen superior para separar del título
    marginHorizontal: 20, // Añadir un margen horizontal para que no toque los bordes
    paddingHorizontal: 10, // Añadir un padding horizontal para que el texto no toque los bordes
    fontStyle: 'italic', // Estilo de fuente en cursiva
    textTransform: 'capitalize', // Capitalizar la primera letra de cada palabra

  },
  titleHome: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 36,
    textAlign: 'center',
    color: '#843947',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  title2Home: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#843947',
  },
  imageHome: {
    width: windowWidth,
    height: '80%',
  },
  imageboxHome: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: 'white',
    resizeMode: 'cover', // Mostrar la imagen completa respetando su relación de aspecto
    
  },
  imagePatrocinador: {
  width: 150,
  height: 100,
  borderRadius: 12,
  marginBottom: 10,
  elevation: 4,
  backgroundColor: "white",
  resizeMode: 'center'
},

  boxHome: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 25,
  },
  cardTextHome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#af4f52',
  },
  indicatorContainerHome: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  normalDotHome: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#e17877',
    marginHorizontal: 4,
  },
  adopcionScrollHome: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  tituloDatosMascotasHome: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF6F61',
  },
  datosContainerHome: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  datosTextHome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tituloPatrocinadoresHome: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  patrocinadoresContainerHome: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  patrocinadoresTextHome: {
    fontSize: 18,
    color: '#8f7b86',
    textAlign: 'center',
    marginVertical: 5,
    fontWeight: 'bold',
  },
});

export default Home;
