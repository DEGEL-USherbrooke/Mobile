import { Session } from '../session';
import MockAsyncStorage from 'mock-async-storage';
import { AsyncStorage as storage } from 'react-native';
import { DegelClient } from '../degelClient';

describe('Session ', () => {

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
    Session._id = undefined;
    Session._cip = undefined;
    Session._horariusToken = undefined;
  });

  test('#logIn authorized', async ()=> {
    Session._horariusToken = "token";

    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    const registerNotifSpy = jest.spyOn(DegelClient, "registerForPushNotificationsAsync").mockImplementation(() => {
      return {};
    });

    const calendarTokenSetSpy = jest.spyOn(DegelClient, "setCalendarToken").mockImplementation(() => {
      return {};
    });

    fetch.configure({
      fixturePath: './_fixtures/authorized/'
    });

    await storage.setItem('access_token', '4b876303-d8ad-4aa8-b832-390315e2e029');
    await storage.setItem('refresh_token', '90bb4fa5-dcbf-41f0-b273-903b92f973d9');
    result = await Session.logIn();

    expect(result).toBe(true);

    expect(Session._id).toBe('e4130aaa-f585-4564-b7e6-dce37e58166c');
    expect(Session._cip).toBe('girp2705');
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(registerNotifSpy).toHaveBeenCalledTimes(1);
    expect(calendarTokenSetSpy).toHaveBeenCalledTimes(1);

  });

  test('#logIn unauthorized', async ()=>{
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    const registerNotifSpy = jest.spyOn(DegelClient, "registerForPushNotificationsAsync").mockImplementation(() => {
      return {};
    });
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await storage.setItem('access_token', '55e85473-1094-4607-b0bb-81b18e1e7b1b');
    await storage.setItem('refresh_token', '90bb4fa5-dcbf-41f0-b273-903b92f973d9');

    result = await Session.logIn();

    expect(result).toBe(false);

    expect(Session._id).toBe('undefined');
    expect(Session._cip).toBe('undefined');
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(registerNotifSpy).toHaveBeenCalledTimes(0);
  });

  test('#logIn unauthorized expired refresh token', async ()=>{
    const registerNotifSpy = jest.spyOn(DegelClient, "registerForPushNotificationsAsync").mockImplementation(() => {
      return {};
    });
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await storage.setItem('access_token', '55e85473-1094-4607-b0bb-81b18e1e7b1b');
    await storage.setItem('refresh_token', 'expired');

    result = await Session.logIn();

    expect(result).toBe(false);

    expect(Session._id).toBe(undefined);
    expect(Session._cip).toBe(undefined);
    expect(registerNotifSpy).toHaveBeenCalledTimes(0);
  });

  test('#logOut remove all stored values', async ()=>{
    await storage.setItem('access_token', '55e85473-1094-4607-b0bb-81b18e1e7b1b');
    await storage.setItem('refresh_token', '55e85473-1094-4607-b0bb-81b18e1e7b1b');
    Session._id = 'id';
    Session._cip = 'cip';

    await Session.logOut();

    _accessToken = await storage.getItem('access_token');
    _refreshToken = await storage.getItem('refresh_token');

    expect(_accessToken).toBeUndefined();
    expect(_refreshToken).toBeUndefined();
    expect(Session._id).toBe('undefined');
    expect(Session._cip).toBe('undefined');
  });

});