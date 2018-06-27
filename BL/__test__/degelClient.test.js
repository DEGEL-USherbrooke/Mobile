import { DegelClient } from '../degelClient';
import MockAsyncStorage from 'mock-async-storage';
import { StorageHelper } from '../storageHelper';
import { AsyncStorage as storage } from 'react-native';
import { Session } from '../session'


describe('DegelClient fetch-vcr', () => {
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

  test('#requestAndSaveAccessTokensWithCode authorized', async ()=> {
    fetch.configure({
      fixturePath: './_fixtures/authorized/'
    });

    await DegelClient.requestAndSaveAccessTokensWithCode('FIMAdB');
    
    _accessToken = await StorageHelper.get('access_token');
    _refreshToken = await StorageHelper.get('refresh_token');

    expect(_accessToken).toBe('51062cb3-009c-4a0f-aa37-77385db9a14f');
    expect(_refreshToken).toBe('90bb4fa5-dcbf-41f0-b273-903b92f973d9');
  });

  test('#requestAndSaveAccessTokensWithCode unauthorized', async ()=> {
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await DegelClient.requestAndSaveAccessTokensWithCode('badcode');

    _accessToken = await StorageHelper.get('access_token');
    _refreshToken = await StorageHelper.get('refresh_token');

    expect(_accessToken).toBe(undefined);
    expect(_refreshToken).toBe(undefined);
  });

  test('#getCurrentUser authorized', async ()=> {
    fetch.configure({
      fixturePath: './_fixtures/authorized/'
    });

    await StorageHelper.set('access_token', '4b876303-d8ad-4aa8-b832-390315e2e029');
    _user = await DegelClient.getCurrentUser();

    expect(_user.cip).toBe('girp2705');
    expect(_user.id).toBe('e4130aaa-f585-4564-b7e6-dce37e58166c');
  });

  test('#getCurrentUser unauthorized', async () => {
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await StorageHelper.set('access_token', '55e85473-1094-4607-b0bb-81b18e1e7b1b');
    _user = await DegelClient.getCurrentUser();

    expect(_user.cip).not.toBeTruthy();
    expect(_user.id).not.toBeTruthy();
  });

  test('#getSettingsStatus authorized', async ()=> {
    fetch.configure({
      fixturePath: './_fixtures/authorized/'
    });

    Session._id = 'e4130aaa-f585-4564-b7e6-dce37e58166c';
    await StorageHelper.set('access_token', 'f6666455-9955-4722-9bcf-658787dabf2a');

    settingsStatus = await DegelClient.getSettingsStatus();

    expect(settingsStatus).toEqual({ notification: true });
  });

  test('#getSettingsStatus unauthorized', async ()=> {
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await StorageHelper.set('access_token', 'bad-token');
    Session._id = 'e4130aaa-f585-4564-b7e6-dce37e58166c';

    settingsStatus = await DegelClient.getSettingsStatus();

    expect(settingsStatus).toEqual({ notification: false });
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  test('#getSettingsStatus unauthorized when id is undefined', async ()=> {
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await StorageHelper.set('access_token', 'f6666455-9955-4722-9bcf-658787dabf2a');
    Session._id = undefined;

    settingsStatus = await DegelClient.getSettingsStatus();

    expect(settingsStatus).toEqual({ notification: false });
    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });

  test('#setSettingsStatus unauthorized', async ()=> {
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await StorageHelper.set('access_token', 'bad-token');
    Session._id = 'e4130aaa-f585-4564-b7e6-dce37e58166c';

    await DegelClient.setSettingsStatus(true);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  test('#setSettingsStatus unauthorized when id is undefined', async ()=> {
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await StorageHelper.set('access_token', 'f6666455-9955-4722-9bcf-658787dabf2a');
    Session._id = undefined;

    await DegelClient.setSettingsStatus(true);

    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });
});

describe('DegelClient jest-fetch-mock', () => {
  beforeAll(() => {
    // mock http requests to verify parameters
    global.fetch = require('jest-fetch-mock');

    // mock storage
    const mockImpl = new MockAsyncStorage();
    jest.mock('AsyncStorage', () => mockImpl);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    storage.clear();
  });

  test('#setSettingsStatus notification mobile = true', async ()=> {
    fetch.mockResponseOnce(JSON.stringify({"notifications":{"mobile":true}}));
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    await StorageHelper.set('access_token', 'f6666455-9955-4722-9bcf-658787dabf2a');
    Session._id = 'e4130aaa-f585-4564-b7e6-dce37e58166c';

    await DegelClient.setSettingsStatus(true);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify({"notifications":{"mobile":true}}));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  test('#setSettingsStatus notification mobile = false', async ()=> {
    fetch.mockResponseOnce(JSON.stringify({"notifications":{"mobile":false}}));
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    await StorageHelper.set('access_token', 'f6666455-9955-4722-9bcf-658787dabf2a');
    Session._id = 'e4130aaa-f585-4564-b7e6-dce37e58166c';

    await DegelClient.setSettingsStatus(false);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify({"notifications":{"mobile":false}}));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});