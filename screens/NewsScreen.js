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
    this.props.navigation.setParams({title: I18n.t('NewsScreen.title') });

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
    const newsArray = [];
    for (var i=0; i < 5; i++) {
        newsArray.push(
         <View style={styles.news} key={'news-' + i.toString()}>
          <View style={styles.header}  key={'header-' + i.toString()}>
            <Text style={styles.title}  key={'title-' + i.toString()}>Titre</Text>
            <View style={styles.image}  key={'image-' + i.toString()}/>
          </View>
          <Text  key={'desc-' + i.toString()}>Description. Very long description, there is more to say because this is very long. Even longer than a long long long story.</Text>
         </View>
        );
    }
    return (
      <ScrollView style={{
        flex: 1
      }}>
       {
          newsArray
       }
       <View style={styles.infoView}>
        <Text style={styles.infoText}>{I18n.t('NewsScreen.FooterInformation')}</Text>
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
  },
  infoView: {
    alignItems: 'center',
    padding: 20
  },
  infoText: {
    alignItems: 'center',
    fontSize: 12
  }
});
