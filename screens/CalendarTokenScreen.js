import React from 'react';

import {
  Button,
  StyleSheet,
  View,
  WebView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { HORARIUS_URL } from '../constants/endpoints';
import { Session } from '../BL/session';

export default class CalendarTokenScreen extends React.Component {

  constructor() {
    super();
  }

  render() {

      const jsCode =`
        (function ready() {
          function whenRNPostMessageReady(cb) {
            if (postMessage.length === 1) cb();
            else setTimeout(function() { whenRNPostMessageReady(cb) }, 100);
          }
          whenRNPostMessageReady(function() {
            var calendarToken = document.getElementsByTagName("pre")[0].textContent;
            postMessage(calendarToken);
          });
        })();`;

      return (
        <View style={{flex: 1, backgroundColor: 'steelblue'}}>
          <WebView
            source={{uri: HORARIUS_URL }}
            style={{marginTop: 20}}
            injectedJavaScript={jsCode}
            javaScriptEnabled={true}
            onMessage={(event) => {
                var calendarToken = event.nativeEvent.data;
                console.log('calendar token : ' + calendarToken);

                this.setCalendarToken(calendarToken);
              }
            }
          />
        </View>
      );

  }

  setCalendarToken(calendarToken) {
    Session._horariusToken = calendarToken;
    this.props.navigation.navigate('AuthLoading');
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
