import { Permissions, Notifications } from 'expo';
var { registerForPushNotificationsAsync } = require('../notificationBL');

describe('registerForPushNotificationsAsync', () => {
  // general data mocks
  const expoToken = 'ExponentPushToken[brvkU3IvlmdlP1DihK6Sty]';
  const permissionGrantedPayload = { status: 'granted' };
  const permissionDeniedPayload = { status: 'denied' };

  beforeEach(() => {
    jest.resetAllMocks()
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
    await registerForPushNotificationsAsync();

    // expectations
    expect(permissionGetAsyncSpy).toHaveBeenCalledTimes(1);
    expect(permissionAskAsyncSpy).toHaveBeenCalledTimes(1);
    expect(notifGetExpoTokenSpy).toHaveBeenCalledTimes(1);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('127.0.0.1/push/register');
    expect(fetch.mock.calls[0][1].body).toEqual(
      JSON.stringify({
        token: expoToken,
        name: 'Phil Bill',
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
    await registerForPushNotificationsAsync();

    // expectations
    expect(permissionGetAsyncSpy).toHaveBeenCalledTimes(1);
    expect(notifGetExpoTokenSpy).toHaveBeenCalledTimes(1);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('127.0.0.1/push/register');
    expect(fetch.mock.calls[0][1].body).toEqual(
      JSON.stringify({
        token: expoToken,
        name: 'Phil Bill',
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
    await registerForPushNotificationsAsync();

    // expectations
    expect(permissionGetAsyncSpy).toHaveBeenCalledTimes(1);
    expect(permissionAskAsyncSpy).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls.length).toEqual(0);
  });


})
