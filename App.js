// In App.js in a new project
import React from 'react';
import { View, Text } from 'react-native';
import RootNavigation from './navigation/RootNavigation';

export default class App extends React.Component {
  render() {
    return <RootNavigation />;
  }
}