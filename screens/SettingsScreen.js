import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import SettingsList from 'react-native-settings-list';

export default class SettingsScreen extends React.Component {
      constructor(){
      super();
      this.onCalendarValueChange = this.onCalendarValueChange.bind(this);
      this.onNotificationValueChange = this.onNotificationValueChange.bind(this);
      this.state = {switchCalendarValue: false,
                    switchNotificationValue: false
                    };
    }
    render() {
      var bgColor = '#DCE3F4';
      return (
        <View style={{backgroundColor:'#EFEFF4',flex:1}}>
          <View style={{borderBottomWidth:1, backgroundColor:'#f7f7f8',borderColor:'#c8c7cc'}}>
            <Text style={{alignSelf:'center',marginTop:30,marginBottom:10,fontWeight:'bold',fontSize:16}}>Settings</Text>
          </View>
          <View style={{backgroundColor:'#EFEFF4',flex:1}}>
            <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
              <SettingsList.Header headerStyle={{marginTop:15}}/>
              <SettingsList.Item
                title='Calendar'
                hasSwitch={true}
                switchState={this.state.switchCalendarValue}
                switchOnValueChange={this.onCalendarValueChange}
                hasNavArrow={false}
              />
              <SettingsList.Item
                //icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
                title='Notifications'
                titleInfo='Bill Wi The Science Fi'
                titleInfoStyle={styles.titleInfoStyle}
                switchState={this.state.switchNotificationValue}
                switchOnValueChange={this.onNotificationValueChange}
                hasSwitch={true}
                hasNavArrow={false}
              />
              <SettingsList.Item
                //icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
                title='Sign out'
				titleStyle={{color:'red', textAlign: 'center'}}
                titleInfoStyle={styles.titleInfoStyle}
				hasNavArrow={false}
				onPress={ async () => {
					await AsyncStorage.removeItem('userToken');
					this.props.navigation.navigate('AuthLoading');
					}
				}
              />
            </SettingsList>
          </View>
        </View>
      );
    }
    onCalendarValueChange(value){
      this.setState({switchCalendarValue: value});
    }
    onNotificationValueChange(value){
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
  