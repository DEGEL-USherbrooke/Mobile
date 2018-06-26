import { StorageHelper } from '../storageHelper';
import MockAsyncStorage from 'mock-async-storage';
import { AsyncStorage as storage } from 'react-native';

describe('StorageHelper', () => {
  beforeAll(() => {
    const mockImpl = new MockAsyncStorage();
    jest.mock('AsyncStorage', () => mockImpl);
  });

  beforeEach(() => {
    jest.restoreAllMocks(); // remove spy implementation between tests
    storage.clear();
  })

  test('#set save the value when the key does not exists', async () => {
    await StorageHelper.set('myKey', 'myValue');

    const value = await storage.getItem('myKey');
    expect(value).toBe('myValue');
    expect(value).toBeTruthy();
  });

  test('#set override the value when the key exists by removing existing key', async () => {
    const storageRemoveSpy = jest.spyOn(StorageHelper, "remove");
    await StorageHelper.set('myKey', 'myValue');
    await StorageHelper.set('myKey', 'newValue');

    const value = await storage.getItem('myKey');
    expect(value).toBe('newValue');
    expect(value).toBeTruthy();
    expect(storageRemoveSpy).toHaveBeenCalledTimes(1);
  });

  test('#set does not save undefined values', async () => {
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    const asyncStorageSpy = jest.spyOn(storage, "setItem");

    await StorageHelper.set('myKey', undefined);

    expect(asyncStorageSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  test('#set does not save null values', async () => {
    const consoleSpy = jest.spyOn(global.console, 'log').mockImplementation(() => { return null });
    const asyncStorageSpy = jest.spyOn(storage, "setItem");

    await StorageHelper.set('myKey', null);

    expect(asyncStorageSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  test('#get returns the value', async () => {
    storage.setItem('myKey', 'myValue');

    const value = await StorageHelper.get('myKey');
    expect(value).toBe('myValue');
    expect(value).toBeTruthy();

  });

  test('#remove remove the value', async () => {
    storage.setItem('myKey', 'myValue');
    await StorageHelper.remove('myKey');

    const value = await StorageHelper.get('myKey');
    expect(value).toBeUndefined();
    expect(value).not.toBeTruthy();
  });

  afterAll(() => {
    jest.unmock('AsyncStorage');
  });
});