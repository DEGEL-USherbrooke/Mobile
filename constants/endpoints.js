const PUSH_ENDPOINT = '127.0.0.1/';

// oauth construction
const OAUTH_AUTHORIZE_URI = 'https://s6iprojet02.gel.usherbrooke.ca/oauth/authorize';
const OAUTH_TOKEN_URI = 'https://s6iprojet02.gel.usherbrooke.ca/oauth/token'
const CLIENT_ID = 'R9HZLN7GMLET8PB7JQWJ963N9A5ML7';
const CALLBACK_URI = 'https://s6iprojet02.gel.usherbrooke.ca/oauth/callback';
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

module.exports = {
  PUSH_ENDPOINT,
  OAUTH_AUTHORIZE_URI,
  OAUTH_TOKEN_URI,
  CLIENT_ID,
  CALLBACK_URI,
  AUTHORIZE_HEADER,
  oauth_authorize_uri,
  oauth_token_uri
}