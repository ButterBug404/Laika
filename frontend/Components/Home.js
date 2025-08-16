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
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from './UserContext';

const { width: windowWidth } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const { userProfile, getFullName } = useUser();
  const colorIcon = "#000000"
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current image index
  const icons_home_size = 40; // Variable para el tamaño de los iconos
  const images = [
    'https://placehold.co/600x400.png',
    'https://placehold.co/600x400.png',
    'https://placehold.co/600x400.png',
    'https://placehold.co/600x400.png',
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
          {/* User Profile Section */}
          <View style={styles.welcomeSection}>
            <Image 
              source={{ uri: userProfile.profileImage }} 
              style={styles.profileImageHome} 
            />
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.titleHome}>Bienvenido</Text>
              <Text style={styles.userNameHome}>{userProfile.nombre}</Text>
            </View>
          </View>

          {/* Carrusel */}
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
              {images.map((image, index) => {
                const anuncioScreens = ['Anuncio1', 'Anuncio2', 'Anuncio3', 'Anuncio4'];
                return (
                  <View key={index} style={styles.imageContainerHome}>
                    <TouchableOpacity onPress={() => navigation.navigate(anuncioScreens[index])}>
                      <Animated.Image
                        source={{ uri: image }}
                        style={styles.imageHome}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
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

          <Text style={styles.textoHome}>
            Laika es un proyecto hecho por voluntarios, para informar, prevenir y ayuda de encontrar mascotas perdidas o que necesitan un hogar.
          </Text>

          {/* Botón para ver lista de anuncios */}
          <TouchableOpacity 
            style={styles.anunciosButtonHome}
            onPress={() => navigation.navigate('Lista')}
          >
            <Text style={styles.anunciosButtonTextHome}>Ver Todos los Anuncios</Text>
          </TouchableOpacity>

          {/* Sección de navegación principal */}
          <Text style={styles.title2Home}>Navegación</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.adopcionScrollHome}>

            <TouchableOpacity onPress={() => navigation.navigate('Mascotas')}>
              <View style={styles.boxHome}>
                <Ionicons name="paw-sharp" size={icons_home_size} color="#e07978" style={styles.navigationIconHome} />
                <Text style={styles.cardTextHome}>Mascotas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Registrar')}>
              <View style={styles.boxHome}>
                <Ionicons name="add-circle-sharp" size={icons_home_size} color="#e07978" style={styles.navigationIconHome} />
                <Text style={styles.cardTextHome}>Registrar</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Lista')}>
              <View style={styles.boxHome}>
                <Ionicons name="newspaper-sharp" size={icons_home_size} color="#e07978" style={styles.navigationIconHome} />
                <Text style={styles.cardTextHome}>Anuncios</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Adopción')}>
              <View style={styles.boxHome}>
                <Ionicons name="heart-sharp" size={icons_home_size} color="#e07978" style={styles.navigationIconHome} />
                <Text style={styles.cardTextHome}>Adopción</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Creditos')}>
              <View style={styles.boxHome}>
                <Ionicons name="people-sharp" size={icons_home_size} color="#e07978" style={styles.navigationIconHome} />
                <Text style={styles.cardTextHome}>Créditos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
              <View style={styles.boxHome}>
                <Ionicons name="person-sharp" size={icons_home_size} color="#e07978" style={styles.navigationIconHome} />
                <Text style={styles.cardTextHome}>Perfil</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Sección de adopciones */}
          <Text style={styles.title2Home}>Adopciones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.adopcionScrollHome}>
            <TouchableOpacity onPress={() => navigation.navigate('Adopción', { filtroEspecie: 'perro' })}>
              <View style={styles.boxHome}>
                <Image
                  style={styles.imageboxHome}
                  source={require('../assets/PerroIcon.png')}
                />
                <Text style={styles.cardTextHome}>Perros</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Adopción', { filtroEspecie: 'gato' })}>
              <View style={styles.boxHome}>
                <Image
                  style={styles.imageboxHome}
                  source={require('../assets/GatoIcon.png')}
                />
                <Text style={styles.cardTextHome}>Gatos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Adopción', { filtroEspecie: 'conejo' })}>
              <View style={styles.boxHome}>
                <Image
                  style={styles.imageboxHome}
                  source={require('../assets/ConejoIcon.png')}
                />
                <Text style={styles.cardTextHome}>Conejos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Adopción', { filtroEspecie: 'ave' })}>
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
            
            {/* Primera fila de patrocinadores */}
            <View style={styles.filaPatrocinadoresHome}>
              <View style={styles.patrocinadorHome}>
                <Text style={styles.patrocinadoresTextHome}>VeteriDoc's</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/people/VeteriDoocs/100063755374822/?mibextid=LQQJ4d')}>
                  <View style={styles.boxPatrocinadorHome}>
                    <Image
                      style={styles.imagePatrocinador}
                      source={{ uri: 'https://scontent.fgdl5-4.fna.fbcdn.net/v/t39.30808-6/347241556_1066020577691416_3857840419303509910_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=lBqBKYJ5UEYQ7kNvwGe7-2T&_nc_oc=AdnSODeescpsx9wrJKHgv9TxqphH-DRPW4yaYgojHlalLa0lbkBph3kui1oYtjsg1KlI6m9bfeWJtciw_AU5dgKF&_nc_zt=23&_nc_ht=scontent.fgdl5-4.fna&_nc_gid=P3I-Q2hf19DplvxajIWYkw&oh=00_AfSycZlj5BQk6_bJXAVRuT687gxG4xNpYlrBVvu6rpplNQ&oe=687B0466' }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.patrocinadorHome}>
                <Text style={styles.patrocinadoresTextHome}>Nupec</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://nupec.com/home-en/')}>
                  <View style={styles.boxPatrocinadorHome}>
                    <Image
                      style={styles.imagePatrocinador}
                      source={{ uri: 'https://imgs.search.brave.com/5aUe1OqAMSQUntmkHF4m5nnluOnlvGyzulHcL4_y6wo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMud2l4c3RhdGlj/LmNvbS9tZWRpYS9l/NGMzOThfZGFmOGQy/MjM2ZjdjNGMzY2Jm/OGVkZDAwOWZmYjZi/Y2R-bXYyLnBuZy92/MS9jcm9wL3hfMCx5/XzQsd18zMDAsaF8x/NjEvZmlsbC93XzI1/NixoXzE0MSxhbF9j/LHFfODUsdXNtXzAu/NjZfMS4wMF8wLjAx/LGVuY19hdmlmLHF1/YWxpdHlfYXV0by9u/dXBlYy1sb2dvLUNB/MEJBMkVFOTYtc2Vl/a2xvZ29fY29tLnBu/Zw' }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Segunda fila de patrocinadores */}
            <View style={styles.filaPatrocinadoresHome}>
              <View style={styles.patrocinadorHome}>
                <Text style={styles.patrocinadoresTextHome}>Adopta GDL</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.adopta.mx/')}>
                  <View style={styles.boxPatrocinadorHome}>
                    <Image
                      style={styles.imagePatrocinador}
                      source={{ uri: 'https://www.adopta.mx/wp-content/uploads/2018/07/adopta-logo2017-270x90.png' }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.patrocinadorHome}>
                <Text style={styles.patrocinadoresTextHome}>Adopta un amigo</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://adoptandounamigo.mx/')}>
                  <View style={styles.boxPatrocinadorHome}>
                    <Image
                      style={styles.imagePatrocinador}
                      source={{ uri: 'https://adoptandounamigo.mx/wp-content/uploads/2023/08/Alogosinfondo.png' }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

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
    height: windowWidth * 0.67, // Responsive height based on 600x400 aspect ratio
    overflow: 'hidden',
    marginBottom: 10,
  },
  imageContainerHome: {
    width: windowWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    textTransform: 'capitalize', // Capitalizar la primera letra de cada palabra

  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  profileImageHome: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#e07978',
    marginRight: 15,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  titleHome: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#000000ff',
    fontFamily: 'sans-serif',
    marginBottom: 5,
  },
  userNameHome: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  title2Home: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#843947',
  },
  imageHome: {
    width: windowWidth * 0.95, // 95% of screen width with padding
    height: (windowWidth * 0.95) * (400/600), // Maintain 600x400 aspect ratio
    borderRadius: 12,
  },
  imageboxHome: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 15,
    resizeMode: 'contain',
    borderWidth: 2.5,
    borderColor: '#843947',
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
    color: '#000',
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
  filaPatrocinadoresHome: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  patrocinadorHome: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  boxPatrocinadorHome: {
    alignItems: 'center',
  },
  patrocinadoresTextHome: {
    fontSize: 18,
    color: '#8f7b86',
    textAlign: 'center',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  anunciosButtonHome: {
    backgroundColor: '#000000ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  anunciosButtonTextHome: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navigationIconHome: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 75,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default Home;
