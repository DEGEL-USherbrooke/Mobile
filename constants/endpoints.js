// oauth construction
const BASE_URL = 'https://s6iprojet02.gel.usherbrooke.ca';
const OAUTH_AUTHORIZE_URI = BASE_URL + '/oauth/authorize';
const OAUTH_TOKEN_URI = BASE_URL + '/oauth/token';
const CLIENT_ID = 'R9HZLN7GMLET8PB7JQWJ963N9A5ML7';
const CALLBACK_URI = BASE_URL + '/oauth/callback';
const AUTHORIZE_HEADER = 'UjlIWkxON0dNTEVUOFBCN0pRV0o5NjNOOUE1TUw3Og==';

function oauth_authorize_uri(state) {
  return OAUTH_AUTHORIZE_URI
          + '?client_id=' + CLIENT_ID 
          + '&response_type=code'
          + '&redirect_uri=' + CALLBACK_URI
          + '&state=' + state;
}

function oauth_token_uri(code) {
  return OAUTH_TOKEN_URI 
          + '?grant_type=authorization_code'
          + '&code=' + code
          + '&client_id=' + CLIENT_ID
          + '&redirect_uri=' + CALLBACK_URI;
}

function oauth_refresh_uri(refresh_token) {
  return OAUTH_TOKEN_URI
          + '?grant_type=refresh_token'
          + '&client_id=' + CLIENT_ID
          + '&refresh_token=' + refresh_token;
}

function push_endpoint(user_id) {
  return BASE_URL
          + '/api/user/'
          + user_id
          + '/notification/register'
}

module.exports = {
  BASE_URL,
  OAUTH_AUTHORIZE_URI,
  OAUTH_TOKEN_URI,
  CLIENT_ID,
  CALLBACK_URI,
  AUTHORIZE_HEADER,
  oauth_authorize_uri,
  oauth_token_uri,
  oauth_refresh_uri,
  push_endpoint
}