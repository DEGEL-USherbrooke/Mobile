import { AsyncStorage } from 'react-native';
import { BASE_URL } from '../constants/endpoints';

class DegelClient {

  // todo : parametrize body and method
  static async authorizedFetch(url, method = 'POST', body = null) {
    _accessToken = await AsyncStorage.getItem('access_token');

    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          Accept: '*/*',
          Authorization: 'Bearer ' + _accessToken,
          'Content-Type': 'application/json'
        },
        body: body
      });

      return response.json();

    } catch (error) {
      console.error(error);
    }

    return null;
  }

  static async saveCurrentUser() {
    currentUser = await this.authorizedFetch(BASE_URL + '/api/user/current', 'GET');
    try {
      await AsyncStorage.setItem('cip', currentUser.cip);
      await AsyncStorage.setItem('id', currentUser.id);
    }
    catch (error) {
      console.log("error : " + currentUser);
    }
    
  }

  static async getSettingsStatus() {
    _id = await AsyncStorage.getItem('id');
    settingsStateResponse = await this.authorizedFetch(BASE_URL + '/api/user/' + _id + '/settings', 'GET');
    
    settingsState = {
      notification: false
    }

    try {
      settingsState.notification = settingsStateResponse.notifications.mobile;
    }
    catch(error) {
      console.log("something went wrong : ");
      console.log(settingsStateResponse);
    }

    return settingsState;
  }

  static async setSettingsStatus(notification = false) {
    _id = await AsyncStorage.getItem('id');

    settingsState = {
      "notifications": {
        "mobile": notification
      }
    }

    response = await this.authorizedFetch(
      BASE_URL + '/api/user/' + _id + '/settings', 
      'POST', 
      JSON.stringify(settingsState)
    );

    console.log(response);
  }
}

export { DegelClient };