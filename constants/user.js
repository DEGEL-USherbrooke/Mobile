import { AsyncStorage } from 'react-native';

class User {
  constructor() {
    this._cip = 'not defined';
    this._id = 'not defined';
  }

  static async sync() {
    this._cip = await AsyncStorage.getItem('cip');
    this._id = await AsyncStorage.getItem('id');
  }

  static getCip() {
    return this._cip;
  }
  
  static getId() {
    return this._id;
  }
}

export { User };