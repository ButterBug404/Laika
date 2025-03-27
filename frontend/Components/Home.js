/****************

    Home.js 

*****************/


import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Adopta from '../Components/adoptar';

const { width: windowWidth } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const images = [
    'https://cdn.dribbble.com/userupload/18393115/file/original-fb008dece589292713f4d18a636b8a98.png?resize=1200x1200&vertical=center',
    'https://cdn.dribbble.com/userupload/5227556/file/original-773985691d2f35a077f36804be0e5cb1.png?resize=752x564&vertical=center',
    'https://cdn.dribbble.com/userupload/5227491/file/original-876bccc45bcc26f66335323dfef3fc37.png?resize=752x564&vertical=center',
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Carrusel */}
          <Text style={styles.titulo}>Bienvenido a Laika</Text>
          <Text style={styles.texto}>
            Entérate de noticias y recomendaciones para que tu peludito tenga los mejores cuidados de la galaxia.
          </Text>
          <View style={styles.scrollContainer}>
            <ScrollView
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
                <View key={index} style={{ width: windowWidth, height: 250 }}>
                  <Animated.Image
                    source={{ uri: image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.indicatorContainer}>
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
                return <Animated.View key={index} style={[styles.normalDot, { width }]} />;
              })}
            </View>
          </View>

          {/* Sección de adopciones */}
          <Text style={styles.titulo2}>Adopciones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.adopcionScroll}>
            <TouchableOpacity onPress={() => navigation.navigate('Adopta', { imageUrl: 'https://cdn.dribbble.com/userupload/4445282/file/original-c24a6cfa139012257cb5b908321ab935.png?resize=1200x900&vertical=center' })}>
  <View style={styles.box}>
    <Image
      style={styles.imagebox}
      source={{ uri: 'https://cdn.dribbble.com/userupload/4445282/file/original-c24a6cfa139012257cb5b908321ab935.png?resize=1200x900&vertical=center' }}
    />
    <Text style={styles.cardText}>Firulais</Text>
  </View>
</TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Adopta')}>
              <View style={styles.box}>
                <Image
                  style={styles.imagebox}
                  source={{ uri: 'https://cdn.dribbble.com/userupload/5101511/file/original-f89c1bd7a513764b7664f0c57c17f32f.png?resize=752x&vertical=center' }}
                />
                <Text style={styles.cardText}>Luna</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Adopta')}>
              <View style={styles.box}>
                <Image
                  style={styles.imagebox}
                  source={{ uri: 'https://cdn.dribbble.com/userupload/6113043/file/original-b2a7a299d9bba74d1d4ea1fed5457051.png?resize=1200x900&vertical=center' }}
                />
                <Text style={styles.cardText}>Max</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    height: 250,
    overflow: 'hidden',
  },
  texto: {
    marginHorizontal: 20,
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
    lineHeight: 24,
  },
  titulo: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 36,
    textAlign: 'center',
    color: '#FF6F61',
  },
  titulo2: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF6F61',
  },
  image: {
    width: windowWidth,
    height: '100%',
  },
  imagebox: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 4,
  },
  box: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 25,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  adopcionScroll: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default Home;