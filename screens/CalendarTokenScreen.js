import React from 'react';

import {
  Button,
  StyleSheet,
  View,
  WebView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { HORARIUS_URL, BASE_URL } from '../constants/endpoints';
import { DegelClient } from '../BL/degelClient';
import { Session } from '../BL/session';
import { StorageHelper } from '../BL/storageHelper';

export default class CalendarTokenScreen extends React.Component {



  constructor() {
    super();
    console.log("calendar token");
    console.log(Session._id);
    this.state = {
      loadReady: false,
      accessToken: undefined,
      userId: undefined
    };
  }
  
  async componentWillMount() {
    accessToken = await StorageHelper.get('access_token');
    userId = Session._id;

    this.setState({
      loadReady: true,
      accessToken: accessToken,
      userId: userId
    }); 
  }

  render() {

    if (this.state.loadReady) {
      console.log(this.state.accessToken);
      console.log(this.state.userId);

      let jsCode = `
        var monitor = document.createElement("div");
        monitor.id = "monitor";
        document.body.appendChild(monitor);

        var calendarToken = document.getElementsByTagName("pre")[0].textContent;
        
        var url = "${BASE_URL + '/api/user/' + this.state.userId + '/calendar'}";
        

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        xhr.setRequestHeader('Authorization', 'Bearer ' + "${this.state.accessToken}");
        
        monitor.innerHTML = 'sending';

        xhr.send(JSON.stringify({
            value: calendarToken
        }));

        monitor.innerHTML = 'received';



        
      `;

      return (
        <WebView
          source={{uri: HORARIUS_URL }}
          style={{marginTop: 20}}
          injectedJavaScript={jsCode}
          onMessage={this.hello}
        />
      );
    }
    else {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }
    
  }

  hello(data) {
    console.log("called")
    //Prints out data that was passed.
    console.log(data);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});