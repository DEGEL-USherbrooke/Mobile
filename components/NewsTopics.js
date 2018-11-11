import React from 'react';
import { I18n } from '../locales/i18n';
import { StyleSheet, Text, View, Button } from 'react-native';

class NewsTopics extends React.Component {
  async componentWillMount() {
    await I18n.initAsync();

    this.setState({
      appIsReady: true, // fix I18n https://github.com/xcarpentier/ex-react-native-i18n/issues/7
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('NewsTopic.title')}</Text>
        <View style={styles.topic}>
          <Text>Topic 1</Text>
          <Button
            // onPress={onPressLearnMore}
            title={I18n.t('NewsTopic.subscribe')}
            color="#2F9B63"
            accessibilityLabel={I18n.t('NewsTopic.subscribe')}
          />
        </View>
        <View style={styles.topic}>
          <Text>Topic 2</Text>
          <Button
            // onPress={onPressLearnMore}
            title={I18n.t('NewsTopic.unsubscribe')}
            color="red"
            accessibilityLabel={I18n.t('NewsTopic.unsubscribe')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20
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