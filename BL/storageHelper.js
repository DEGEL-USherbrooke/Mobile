import { AsyncStorage } from 'react-native';

class StorageHelper {
  static async set(name, value) {
    item = await AsyncStorage.getItem(name);

    if (item) {
      await this.remove(name);
    }
    
    await AsyncStorage.setItem(name, value);
  }

  static async get(name) {
    return await AsyncStorage.getItem(name);
  }

  static async remove(name) {
    await AsyncStorage.removeItem(name);
  }
}

export { StorageHelper };