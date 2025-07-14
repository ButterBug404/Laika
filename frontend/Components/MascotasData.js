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
    tipoRegistro: 'perdida', // Adding the registration type
    especie: 'perro',
  },
  {
    id: '2',
    nombre: 'Luna',
    edad: '1 año',
    raza: 'Pastor Alemán',
    estado: 'Desaparecido',
    imagen: 'https://imgs.search.brave.com/NCAUWm_n09bDpCb1rqmrjsoyzNHj41b6HuhxpA9K3jY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50Lm5hdGlvbmFs/Z2VvZ3JhcGhpYy5j/b20uZXMvbWVkaW8v/MjAyNC8wNy8wNS9v/am9zLXBlcnJvcy00/XzVlY2YxYjFhXzI0/MDcwNTA4NDE0OF84/MDB4ODAwLmpwZw',
    tipoRegistro: 'perdida', // Adding the registration type
    especie: 'perro',
  },
  {
    id: '3',
    nombre: 'Max',
    edad: '3 años',
    raza: 'Labrador',
    estado: 'Presente',
    imagen: 'https://imgs.search.brave.com/-QvVD1JB8mK_vBIdzVGSHS6ROqbb2QkLHxrVsERFE-o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4Lzk3LzIwLzc0/LzM2MF9GXzg5NzIw/NzQ4OV9pSGtqOFZF/ZVI1aUJXZ2NpdHEx/MVJDYXZvbU1WTU13/VS5qcGc',
    tipoRegistro: 'perdida', // Adding the registration type
    especie: 'perro',
  },
];

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
      raza: newData.raza || mascota.raza
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
