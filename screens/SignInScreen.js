import React from 'react';

import {
  AsyncStorage,
  Button,
  StyleSheet,
  View,
  WebView,
} from 'react-native';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  constructor(props) {
    super(props);

    //Génère une string aléatoire de 11 caracères alphanumériques
    this.stateStr = Math.random().toString(36).slice(2);

    //Compteur de changements d'url
    this.counter = 0;
  }

  render() {
    return (
      <WebView
        source={{uri: 'https://s6iprojet02.gel.usherbrooke.ca/oauth/authorize'
          + '?client_id=R9HZLN7GMLET8PB7JQWJ963N9A5ML7&response_type=code&'
          + 'redirect_uri=https://s6iprojet02.gel.usherbrooke.ca/oauth/callback'
          + '&state=' + this.stateStr }}
        onNavigationStateChange={this._navChanged}
        style={{marginTop: 20}}
      />
    );
  }

  //Appellée à chaque changement de page dans la webview
  _navChanged = (navState) => {
    //Vérifie l'URL d'arrivée
    if(navState.url.includes('https://s6iprojet02.gel.usherbrooke.ca/oauth/callback?code=')){

      this.counter++;

      //Vérifie que la page a fini de charger
      if(this.counter >= 2)
      {
        var subStr = navState.url.split('code=')[1];
        var subStr2 = subStr.split('&');

        var code = subStr2[0];
        var state = subStr2[1].split('=')[1]

        this.counter = 0;
        //Vérifie que le paramètre state des URL de départ et d'arrivée sont les mêmes
        if(this.stateStr === state){
          this._requestToken(code);
        }
      }
    };
  }


  _requestToken = (code) => {
    //TODO : header pour obtenir le token
    this._setToken('token provisoire');
  }

  //Set le token dans Asyncstorage et redirige vers la page principale
  _setToken = async (token) => {
    await AsyncStorage.setItem('userToken', token);
    this.props.navigation.navigate('Main');
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});