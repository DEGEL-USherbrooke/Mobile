import React from 'react';

import {
  Button,
  StyleSheet,
  View,
  WebView,
} from 'react-native';

export default class LogOutCasScreen extends React.Component {

  constructor() {
    super();
  }

  render() {

      return (
        <WebView
          source={{uri: 'https://google.ca' }}
          style={{marginTop: 20}}
          onNavigationStateChange={this._navChanged}
        />
      );

  }

   _navChanged(navState) {
    console.log("allo")
    //this.props.navigation.navigate('AuthLoading');
   }
}