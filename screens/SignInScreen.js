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

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'leTokenEnJSON');
    this.props.navigation.navigate('Main');
  };

  _onMessage(webViewData) {
		console.log('message received');
		console.log(webViewData);
		let jsonData = JSON.parse(webViewData);

		if(jsonData.success) {
		console.log('data received', webViewData, jsonData);
		}
	};

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});