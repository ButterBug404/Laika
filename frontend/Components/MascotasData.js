// This file will serve as a central place to store and share mascotas data

// Initial mascotas data
let mascotas = [
  {
    id: '1',
    nombre: 'Firulais',
    edad: '2 años',
    raza: 'Golden Retriever',
    estado: 'Presente',
    imagen: 'https://imgs.search.brave.com/ZafHjAFOxVGuNnA9MVvKkjxki8VGsscankVblDP-lbg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzExLzM1LzY1LzMz/LzM2MF9GXzExMzU2/NTMzODJfQ0pEZmc4/R3hCMEljalhIOFVi/QmRUYk1DRE8yb213/YnYuanBn',
    tipoRegistro: 'perdida',
    especie: 'perro',
    color: 'Dorado',
    tamaño: 'Grande',
    descripcion: 'Perro muy amigable y juguetón',
    contacto: 'Contactar através del perfil',
    vacunado: true,
    fechaRegistro: new Date().toISOString(),
    ubicacion: {
      latitude: 19.4326,
      longitude: -99.1332,
      direccion: 'Ciudad de México'
    }
  },
  {
    id: '2',
    nombre: 'Luna',
    edad: '1 año',
    raza: 'Pastor Alemán',
    estado: 'Desaparecido',
    imagen: 'https://imgs.search.brave.com/NCAUWm_n09bDpCb1rqmrjsoyzNHj41b6HuhxpA9K3jY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50Lm5hdGlvbmFs/Z2VvZ3JhcGhpYy5j/b20uZXMvbWVkaW8v/MjAyNC8wNy8wNS9v/am9zLXBlcnJvcy00/XzVlY2YxYjFhXzI0/MDcwNTA4NDE0OF84/MDB4ODAwLmpwZw',
    tipoRegistro: 'perdida',
    especie: 'perro',
    color: 'Negro',
    tamaño: 'Grande',
    descripcion: 'Mascota muy cariñosa, responde a su nombre. Llevaba collar azul cuando desapareció.',
    contacto: 'Contactar através del perfil',
    vacunado: true,
    fechaRegistro: new Date().toISOString(),
    ultimaVezVisto: 'Hace 2 días',
    ubicacionPerdida: 'Parque Central, Guadalajara',
    recompensa: '$500 MXN',
    ubicacion: {
      latitude: 20.6597,
      longitude: -103.3496,
      direccion: 'Parque Central, Guadalajara'
    }
  },
  {
    id: '3',
    nombre: 'Max',
    edad: '3 años',
    raza: 'Labrador',
    estado: 'Presente',
    imagen: 'https://imgs.search.brave.com/-QvVD1JB8mK_vBIdzVGSHS6ROqbb2QkLHxrVsERFE-o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4Lzk3LzIwLzc0/LzM2MF9GXzg5NzIw/NzQ4OV9pSGtqOFZF/ZVI1aUJXZ2NpdHEx/MVJDYXZvbU1WTU13/VS5qcGc',
    tipoRegistro: 'perdida',
    especie: 'perro',
    color: 'Marrón',
    tamaño: 'Grande',
    descripcion: 'Perro muy tranquilo y obediente',
    contacto: 'Contactar através del perfil',
    vacunado: true,
    fechaRegistro: new Date().toISOString(),
    ubicacion: {
      latitude: 19.4326,
      longitude: -99.1332,
      direccion: 'Ciudad de México'
    }
  },
];

// Add detailed information for missing pets
const addMissingPetDetails = () => {
  mascotas.forEach(mascota => {
    if (mascota.estado === 'Desaparecido') {
      mascota.ultimaVezVisto = mascota.ultimaVezVisto || 'Hace 2 días';
      mascota.ubicacionPerdida = mascota.ubicacionPerdida || 'Parque Central, Guadalajara';
      mascota.descripcion = mascota.descripcion || 'Mascota muy cariñosa, responde a su nombre. Llevaba collar azul cuando desapareció.';
      mascota.contacto = mascota.contacto || 'Contactar através del perfil';
      mascota.recompensa = mascota.recompensa || '$500 MXN';
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
      contacto: newData.contacto || mascota.contacto,
      recompensa: newData.recompensa || mascota.recompensa,
      ultimaVezVisto: newData.ultimaVezVisto || mascota.ultimaVezVisto,
      ubicacionPerdida: newData.ubicacionPerdida || mascota.ubicacionPerdida,
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
