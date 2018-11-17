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

  beforeEach(async () => {
    jest.restoreAllMocks(); // remove spy implementation between tests
    await storage.clear();
    Session._expiry = 10000;
  });

  test('#requestAndSaveAccessTokensWithCode authorized', async ()=> {
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    fetch.configure({
      fixturePath: './_fixtures/authorized/'
    });

    await DegelClient.requestAndSaveAccessTokensWithCode('F7GJMP');
    
    _accessToken = await StorageHelper.get('access_token');
    _refreshToken = await StorageHelper.get('refresh_token');

    expect(_accessToken).toBe('51062cb3-009c-4a0f-aa37-77385db9a14f');
    expect(_refreshToken).toBe('90bb4fa5-dcbf-41f0-b273-903b92f973d9');
    expect(Session._expiry).toBe(8354);
    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });

  test('#requestAndSaveAccessTokensWithCode unauthorized', async ()=> {
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await DegelClient.requestAndSaveAccessTokensWithCode('badcode');

    _accessToken = await StorageHelper.get('access_token');
    _refreshToken = await StorageHelper.get('refresh_token');

    expect(_accessToken).toBe(undefined);
    expect(_refreshToken).toBe(undefined);
    expect(Session._expiry).toBe(10000);
    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });

  test('#refreshAccessToken ', async ()=>{
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    fetch.configure({
      fixturePath: './_fixtures/authorized/'
    });

    await StorageHelper.set('refresh_token', '90bb4fa5-dcbf-41f0-b273-903b92f973d9');

    result = await DegelClient.refreshAccessToken();

    _accessToken = await storage.getItem('access_token');
    _refreshToken = await storage.getItem('refresh_token');

    expect(result).toBe(true);
    expect(_accessToken).toBe('b1ad5fee-49bf-430a-9d6c-33bc9db6f4a3');
    expect(_refreshToken).toBe('90bb4fa5-dcbf-41f0-b273-903b92f973d9');
    expect(Session._expiry).toBe(17999);
     expect(consoleSpy).toHaveBeenCalledTimes(3);
  });

  test('#refreshAccessToken unauthorized', async ()=>{
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await StorageHelper.set('refresh_token', 'expired');

    result = await DegelClient.refreshAccessToken();

    expect(result).toBe(false);
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

    expect(settingsStatus).toEqual({"feeds": [], notification: false });
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

    expect(settingsStatus).toEqual({"feeds": [], notification: false });
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

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    await storage.clear();
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


import { Permissions, Notifications } from 'expo';
import { push_endpoint } from '../../constants/endpoints';

describe('registerForPushNotificationsAsync', () => {
  beforeAll(() => {
    // mock http requests to verify parameters
    global.fetch = require('jest-fetch-mock');
  });

  // general data mocks
  const expoToken = 'ExponentPushToken[brvkU3IvlmdlP1DihK6Sty]';
  const permissionGrantedPayload = { status: 'granted' };
  const permissionDeniedPayload = { status: 'denied' };
  Session._id = 'idtoken';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(global.console, 'log').mockImplementation(() => { return null }); // remove console print
  })

  test('Sends registration token when permission is granted by the user', async () => {
    // setup method monkey patching (spies)
    const permissionGetAsyncSpy = jest.spyOn(Permissions, "getAsync").mockImplementation(() => {
      return permissionDeniedPayload;
    });

    const permissionAskAsyncSpy = jest.spyOn(Permissions, "askAsync").mockImplementation(() => {
      return permissionGrantedPayload;
    });

    const notifGetExpoTokenSpy = jest.spyOn(Notifications, "getExpoPushTokenAsync").mockImplementation(() => {
      return expoToken;
    });

    // call the function
    await DegelClient.registerForPushNotificationsAsync();

    // expectations
    expect(permissionGetAsyncSpy).toHaveBeenCalledTimes(1);
    expect(permissionAskAsyncSpy).toHaveBeenCalledTimes(1);
    expect(notifGetExpoTokenSpy).toHaveBeenCalledTimes(1);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(push_endpoint(Session._id));
    expect(fetch.mock.calls[0][1].body).toEqual(
      JSON.stringify({
        expoToken: expoToken,
      })
    );
  });

  test('Sends registration token when permission is already granted', async () => {
    // setup method monkey patching (spies)
    const permissionGetAsyncSpy = jest.spyOn(Permissions, "getAsync").mockImplementation(() => {
      return permissionGrantedPayload;
    });

    const notifGetExpoTokenSpy = jest.spyOn(Notifications, "getExpoPushTokenAsync").mockImplementation(() => {
      return expoToken;
    });

    // call the function
    await DegelClient.registerForPushNotificationsAsync();

    // expectations
    expect(permissionGetAsyncSpy).toHaveBeenCalledTimes(1);
    expect(notifGetExpoTokenSpy).toHaveBeenCalledTimes(1);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(push_endpoint(Session._id));
    expect(fetch.mock.calls[0][1].body).toEqual(
      JSON.stringify({
        expoToken: expoToken,
      })
    );
  });


  test('Does not send registration token when permission is denied by the user', async () => {
    // setup method monkey patching (spies)
    const permissionGetAsyncSpy = jest.spyOn(Permissions, "getAsync").mockImplementation(() => {
      return permissionDeniedPayload;
    });

    const permissionAskAsyncSpy = jest.spyOn(Permissions, "askAsync").mockImplementation(() => {
      return permissionDeniedPayload;
    });

    // call the function
    await DegelClient.registerForPushNotificationsAsync();

    // expectations
    expect(permissionGetAsyncSpy).toHaveBeenCalledTimes(1);
    expect(permissionAskAsyncSpy).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls.length).toEqual(0);
  });


})

describe('registerForPushNotificationsAsync fetch-vcr', ()=> {

  // general data mocks
  const expoToken = 'ExponentPushToken[brvkU3IvlmdlP1DihK6Sty]';
  const permissionGrantedPayload = { status: 'granted' };
  const permissionDeniedPayload = { status: 'denied' };
  Session._id = 'e4130aaa-f585-4564-b7e6-dce37e58166c';


  beforeAll(() => {
    // record http calls and replay them
    process.env['VCR_MODE'] = 'cache';
    global.fetch = require('fetch-vcr');

  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(global.console, 'log').mockImplementation(() => { return null }); // remove console print
  })

  test('registerForPushNotificationsAsync authorized', async ()=>{
    await StorageHelper.set('access_token', 'cdb58cef-de9e-4545-b1a6-02b2cacea541');
    fetch.configure({
      fixturePath: './_fixtures/authorized/'
    });
    
    // setup method monkey patching (spies)
    const permissionGetAsyncSpy = jest.spyOn(Permissions, "getAsync").mockImplementation(() => {
      return permissionDeniedPayload;
    });

    const permissionAskAsyncSpy = jest.spyOn(Permissions, "askAsync").mockImplementation(() => {
      return permissionGrantedPayload;
    });

    const notifGetExpoTokenSpy = jest.spyOn(Notifications, "getExpoPushTokenAsync").mockImplementation(() => {
      return expoToken;
    });

    _response = await DegelClient.registerForPushNotificationsAsync();

    expect(_response).toEqual({"expoToken":"ExponentPushToken[brvkU3IvlmdlP1DihK6Sty]"});

  });

});