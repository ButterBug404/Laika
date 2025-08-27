// Add a found pet for testing the match feature
let mascotas = [
  {
    id: '1',
    nombre: 'Laika',
    edad: '15 años',
    raza: 'Poodle',
    estado: 'Desaparecido',
    tipoRegistro: 'normal', // Regular pet registration
    imagencara: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106141835_XolQtUvSjNMtqYw.png',
    imagen: [
      'https://f2.toyhou.se/file/f2-toyhou-se/images/106165585_HHpNKxAWFEirnQL.png',
      'https://f2.toyhou.se/file/f2-toyhou-se/images/106165577_kdJ94HNbowtEydO.png',
      'https://f2.toyhou.se/file/f2-toyhou-se/images/106165593_PShUzjVx7B3rAmt.png'
    ],
    especie: 'perro',
    color: 'Blanco',
    tamaño: 'Grande',
    sexo: 'Hembra',
    descripcion: 'odia jugar con niños y no es cariñosa, le gusta ver telenovelas y comer snacks de pollo deshidratado',
    contacto: 'Whatsapp',
    vacunado: true,
    fechaRegistro: new Date().toISOString(),
    ubicacion: {
      latitude: 19.4326,
      longitude: -99.1332,
      estado_republica: 'Jalisco',
      ciudad: 'Guadalajara',
      direccion: 'Av. Chapultepec 123, Guadalajara'
    },
    ultimaVezVisto: '15/7/2023',
    ubicacionPerdida: 'Parque Colomos, Guadalajara',
    descripcionDesaparicion: 'Se perdió durante un paseo en el parque, se soltó de la correa al perseguir una ardilla.',
    recompensa: '$1000 MXN',
    razonPerdida: 'extravio'
  },
  {
    id: '2',
    edad: '4 años',
    raza: 'Poodle',
    estado: 'Presente',
    tipoRegistro: 'encontrada', // Found pet registration
    imagencara: 'https://f2.toyhou.se/file/f2-toyhou-se/images/106324356_PJzDPABm7XCvlGK.png',
    imagen: [],
    especie: 'perro',
    color: 'Blanco',
    tamaño: 'Mediano',
    sexo: 'Hembra',
    descripcion: 'Encontrada deambulando cerca del parque, muy amigable y cariñosa. Tiene un collar rosado.',
    contacto: 'Whatsapp: 3411279817',
    vacunado: false,
    fechaRegistro: new Date().toISOString(),
    ubicacion: {
      latitude: 19.4340,
      longitude: -99.1350,
      estado_republica: 'Jalisco',
      ciudad: 'Guadalajara',
      direccion: 'Parque Colomos, Zona Norte, Guadalajara'
    },
  }
];

// Add detailed information for missing pets
//

// Add detailed information for missing pets
const addMissingPetDetails = () => {
  mascotas.forEach(mascota => {
    if (mascota.estado === 'Desaparecido') {
      mascota.ultimaVezVisto = mascota.ultimaVezVisto || 'Hace 2 días';
      mascota.ubicacionPerdida = mascota.ubicacionPerdida || 'Parque Central, Guadalajara';
      mascota.descripcion = mascota.descripcion || 'Mascota muy cariñosa, responde a su nombre. Llevaba collar azul cuando desapareció.';
      mascota.descripcionDesaparicion = mascota.descripcionDesaparicion || ''; // Default empty for optional field
      mascota.contacto = mascota.contacto || 'Contactar através del perfil';
      mascota.recompensa = mascota.recompensa || '$500 MXN';
      mascota.razonPerdida = mascota.razonPerdida || 'extravio'; // Default reason if not specified
    }
  });
};

// Update missing pets with additional information
const updateMascotaWithDetails = (id, details) => {
  const mascotaIndex = mascotas.findIndex(m => m.id === id);
  if (mascotaIndex !== -1) {
    mascotas[mascotaIndex] = { ...mascotas[mascotaIndex], ...details };
  }
  return mascotas;
};

// Initialize missing pet details
addMissingPetDetails();

// Function to get all mascotas
export const getMascotas = () => {
  return mascotas;
};

// Function to get a single mascota by id
export const getMascotaById = (id) => {
  return mascotas.find(mascota => mascota.id === id);
};

// Function to update a mascota's state
export const updateMascotaEstado = (id, estado) => {
  mascotas = mascotas.map(mascota => 
    mascota.id === id ? { ...mascota, estado } : mascota
  );
  return mascotas;
};

// Function to update a mascota's data
export const updateMascotaData = (id, newData) => {
  mascotas = mascotas.map(mascota => 
    mascota.id === id ? { 
      ...mascota, 
      nombre: newData.nombre || mascota.nombre,
      edad: newData.edad || mascota.edad,
      raza: newData.raza || mascota.raza,
      color: newData.color || mascota.color,
      tamaño: newData.tamaño || mascota.tamaño,
      descripcion: newData.descripcion || mascota.descripcion,
      descripcionDesaparicion: newData.descripcionDesaparicion !== undefined ? newData.descripcionDesaparicion : mascota.descripcionDesaparicion,
      contacto: newData.contacto || mascota.contacto,
      recompensa: newData.recompensa || mascota.recompensa,
      ultimaVezVisto: newData.ultimaVezVisto || mascota.ultimaVezVisto,
      ubicacionPerdida: newData.ubicacionPerdida || mascota.ubicacionPerdida,
      razonPerdida: newData.razonPerdida || mascota.razonPerdida,
      ubicacion: newData.ubicacion || mascota.ubicacion,
      vacunado: newData.vacunado !== undefined ? newData.vacunado : mascota.vacunado
    } : mascota
  );
  return mascotas;
};

// Function to set the entire mascotas list (for testing or resetting)
export const setMascotasList = (newMascotas) => {
  mascotas = newMascotas;
};

// Function to add a new mascota
export const addMascota = (newMascota) => {
  mascotas.push(newMascota);
  return mascotas;
};