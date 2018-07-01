import { oauth_token_uri, AUTHORIZE_HEADER } from '../constants/endpoints';
import { StorageHelper } from './storageHelper';
import { DegelClient } from './degelClient';

class Session {
  // returns true when log in is sucessful
  // returns false otherwise
  static async logIn() {
    _user = await DegelClient.getCurrentUser();

    if (_user.id && _user.cip) {
      Session._id = _user.id;
      Session._cip = _user.cip;
      return true;
    }

    Session._id = 'undefined';
    Session._cip = 'undefined';
    return false;

  }

  static async logOut() {
    Session._id = 'undefined';
    Session._cip = 'undefined';
    await StorageHelper.remove('access_token');
    await StorageHelper.remove('refresh_token');
  }
}
Session._id = 'undefined';
Session._cip = 'undefined';

export { Session };