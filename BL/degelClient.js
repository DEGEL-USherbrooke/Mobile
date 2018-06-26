import { AsyncStorage } from 'react-native';
import { BASE_URL } from '../constants/endpoints';

class DegelClient {

  constructor() {
    this._accessToken = null;
    this._refreshToken = null;
  }

  async init() {
    this._accessToken = await AsyncStorage.getItem('access_token');
    this._refreshToken = await AsyncStorage.getItem('refresh_token');
  }

  // todo : parametrize body and method
  async authFetch(url, method = 'POST') {
    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          Authorization: 'Bearer ' + this._accessToken
        }
      });

      return response.json();

    } catch (error) {
      console.error(error);
    }

    return null;
  }

  async getCurrentUser() {
    currentUser = await this.authFetch(BASE_URL + '/api/user/current', 'GET');
    try {
      await AsyncStorage.setItem('cip', currentUser.cip);
      await AsyncStorage.setItem('id', currentUser.id);
    }
    catch (error) {
      console.log("error : " + currentUser);
    }
    
  }
}

export { DegelClient };