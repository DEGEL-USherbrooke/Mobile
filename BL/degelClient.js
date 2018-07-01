import { StorageHelper } from './storageHelper';
import { BASE_URL, oauth_token_uri, AUTHORIZE_HEADER } from '../constants/endpoints';
import { Session } from './session';

class DegelClient {
  static async authorizedFetch(url, method = 'POST', body = null) {
    // retreive access token from local storage
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

  static async requestAndSaveAccessTokensWithCode(code) {
    response = await fetch(oauth_token_uri(code), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + AUTHORIZE_HEADER
      }
    });

    responseJson = await response.json();

    // save access and refresh tokens to local storage of thedevice
    if (responseJson.access_token && responseJson.refresh_token) {
      await StorageHelper.set('access_token', responseJson.access_token);
      await StorageHelper.set('refresh_token', responseJson.refresh_token);
    }

  }

  static async getCurrentUser() {
    currentUser = await this.authorizedFetch(BASE_URL + '/api/user/current', 'GET');

    return {
      cip: currentUser.cip,
      id: currentUser.id
    }
  }

  static async getSettingsStatus() {
    if (Session._id == undefined) {
      console.log('No user_id was set - please sign out');
    }

    settingsStateResponse = await this.authorizedFetch(BASE_URL + '/api/user/' + Session._id + '/settings', 'GET');

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

    if (Session._id == undefined) {
      console.log('No user_id was set - please sign out');
    }

    settingsState = {
      "notifications": {
        "mobile": notification
      }
    }

    response = await this.authorizedFetch(
      BASE_URL + '/api/user/' + Session._id + '/settings',
      'POST',
      JSON.stringify(settingsState)
    );

    console.log(response);
  }
}

export { DegelClient };
