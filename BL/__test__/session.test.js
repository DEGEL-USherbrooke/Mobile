import { Session } from '../session';
import MockAsyncStorage from 'mock-async-storage';
import { AsyncStorage as storage } from 'react-native';

describe('Session ', () => {

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
    Session._id = undefined;
    Session._cip = undefined;
  });

  test('#logIn authorized', async ()=> {
    fetch.configure({
      fixturePath: './_fixtures/authorized/'
    });

    await storage.setItem('access_token', '4b876303-d8ad-4aa8-b832-390315e2e029');
    result = await Session.logIn();

    expect(result).toBe(true);

    expect(Session._id).toBe('e4130aaa-f585-4564-b7e6-dce37e58166c');
    expect(Session._cip).toBe('girp2705');

  });

  test('#logIn unauthorized', async ()=>{
    fetch.configure({
      fixturePath: './_fixtures/unauthorized/'
    });

    await storage.setItem('access_token', '55e85473-1094-4607-b0bb-81b18e1e7b1b');
    result = await Session.logIn();

    expect(result).toBe(false);

    expect(Session._id).toBe('undefined');
    expect(Session._cip).toBe('undefined');
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