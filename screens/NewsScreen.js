import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, ActivityIndicator, Button, Image, TouchableOpacity } from 'react-native';
import { I18n } from '../locales/i18n';
import { Session } from '../BL/session';
import { DegelClient } from '../BL/degelClient';
import NewsTopics from '../components/NewsTopics';
const uuidv4 = require('uuid/v4');

export default class NewsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return params;
  };

  constructor(props) {
    super(props);

    this.state = {
      appIsReady: false,
      newsList: []
    }

    this.onPress = this.onPress.bind(this);
    this.readMore = this.readMore.bind(this);
  }

  async componentWillMount() {
    await I18n.initAsync();

    this.props.navigation.setParams({title: I18n.t('NewsScreen.title') });

    this.refreshNewsFeed();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  async refreshNewsFeed() {
    newsList = await DegelClient.getUserNews();

    console.log(newsList);

    this.setState({
      appIsReady: true, // fix I18n https://github.com/xcarpentier/ex-react-native-i18n/issues/7
      newsList: newsList
    });
  }

  async onPress() {
    this.refreshNewsFeed();
  }

  async readMore(link) {
    console.log("read link " + link)
  }

  render() {
    if (this.state.appIsReady && this.state.newsList.length > 0) {
      // we got some news to display
      const newsArray = [];
      for (const news of this.state.newsList) {
          const keyPrefix = uuidv4().toString().substring(0, 7);
          newsArray.push(
            <TouchableOpacity key={keyPrefix + "-touch"} onPress={() => this.readMore(news.link)}>
              <View style={styles.news} key={keyPrefix + "-container"}>
                <View style={styles.header}  key={keyPrefix + "-header"}>
                  <Text style={styles.title}  key={keyPrefix + "-title"}>{news.title}</Text>
                  {news.imageUrl !== "" &&
                    <Image style={styles.image}  key={keyPrefix + "-image"} source={{uri: news.imageUrl}}/>
                  }
                </View>
                <Text  key={keyPrefix + "-desc"}>{news.description}</Text>
                <View style={styles.readMore}>
                  <Button
                    key={keyPrefix + "-readmore"}
                    onPress={() => this.readMore(news.link)}
                    title={I18n.t('NewsScreen.readMoreButton')}
                    color="#2F9B63"
                    accessibilityLabel={I18n.t('NewsScreen.readMoreButton')}
                  />
                </View>
             </View>
           </TouchableOpacity>
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
    } else if (this.state.appIsReady) {
      return(
        <ScrollView style={{
          flex: 1
        }}>
          <View style={noNewsStyle.container}>
            <Text style={styles.title}>{I18n.t('NewsScreen.noNews')}</Text>
            <NewsTopics/>
            <Button
              onPress={this.onPress}
              title={I18n.t('NewsScreen.refreshButton')}
              color="#2F9B63"
              accessibilityLabel={I18n.t('NewsScreen.refreshButton')}
            />
          </View>
        </ScrollView>
      );
    }
    else {
      return(
        <View style={{marginTop: 20, padding: 20, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#2F9B63" />
          <Text style={{marginTop: 40}}>{I18n.t('NewsScreen.gettingReady')}</Text>
        </View>
      );
    }
    
  }
}

const noNewsStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

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
    paddingRight: 10,
    flexShrink: 1,
    fontWeight: 'bold'
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: 'steelblue'
  },
  readMore: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  infoView: {
    alignItems: 'center',
    padding: 20
  },
  infoText: {
    fontSize: 12
  }
});
