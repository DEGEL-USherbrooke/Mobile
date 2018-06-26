import { oauth_token_uri, AUTHORIZE_HEADER } from '../constants/endpoints';
import { StorageHelper } from './storageHelper';

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
    await StorageHelper.set('access_token', accessToken);
    await StorageHelper.set('refresh_token', refreshToken);

    console.log("here");

  } catch (error) {
    console.error(error);
  }
}

async function signOut() {
  await StorageHelper.remove('access_token');
  await StorageHelper.remove('refresh_token');
  await StorageHelper.remove('cip');
  await StorageHelper.remove('id');
}

module.exports = { 
  requestTokensWithCode,
  signOut
};