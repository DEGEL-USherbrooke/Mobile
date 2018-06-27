import { StorageHelper } from './storageHelper';
import { BASE_URL } from '../constants/endpoints';

class DegelClient {
  static async authorizedFetch(url, method = 'POST', body = null) {
    _accessToken = await StorageHelper.get('access_token');

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

    if (currentUser.cip !== undefined && currentUser.id !== undefined){
      await StorageHelper.set('cip', currentUser.cip);
      await StorageHelper.set('id', currentUser.id);
    } else {
      console.log("error : ");
      console.log(currentUser);
    }
  }

  static async getSettingsStatus() {
    _id = await StorageHelper.get('id');

    if (_id == undefined) {
      console.log('No user_id was set - please sign out');
    }

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
    _id = await StorageHelper.get('id');

    if (_id == undefined) {
      console.log('No user_id was set - please sign out');
    }

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
