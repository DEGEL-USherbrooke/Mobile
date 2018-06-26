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

    console.log("access_token : " + accessToken)
    console.log("refresh_token : " + refreshToken)

    // save tokens to storage
    await AsyncStorage.setItem('access_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);

  } catch (error) {
    console.error(error);
  }
}

module.exports = { 
  requestTokensWithCode
};