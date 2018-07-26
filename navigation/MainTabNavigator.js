import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const CalendarStack = createStackNavigator({
  Home: CalendarScreen,
});

CalendarStack.navigationOptions = {
    tabBarLabel: "Bouton vers l'écran de l'agenda",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-calendar${focused ? '' : '-outline'}`
          : 'md-calendar'
      }
    />
  ),
  tabBarOptions: {
    showLabel: false
  }
};

const SettingsStack = createStackNavigator({
  Links: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: "Bouton vers l'écran des paramètres",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-settings${focused ? '' : '-outline'}` : 'md-settings'}
    />
  ),
  tabBarOptions: {
    showLabel: false
  }
};

export default createBottomTabNavigator({
  CalendarStack,
  SettingsStack,
});
