import { StorageHelper } from './storageHelper';
import { BASE_URL,
  oauth_token_uri,
  oauth_refresh_uri,
  AUTHORIZE_HEADER,
  push_endpoint } from '../constants/endpoints';
import { Session } from './session';
import { Permissions, Notifications } from 'expo';

class DegelClient {
  static async basicAuthFetch(url, method = 'POST', body = null) {
    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          Accept: 'application/json',
          Authorization: 'Basic ' + AUTHORIZE_HEADER,
        },
        body: body
      });

      return response.json();

    } catch (error) {
      return {};
    }

  }

  static async requestAndSaveAccessTokensWithCode(code) {
    console.log('Code : ' + code);
    _tokens = await this.basicAuthFetch(oauth_token_uri(code));

    // save access and refresh tokens to local storage of the device
    if (_tokens.access_token && _tokens.refresh_token) {
      console.log('access token : ' + _tokens.access_token);
      console.log('refresh token : ' + _tokens.refresh_token);
      await StorageHelper.set('access_token', _tokens.access_token);
      await StorageHelper.set('refresh_token', _tokens.refresh_token);
      Session._expiry = _tokens.expires_in;
    }
    else {
      console.log('error : ');
      console.log(_tokens);
    }

  }

  // returns  true if the refresh is successful
  //          false if the refresh fails
  static async refreshAccessToken() {
    _refreshToken = await StorageHelper.get('refresh_token');

    if (_refreshToken == undefined) {
      console.log('refresh token does not exists');
      return false;
    }

    _tokens = await this.basicAuthFetch(oauth_refresh_uri(_refreshToken));

        // save access and refresh tokens to local storage of the device
    if (_tokens.access_token && _tokens.refresh_token) {
      console.log("Refreshed tokens");
      console.log('access token : ' + _tokens.access_token);
      console.log('refresh token : ' + _tokens.refresh_token);

      await StorageHelper.set('access_token', _tokens.access_token);
      await StorageHelper.set('refresh_token', _tokens.refresh_token);
      Session._expiry = _tokens.expires_in;

      return true;
    }

    return false;
  }

  // ACCESS API PROTECTED REGION ON DEGEL SERVER

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
      return {};
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

  static async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    console.log('expo notif token : ' + token);

    return await this.authorizedFetch(
      push_endpoint(Session._id),
      'POST',
      JSON.stringify({expoToken: token})
    );
  }

  static async getCalendarEvents() {
    return await this.authorizedFetch(BASE_URL + '/api/user/' + Session._id + '/calendar', 'GET');
  }

}

export { DegelClient };
