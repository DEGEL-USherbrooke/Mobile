import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { I18n } from '../locales/i18n';
import { Session } from '../BL/session';
import { DegelClient } from '../BL/degelClient';

export default class NewsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return params;
  };

  async componentWillMount() {
    await I18n.initAsync();
    this.props.navigation.setParams({title: I18n.t('SettingsScreen.title') });

    this.setState({
      appIsReady: true, // fix I18n https://github.com/xcarpentier/ex-react-native-i18n/issues/7
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  constructor() {
    super();
  }

  render() {
    return (
      <ScrollView style={{
        flex: 1
      }}>
       <View style={styles.news}>
        <View style={styles.header}>
          <Text style={styles.title}>Titre</Text>
          <View style={styles.image}/>
        </View>
        <Text>Description. Very long description, there is more to say because this is very long. Even longer than a long long long story.</Text>
       </View>

       <View style={styles.news}>
        <View style={styles.header}>
          <Text style={styles.title}>Titre</Text>
          <View style={styles.image}/>
        </View>
        <Text>Description. Very long description, there is more to say because this is very long. Even longer than a long long long story.</Text>
       </View>

       <View style={styles.news}>
        <View style={styles.header}>
          <Text style={styles.title}>Titre</Text>
          <View style={styles.image}/>
        </View>
        <Text>Description. Very long description, there is more to say because this is very long. Even longer than a long long long story.</Text>
       </View>
     </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  news: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: 'steelblue'
  }
});
