import * as SecureStore from 'expo-secure-store';

const store = {
  async save(key, value) {
    await SecureStore.setItemAsync(key, value);
  },
  async getValueFor(key) {
    return await SecureStore.getItemAsync(key);
  },
	async delete(key) {
		await SecureStore.deleteItemAsync(key);

	}
};

export default store;
