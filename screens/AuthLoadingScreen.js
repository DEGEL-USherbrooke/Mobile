import React from 'react';

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Session } from '../BL/session';


export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {

    isAuthorizedToLogIn = await Session.logIn();

    if (isAuthorizedToLogIn) {
      console.log("User id: " + Session._id);
      console.log("User cip: " + Session._cip);
      this.props.navigation.navigate('Main');
    }
    else {
      await Session.logOut();
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
