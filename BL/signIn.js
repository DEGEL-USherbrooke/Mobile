import { oauth_token_uri, AUTHORIZE_HEADER } from '../constants/endpoints';
import { AsyncStorage } from 'react-native';

async function requestTokensWithCode(code) {
  console.log("requestTokensWithCode : " + code);

  try {

    let response = await fetch(oauth_token_uri(code), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + AUTHORIZE_HEADER
      }
    });

    let responseJson = await response.json();

    // extract tokens
    accessToken = responseJson.access_token;
    refreshToken = responseJson.refresh_token;

    // save tokens to storage
    await AsyncStorage.setItem('access_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);

  } catch (error) {
    console.error(error);
  }
}

async function signOut() {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('refresh_token');
  await AsyncStorage.removeItem('cip');
  await AsyncStorage.removeItem('id');
}

module.exports = { 
  requestTokensWithCode,
  signOut
};