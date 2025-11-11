import store from '../utils/store.js';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const translateSpecies = (species) => {
	switch (species) {
		case 'perro':
			return 'DOG';
		case 'gato':
			return 'CAT';
		case 'ave':
			return 'BIRD';
		case 'conejo':
			return 'BUNNY';
		default:
			return species;
	}
};

const translateAgeUnit = (ageUnit) => {
	switch (ageUnit) {
		case 'años':
			return 'YEARS';
		case 'meses':
			return 'MONTHS';
		default:
			return ageUnit;
	}
};

const translateSex = (sex) => {
	switch (sex) {
		case 'macho':
			return 'MALE';
		case 'hembra':
			return 'FEMALE';
		case 'desconocido':
			return 'UNKNOWN';
		default:
			return sex;
	}
};

const translateSize = (size) => {
	switch (size) {
		case 'pequeño':
			return 'SMALL';
		case 'mediano':
			return 'MEDIUM';
		case 'grande':
			return 'BIG';
		default:
			return size;
	}
};

const translateContactMethod = (contactMethod) => {
	switch (contactMethod) {
		case 'whatsapp':
			return 'WHATSAPP';
		case 'correo':
			return 'EMAIL';
		case 'ambos':
			return 'BOTH';
		default:
			return contactMethod;
	}
};

const translateRecordType = (recordType) => {
	switch (recordType) {
		case 'presente':
			return 'PRESENT';
		case 'perdida':
			return 'LOST';
		case 'adopcion':
			return 'ADOPTION';
		case 'encontrada':
			return 'FOUND';
		default:
			return recordType;
	}
};

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

export const addMascota = async (petData) => {
	try {
		const token = await store.getValueFor('jwt');
		const formData = new FormData();

		formData.append('record_type', translateRecordType(petData.tipoRegistro));
		formData.append('name', petData.nombre);
		formData.append('species', translateSpecies(petData.especie));
		formData.append('breed', petData.raza);
		formData.append('color', petData.color);
		formData.append('age', petData.edad);
		formData.append('age_unit', translateAgeUnit(petData.edadUnidad));
		formData.append('sex', translateSex(petData.sexo));
		formData.append('size', translateSize(petData.tamaño));
		formData.append('vaccinated', petData.vacunado);
		formData.append('skin_condition', petData.enfermedadPiel);
		formData.append('contact_info', petData.contacto);
		formData.append('contact_method', translateContactMethod(petData.metodoContacto));
		formData.append('description', petData.descripcion);

		if (petData.tipoRegistro === 'perdida') {
			formData.append('has_reward', petData.tieneRecompensa === 'si');
			formData.append('time', petData.ultimaVezVisto);
			formData.append('last_seen_location', `${petData.ubicacion.longitude}, ${petData.ubicacion.latitude}`);
		}

		petData.imagenes.forEach((uri, index) => {
			const uriParts = uri.split('.');
			const fileType = uriParts[uriParts.length - 1];
			formData.append('images', {
				uri,
				name: `photo_${index}.${fileType}`,
				type: `image/${fileType}`,
			});
		});

		if (petData.imagencara) {
			const uriParts = petData.imagencara.split('.');
			const fileType = uriParts[uriParts.length - 1];
			formData.append('faceImage', {
				uri: petData.imagencara,
				name: `face.${fileType}`,
				type: `image/${fileType}`,
			});
		}

		const response = await axios.post(`${API_URL}/api/register_pet`, formData, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'multipart/form-data',
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
		const response = await axios.delete(`${API_URL}/api/delete_pet/${id}`, {
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
		const response = await axios.delete(`${API_URL}/api/delete_pet_alert/${id}`, {
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

export const getMatches = async () => {
	try {
		const token = await store.getValueFor('jwt');
		const response = await axios.get(`${API_URL}/api/matches`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log("cum: ", response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching matches:', error);
		return [];
	}
};

export const deleteAdoption = async (petId) => {
	try {
		const token = await store.getValueFor('jwt');
		const response = await axios.delete(`${API_URL}/api/adoption/${petId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error(`Error deleting adoption for pet with id ${petId}:`, error);
		return null;
	}
};
