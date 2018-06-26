import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import SettingsList from 'react-native-settings-list';
import { I18n } from '../locales/i18n';
import { signOut } from '../BL/signIn';
import { DegelClient } from '../BL/degelClient';

export default class SettingsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return params;
  };

  async componentWillMount() {
    await I18n.initAsync();
    this.props.navigation.setParams({title: I18n.t('SettingsScreen.title') });

    this.cip = await AsyncStorage.getItem('cip');
    this.id = await AsyncStorage.getItem('id');
    this.settingsState = await DegelClient.getSettingsStatus();

    this.setState({
      appIsReady: true, // fix I18n https://github.com/xcarpentier/ex-react-native-i18n/issues/7
      switchNotificationValue: this.settingsState.notification
    }); 
  }

  constructor() {
    super();
    this.onNotificationValueChange = this.onNotificationValueChange.bind(this);
    this.state = {
      switchCalendarValue: false,
      switchNotificationValue: false,
      appIsReady: false
    };
  }

  render() {
    var bgColor = '#DCE3F4';
    return (
      <View style={{backgroundColor:'#EFEFF4',flex:1}}>

        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
        <SettingsList.Header headerStyle={{marginTop:0}}/>
        <SettingsList.Item
        //icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
        title={I18n.t('SettingsScreen.settingsNotification')}
        titleInfo=''
        titleInfoStyle={styles.titleInfoStyle}
        switchState={this.state.switchNotificationValue}
        switchOnValueChange={this.onNotificationValueChange}
        hasSwitch={true}
        hasNavArrow={false}
        />
        <SettingsList.Item
          //icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
          title={I18n.t('SettingsScreen.logOff')}
          titleStyle={{color:'red', textAlign: 'center'}}
          titleInfoStyle={styles.titleInfoStyle}
          hasNavArrow={false}
          onPress={ async () => {
              signOut();
              this.props.navigation.navigate('AuthLoading');
            }
          }
        />
        <SettingsList.Item
          title={this.cip + ' - ' + this.id}
          titleStyle={{color:'grey', textAlign: 'center', fontSize: 12}}
          hasNavArrow={false}
        />
        </SettingsList>

      </View>
    );
  }

  onNotificationValueChange(value){
    DegelClient.setSettingsStatus(value);
    this.setState({switchNotificationValue: value});
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