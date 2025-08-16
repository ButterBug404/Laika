import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const Creditos = () => {
  const credits = [
    {
      tipo: 'Patrocinador',
      nombre: 'Empresa XYZ',
      descripcion: 'Patrocinador principal del proyecto',
      github: null, // No GitHub para empresas patrocinadoras
    },
    {
      tipo: 'Desarrollador',
      nombre: 'Juan Pérez',
      descripcion: 'Desarrollador frontend',
      github: 'https://github.com/juanperez',
    },
    {
      tipo: 'Organización',
      nombre: 'Fundación ABC',
      descripcion: 'Apoyo técnico y recursos',
      github: 'https://github.com/fundacionabc',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créditos:</Text>
      {credits.map((credito, index) => (
        <View key={index} style={styles.creditItem}>
          <Text style={styles.tipo}>{credito.tipo}</Text>
          <Text>Nombre: {credito.nombre}</Text>
          <Text>Descripción: {credito.descripcion}</Text>
          {credito.github && <Text>Github: {credito.github}</Text>}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  creditItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  tipo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Creditos;