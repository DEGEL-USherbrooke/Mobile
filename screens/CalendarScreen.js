import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import Moment from 'moment';
export default class CalendarScreen extends Component {
  static navigationOptions = {
    title: 'Calendrier',
  };

  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
    // Todo Créer une fonction dans BL qui va importer le json du backend
    var customData = require('../assets/exemples.json');
    customData = this.orderDatas(customData);
    for(var i = 0, len = customData.length; i< len; i++){
        this.createEvents(customData[i]);
    }
  }

  orderDatas(datas){
    return datas.sort(function(a,b)
    {
      // modele date from json 2018-06-05T13:30:00-0400
      if (Moment(a.start).isAfter(Moment(b.start))){
        return 1;
      } else {
        return -1;
      }
    });
  }

  createEvents(object){
    var teachers = object['teachers'];
    if(teachers.length > 0){
      var fullName = teachers[0].firstName + ' ' + teachers[0].lastName;
    }
    const strTime = object.start.split('T')[0];
    if (!this.state.items[strTime]) {
      this.state.items[strTime] = [];
    }
        this.state.items[strTime].push(
          {
            title: object.title,
            hours: Moment(object.start).format('H:mm') + ' - ' +Moment(object.end).format('H:mm'),
            location: object.location,
            teacherName: fullName,
            description: object.description
        });
  }

  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={new Date()}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
      />
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}>
        <Text>{item.title}</Text>
        <Text>{item.hours}</Text>
        <Text>{item.location}</Text>
        <Text>{item.teacherName}</Text>
        <Text>{item.description}</Text>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text></Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
