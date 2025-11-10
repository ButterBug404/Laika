import store from '../utils/store.js';

import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getMascotas = async () => {
  try {
    const token = await store.getValueFor('jwt');
    const response = await axios.get(`${API_URL}/api/get_pets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
};

export const getMascotaById = async (id) => {
  try {
    const token = await store.getValueFor('jwt');
    const response = await axios.get(`${API_URL}/api/get_pet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching pet with id ${id}:`, error);
    return null;
  }
};

export const registerAlert = async (alertData) => {
  try {
		console.log(alertData);
    const token = await store.getValueFor('jwt');
    const response = await axios.post(`${API_URL}/api/register_alert`, alertData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering alert:', error);
    return null;
  }
};



export const updateMascotaData = async (id, newData) => {
  try {
    const token = await store.getValueFor('jwt');
    const formData = new FormData();

    for (const key in newData) {
      if (key === 'face_image' && newData[key] && newData[key].startsWith('file:')) {
        formData.append('faceImage', {
          uri: newData[key],
          type: 'image/jpeg',
          name: 'face_image.jpg',
        });
      } else if (key === 'images' && Array.isArray(newData[key])) {
        newData[key].forEach((image, index) => {
          if (image.startsWith('file:')) {
            formData.append('images', {
              uri: image,
              type: 'image/jpeg',
              name: `pet_image_${index}.jpg`,
            });
          }
        });
      } else {
        formData.append(key, newData[key]);
      }
    }

    const response = await axios.put(`${API_URL}/api/update_pet/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating pet data with id ${id}:`, error);
    return null;
  }
};

export const addMascota = async (newMascota) => {
  try {
    const token = await store.getValueFor('jwt');
    const response = await axios.post(`${API_URL}/api/register_pet`, newMascota, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding new pet:', error);
    return null;
  }
};

export const deleteMascota = async (id) => {
  try {
    const token = await store.getValueFor('jwt');
    const response = await axios.delete(`${API_URL}/delete_pet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting pet with id ${id}:`, error);
    return null;
  }
};

export const deletePetAlert = async (id) => {
  try {
    const token = await store.getValueFor('jwt');
    const response = await axios.delete(`${API_URL}/delete_pet_alert/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting pet alert with id ${id}:`, error);
    return null;
  }
};

export const getAdoptionPets = async () => {
	try {
		const token = await store.getValueFor('jwt');
		const response = await axios.get(`${API_URL}/api/adoption`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching adoption pets:', error);
		return [];
	}
};
