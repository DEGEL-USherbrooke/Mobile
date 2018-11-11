import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class NewsTopics extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>News Topics</Text>
        <View style={styles.topic}>
          <Text>Topic1</Text>
          <Button
            // onPress={onPressLearnMore}
            title="Subscribe"
            color="#2F9B63"
            accessibilityLabel="Susbscribe to this topic"
          />
        </View>
        <View style={styles.topic}>
          <Text>Topic1</Text>
          <Button
            // onPress={onPressLearnMore}
            title="Unsubscribe"
            color="red"
            accessibilityLabel="Susbscribe to this topic"
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