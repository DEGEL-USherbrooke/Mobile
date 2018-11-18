import React from 'react';
import {  StyleSheet,
          Text,
          View,
          Alert,
          ScrollView,
          RefreshControl,
          ActivityIndicator,
          Button,
          Image,
          TouchableOpacity,
          WebView,
          Platform
} from 'react-native';
import { I18n } from '../locales/i18n';
import { Session } from '../BL/session';
import { DegelClient } from '../BL/degelClient';
import NewsTopics from '../components/NewsTopics';
const uuidv4 = require('uuid/v4');
import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNavigationFocus } from 'react-navigation';

class NewsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return params;
  };

  constructor(props) {
    super(props);

    this.state = {
      appIsReady: false,
      newsList: [],
      readLink: undefined,
      refreshing: false,
      isFocused: true
    }

    this.onPress = this.onPress.bind(this);
    this.readMore = this.readMore.bind(this);
    this.goBack = this.goBack.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
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
    this.setState({
      readLink: link
    });
  }

  async goBack() {
    this.setState({
      readLink: undefined
    })
  }

  async _onRefresh() {
    this.setState({
      refreshing: true,
      readLink: undefined
    });
    await this.refreshNewsFeed();
    this.setState({refreshing: false});
  }

  componentWillReceiveProps() {
    this.setState({
      isFocused: this.props.isFocused
    });
  }

  render() {
    const refreshScrollViewContent = [];

    if (this.state.readLink !== undefined) {

      // reading mode - load webview
      return (
        <View style={{flex: 1}}>
          <View style={styles.toolBarWebView}>
            <TouchableOpacity onPress={this.goBack}>
              <Ionicons
                style={{marginLeft:'8%', ...Platform.select({android: {marginTop: 2.5}})}}
                name={Platform.OS === 'ios' ? `ios-arrow-back` : 'md-arrow-back'}
                size={Platform.OS === 'ios' ? 35 : 30}
                color="#000000"
                onPress={this.goBack}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.goBack}>
              <Icon
                style={{marginRight:'8%'}}
                name="cross"
                size={35}
                color="#000000"
                onPress={this.goBack}
              />
            </TouchableOpacity>
          </View>
          <WebView
            source={{uri: this.state.readLink}}
            style={{flex: 1}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
      </View>
    );
    }

    if (this.state.appIsReady && this.state.newsList.length > 0) {
      // we got some news to display
      for (const news of this.state.newsList) {
          const keyPrefix = uuidv4().toString().substring(0, 7);
          refreshScrollViewContent.push(
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

      const keyPrefix = uuidv4().toString().substring(0, 7);
      // fill the scrollview content
      refreshScrollViewContent.push(
        <View style={styles.infoView} key={keyPrefix + "view"}>
          <Text style={styles.infoText} key={keyPrefix + "text"}>{I18n.t('NewsScreen.FooterInformation')}</Text>
        </View>
      );
    } else if (this.state.appIsReady) {
      // fill refreshScrollViewContent with NewsTopics component
      const keyPrefix = uuidv4().toString().substring(0, 7);
      refreshScrollViewContent.push(
          <View style={noNewsStyle.container} key={keyPrefix + "-container"}>
            <Text style={styles.title} key={keyPrefix + "-text"}>{I18n.t('NewsScreen.noNews')}</Text>
            <NewsTopics key={keyPrefix + "-newsTopics-" + this.state.isFocused}/>
            <Button
              key={keyPrefix + "-button"}
              onPress={this.onPress}
              title={I18n.t('NewsScreen.refreshButton')}
              color="#2F9B63"
              accessibilityLabel={I18n.t('NewsScreen.refreshButton')}
            />
          </View>
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

    // return refreshScrollView
    return(
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        style={{flex: 1}}
      >
        {
          refreshScrollViewContent
        }
      </ScrollView>
    );
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
    padding: 20,
    elevation: 5,
    borderRadius:5
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
  },
  toolBarWebView: {
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fbfbfb',
    paddingVertical: 5
  }
});

export default withNavigationFocus(NewsScreen);
