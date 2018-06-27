import React from 'react';

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { DegelClient } from '../BL/degelClient';
import { StorageHelper } from '../BL/storageHelper';


export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const accessToken = await StorageHelper.get('access_token');
    const refreshToken = await StorageHelper.get('refresh_token');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (accessToken && refreshToken) {
      await DegelClient.saveCurrentUser();
      this.props.navigation.navigate('Main');
    }
    else {
      this.props.navigation.navigate('Auth');
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
