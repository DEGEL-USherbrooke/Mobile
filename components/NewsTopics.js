import React from 'react';
import { I18n } from '../locales/i18n';
import { DegelClient } from '../BL/degelClient';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
const uuidv4 = require('uuid/v4');

class NewsTopics extends React.Component {
  constructor(props) {
    super(props);
    
    this.onPress = this.onPress.bind(this);

    this.state = {
      appIsReady: false,
      feedList: [],
      subscribedFeedIds: []
    }
  }

  async componentWillMount() {
    await I18n.initAsync();

    this.loadTopics();
  }

  async onPress(action, newsfeedId) {
    subscribedFeeds = this.state.subscribedFeedIds.slice(0);

    if (action === 'sub') {
      console.log("sub - " + newsfeedId);
      subscribedFeeds.push(newsfeedId);
    }
    else if (action === 'unsub') {
      console.log("unsub - " + newsfeedId);
      subscribedFeeds = subscribedFeeds.filter(e => e !== newsfeedId)
    }

    await DegelClient.setFeedList(subscribedFeeds);
    this.loadTopics();
  }

  async loadTopics() {
    settingsState = await DegelClient.getSettingsStatus();
    feedList = await DegelClient.getFeedList();

    this.setState({
      appIsReady: true, // fix I18n https://github.com/xcarpentier/ex-react-native-i18n/issues/7
      feedList: feedList,
      subscribedFeedIds: settingsState.feeds
    });
  }

  render() {
    const topicsList = [];

    if (this.state.appIsReady && this.state.feedList.length > 0) {
      // feed list was loaded from the server
      for (const feed of this.state.feedList) {
        const keyPrefix = uuidv4().toString().substring(0, 7);
        const isSubscribed = this.state.subscribedFeedIds.some(e => e === feed.id);

        const buttonTitle = isSubscribed ? I18n.t('NewsTopic.unsubscribe') : I18n.t('NewsTopic.subscribe');
        const colorValue = isSubscribed ? "red" : "#2F9B63";

        // add topics to list, based on subscription
        topicsList.push(
          <View style={styles.topic} key={keyPrefix + "-topic"}>
            <Text key={keyPrefix + "-text"}>{feed.name}</Text>
            <Button
              key={keyPrefix + "-button"}
              onPress={() => this.onPress(isSubscribed ? 'unsub' : 'sub', feed.id)}
              title={buttonTitle}
              color={colorValue}
              accessibilityLabel={buttonTitle}
            />
          </View>
        );
      }
    }
    else if (this.state.appIsReady) {
      const keyPrefix = uuidv4().toString().substring(0, 7);
      topicsList.push(
        <View style={{padding: 20, justifyContent: 'center', alignItems: 'center'}} key={keyPrefix + "-container"}>
          <Text style={{marginTop: 40}} key={keyPrefix + "-text"}>{I18n.t('NewsTopic.unavailableMessage')}</Text>
        </View>
      );
    }
    else {
      const keyPrefix = uuidv4().toString().substring(0, 7);
      topicsList.push(
        <View style={{padding: 20, justifyContent: 'center', alignItems: 'center'}} key={keyPrefix + "-container"}>
          <ActivityIndicator size="large" color="#2F9B63" key={keyPrefix + "indicator"} />
          <Text style={{marginTop: 40}} key={keyPrefix + "-text"}>{I18n.t('NewsTopic.waitingMessage')}</Text>
        </View>
      );
    }
    

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('NewsTopic.title')}</Text>
        {
          topicsList
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  topic: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  }
});

export default NewsTopics;