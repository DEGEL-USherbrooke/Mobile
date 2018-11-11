import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import SettingsList from 'react-native-settings-list';
import { I18n } from '../locales/i18n';
import { Session } from '../BL/session';
import { DegelClient } from '../BL/degelClient';
import { NetInfo } from 'react-native';
import NewsTopics from '../components/NewsTopics';

export default class SettingsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return params;
  };

  async componentWillMount() {
    await I18n.initAsync();
    this.props.navigation.setParams({title: I18n.t('SettingsScreen.title') });

    this.settingsState = await DegelClient.getSettingsStatus();

    this.setState({
      appIsReady: true, // fix I18n https://github.com/xcarpentier/ex-react-native-i18n/issues/7
      switchNotificationValue: this.settingsState.notification
    });
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ connectionStatus: isConnected }); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  constructor() {
    super();
    this.onNotificationValueChange = this.onNotificationValueChange.bind(this);
    this.state = {
      switchCalendarValue: false,
      switchNotificationValue: false,
      appIsReady: false,
      connectionStatus: false
    };
  }

  render() {
    var bgColor = '#DCE3F4';
    return (
      <View style={{backgroundColor:'#EFEFF4',flex:1}}>
        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
        <SettingsList.Header headerStyle={{marginTop:0}}/>
          <SettingsList.Item
            title={I18n.t('SettingsScreen.settingsNotification')}
            titleInfo=''
            titleInfoStyle={styles.titleInfoStyle}
            switchState={this.state.switchNotificationValue}
            switchOnValueChange={this.onNotificationValueChange}
            hasSwitch={true}
            hasNavArrow={false}
          />
          <SettingsList.Item
            title={I18n.t('SettingsScreen.logOff')}
            titleStyle={{color:'red', textAlign: 'center'}}
            titleInfoStyle={styles.titleInfoStyle}
            hasNavArrow={false}
            onPress={ async () => {
                await Session.logOut();
                this.props.navigation.navigate('LogOut');
              }
            }
          />
          <SettingsList.Item
            title={I18n.t('SettingsScreen.loggedInAs') + Session._cip.toUpperCase()}
            titleStyle={{color:'grey', textAlign: 'center', fontSize: 12}}
            hasNavArrow={false}
          />
          <NewsTopics/>
        </SettingsList>
      </View>
    );
  }

  onNotificationValueChange(value){
    DegelClient.setSettingsStatus(value);
    this.setState({switchNotificationValue: value});
    if(!this.state.connectionStatus){
      DegelClient.setSettingsStatus(!value);
      this.setState({switchNotificationValue: !value});
      Alert.alert(
        'Oups',
        I18n.t('SettingsScreen.noInternet'),
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    }
  }

  handleConnectionChange = (isConnected) => {
          this.setState({ connectionStatus: isConnected });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
