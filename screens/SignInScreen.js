import React from 'react';

import {
  Button,
  StyleSheet,
  View,
  Text,
  Platform,
  WebView,
  Image,
} from 'react-native';

import { oauth_authorize_uri, CALLBACK_URI } from '../constants/endpoints';
import { DegelClient } from '../BL/degelClient';
import { I18n } from '../locales/i18n';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  async componentWillMount() {
    await I18n.initAsync();
    this.setState({appIsReady: true }); // fix I18n https://github.com/xcarpentier/ex-react-native-i18n/issues/7
  }

  constructor(props) {
    super(props);

    //Génère une string aléatoire de 11 caracères alphanumériques
    this.stateStr = Math.random().toString(36).slice(2);

    //Compteur de changements d'url
    this.counter = 0;

    this.state = {
      displayPanel: true
    }
    this._signInClicked = this._signInClicked.bind(this);
  }

  render() {

      if (this.state.displayPanel) {
        return(
          <View style={styles.container}>
          <Image
            source={require('../assets/banner_homepage.png')}
            style={styles.welcomeImage}
          />
            <Button title={I18n.t("SignInScreen.signInButton")} color="#2F9B63" onPress={this._signInClicked} />
            <Image
              source={require('../assets/udes.png')}
              style={styles.logoUdes}
            />
            <View style={styles.tabBarInfoContainer}>
              <Text style={styles.tabBarInfoText}>{I18n.t("SignInScreen.note")}</Text>
            </View>
          </View>
        );
      }
      else {
        return(
          <WebView
            source={{uri: oauth_authorize_uri(this.stateStr) }}
            onNavigationStateChange={this._navChanged}
            style={{marginTop: 20}}
          />
        );
      }
  }

  _signInClicked() {
    this.setState({
      displayPanel: false
    })
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
    backgroundColor: 'white'
  },
  welcomeImage: {
    position: 'absolute',
    width: '95%',
    top: '-25%',
    resizeMode: 'contain'
  },
  logoUdes: {
    position: 'absolute',
    width: '50%',
    bottom: '10%',
    left: '25%',
    right: 0,
    resizeMode: 'contain'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 14,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    marginRight: 20,
    marginLeft: 20
  },
});
