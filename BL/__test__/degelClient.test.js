import { DegelClient } from '../degelClient';
import MockAsyncStorage from 'mock-async-storage';
import { StorageHelper } from '../storageHelper';
import { AsyncStorage as storage } from 'react-native';



describe('DegelClient', () => {
  beforeAll(() => {
    // record http calls and replay them
    process.env['VCR_MODE'] = 'cache';
    global.fetch = require('fetch-vcr');

    // mock storage
    const mockImpl = new MockAsyncStorage();
    jest.mock('AsyncStorage', () => mockImpl);
  });

  beforeEach(() => {
    jest.restoreAllMocks(); // remove spy implementation between tests
    storage.clear();
  });

  test('#saveCurrentUser authorized', async ()=> {
    fetch.configure({
      fixturePath: './_fixtures/authorized/'
    });

    await StorageHelper.set('access_token', '4b876303-d8ad-4aa8-b832-390315e2e029');
    await DegelClient.saveCurrentUser();

    _cip = await StorageHelper.get('cip');
    _id = await StorageHelper.get('id');

    expect(_cip).toBe('girp2705');
  });

  test('#saveCurrentUser unauthorized', async () => {
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await StorageHelper.set('access_token', '55e85473-1094-4607-b0bb-81b18e1e7b1b');
    await DegelClient.saveCurrentUser();
    
    _cip = await StorageHelper.get('cip');
    _id = await StorageHelper.get('id');

    expect(_cip).toBeUndefined();
    expect(_id).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });
});