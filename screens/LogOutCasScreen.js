import React from 'react';

import {
  Button,
  StyleSheet,
  View,
  WebView,
} from 'react-native';

import { BASE_URL } from '../constants/endpoints';

export default class LogOutCasScreen extends React.Component {

  navigated = false;

  constructor() {
    super();
    setTimeout(() => {
      if (this.navigated == false) {
        console.log("LogOutCasScreen : This is too long. Redirecting to authentification page.")
        this.props.navigation.navigate('AuthLoading');
      }
    }, 4000);
  }

  render() {

      return (
        <WebView
          source={{uri: BASE_URL + '/logout' }}
          style={{marginTop: 20}}
          onNavigationStateChange={this._navChanged}
        />
      );

  }

   _navChanged = (navState) => {
    if (navState.url === BASE_URL + '/logout/success') {
      this.navigated = true;
      this.props.navigation.navigate('AuthLoading');
    }
  }
}