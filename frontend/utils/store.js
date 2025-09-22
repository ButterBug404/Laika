import * as SecureStore from 'expo-secure-store';

const store = {
  async save(key, value) {
    await SecureStore.setItemAsync(key, value);
  },
  async getValueFor(key) {
    return await SecureStore.getItemAsync(key);
  }
};

export default store;
