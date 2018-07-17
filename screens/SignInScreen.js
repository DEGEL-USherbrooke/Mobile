import React from 'react';

import {
  Button,
  StyleSheet,
  View,
  WebView,
} from 'react-native';

import { oauth_authorize_uri, CALLBACK_URI } from '../constants/endpoints';
import { DegelClient } from '../BL/degelClient';

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
      <View style={{flex: 1, backgroundColor: 'steelblue'}}>
        <WebView
          source={{uri: oauth_authorize_uri(this.stateStr) }}
          onNavigationStateChange={this._navChanged}
          style={{marginTop: 20}}
        />
      </View>
    );
  }

  //Appellée à chaque changement de page dans la webview
  _navChanged = (navState) => {
    //Vérifie l'URL d'arrivée
    if(navState.url.includes(CALLBACK_URI + '?code=')){

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
          this._requestTokens(code);
        }
      }
    };
  }


  _requestTokens = async (code) => {
    await DegelClient.requestAndSaveAccessTokensWithCode(code);
    this.props.navigation.navigate('TokenHorarius');
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
