import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import Moment from 'moment';
import { I18n } from '../locales/i18n';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
};

LocaleConfig.locales['en'] = {
  monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  monthNamesShort: ['Jan.','Feb.','Mar','Apr','May','Jun','July.','Aug','Sept.','Oct.','Nov.','Dec.'],
  dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
};

export default class CalendarScreen extends Component {
  state = {
    appIsReady: false,
  };

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return params;
  };

  async componentWillMount() {
    await I18n.initAsync();
    this.props.navigation.setParams({title: I18n.t('CalendarScreen.title') });

    // change local of calendar
    splitLocalString = I18n.locale.split('-');
    if (splitLocalString[0] === 'fr') {
      LocaleConfig.defaultLocale = 'fr';
    }
    else {
      LocaleConfig.defaultLocale = 'en';
    }

    this.setState({appIsReady: true }); // fix I18n https://github.com/xcarpentier/ex-react-native-i18n/issues/7
  }

  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
    // Todo Créer une fonction dans BL qui va importer le json du backend
    var customData = require('../assets/exemples.json');
    var backEndData = require('../assets/calendar.json');

    // Get all events
    var events = backEndData[2];
    events = events.slice(1);
    eventsOrdered = this.orderEvents(events);
    for(var i = 0, len = eventsOrdered.length; i< len; i++){
      this.createEvents(eventsOrdered[i]);
    }
  }

  orderEvents(datas){
    return datas.sort(function(a,b){
      a = a[1];
      a = a[1];
      if(a !== undefined){
        a = a[3];
      }

      b = b[1];
      b = b[1];
      if(b !== undefined){
        b = b[3];
      }

      // modele date from json 2018-06-05T13:30:00-0400
      if (Moment(a).isAfter(Moment(b))){
        return 1;
      } else {
        return -1;
      }
    });
  }

  getElement(agendaEvent,element){
    agendaEvent = agendaEvent[1];
    for(var i = 0, len = agendaEvent.length; i< len; i++){
      var block = agendaEvent[i];
      if(block[0] === element){
        return block[3];
      }
    }
  }

  createEvents(object){
    /*var teachers = object['teachers'];
    if(teachers.length > 0){
      var fullName = teachers[0].firstName + ' ' + teachers[0].lastName;
    }*/

    const strTime = this.getElement(object,'dtstart').split('T')[0];
    if (!this.state.items[strTime]) {
      this.state.items[strTime] = [];
    }
    this.state.items[strTime].push({
      title: this.getElement(object,'summary'),
      hours : Moment(this.getElement(object,'dtstart')).format('H:mm')
              +' - '+
              Moment(this.getElement(object,'dtend')).format('H:mm'),
      location: this.getElement(object,'location'),
      // Mort
      teacherName: '',
      description: this.getElement(object,'description')
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
      for (let i = 0; i < 14; i++) {
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
      <View style={[styles.titleContainer, {height: item.height}]}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={[styles.hoursLocationContainer, {height: item.height}]}>
         <View style={{marginRight:8}}>
            <Text style={{justifyContent: 'center', alignItems:'center'}}>
              {item.hours}
            </Text>
          </View>
          <View>
            <Text style={styles.textStyle}></Text>
          </View>
          <View style={{marginLeft:8}}>
            <Text style={{justifyContent: 'center',alignItems:'center'}}>
              {item.location}
            </Text>
          </View>
        </View>
        <View style={[styles.othersContainer, {height: item.height}]}>
          <Text style={styles.itemTeacherName}>{item.teacherName}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
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
//Container
  titleContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  hoursLocationContainer: {
    backgroundColor: 'white',
    flexDirection:'row',
    padding: 2,
    marginRight: 30,
    marginLeft: 30,
    justifyContent: 'center',
    alignItems:'center'
  },
  othersContainer:{
    backgroundColor: 'white',
    padding: 2,
    marginTop: 10,
    marginLeft: 6,
  },

// Items
  itemTitle:{
    fontSize:20,
    textAlign: 'center'
  },
  itemHours:{
    fontSize:16,
  },
  itemLocation:{
    fontSize:14
  },
  itemTeacherName:{
    fontSize:12
  },
  itemDescription:{
    fontSize:12
  },

  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
