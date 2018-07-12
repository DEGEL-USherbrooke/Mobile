import React from 'react';

import { createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import SignInScreen from '../screens/SignInScreen';
import CalendarTokenScreen from '../screens/CalendarTokenScreen';


const AppNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: SignInScreen,
  Main: MainTabNavigator,
  TokenHorarius: CalendarTokenScreen
},
{
  initialRouteName: 'AuthLoading',
});

export default class RootNavigation extends React.Component {
  render() {
    return <AppNavigator />;
  }
}