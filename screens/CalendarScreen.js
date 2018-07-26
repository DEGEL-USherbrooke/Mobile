import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import Moment from 'moment';
import { I18n } from '../locales/i18n';
import { LocaleConfig } from 'react-native-calendars';
import { Session } from '../BL/session';
import { DegelClient } from '../BL/degelClient';

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
    this.props.navigation.setParams({title: I18n.t('CalendarScreen.title'),
                                     headerRight:
                                        <TouchableOpacity
                                          accessible={true}
                                          accessibilityLabel={I18n.t('CalendarScreen.accessibilityToday')}
                                          onPress={() => this.agenda.chooseDay(new Date())}>
                                            <Text style={styles.today}>
                                              {I18n.t('CalendarScreen.today')}
                                            </Text>
                                        </TouchableOpacity>});

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

  async getCalendarEvents(){
    calendarEvents = await DegelClient.getCalendarEvents();

    if (calendarEvents[0] === undefined) {
      Alert.alert(
        'Oups!',
        I18n.t('CalendarScreen.errorMessage'),
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
      return;
    }

    var events = calendarEvents[2];
    events = events.slice(1);
    eventsOrdered = this.orderEvents(events);
    for(var i = 0, len = eventsOrdered.length; i< len; i++){
      this.createEvents(eventsOrdered[i]);
    }

  }

  constructor(props) {
    super(props);
    var backEndData = this.getCalendarEvents();
    this.state = {
      items: {}
    };
  }

  orderEvents(datas){
    return datas.sort(function(a,b){
      // On se rend jusqu'à l'heure du début de l'évènement dans le iCal
      a = a[1][1][3];
      b = b[1][1][3];

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
    const strTime = this.getElement(object,'dtstart').split('T')[0];
    var description = this.getElement(object,'description');
    description = description.replace("</br>", "\n\n")
    if (!this.state.items[strTime]) {
      this.state.items[strTime] = [];
    }
    this.state.items[strTime].push({
      title: this.getElement(object,'summary'),
      hours : Moment(this.getElement(object,'dtstart')).format('H:mm')
              +' - '+
              Moment(this.getElement(object,'dtend')).format('H:mm'),
      location: this.getElement(object,'location'),
      description: description
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
        theme={{
          agendaDayTextColor: 'black',
          agendaDayNumColor: 'black',
          agendaTodayColor: '#2F9B63',
          agendaKnobColor: '#2F9B63',
          dotColor: '#2F9B63',
          selectedDayBackgroundColor : '#2F9B63',
          todayTextColor : '#2F9B63'
        }}
        ref={(agenda) => { this.agenda = agenda; }}
      />
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = 0; i < 21; i++) {
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
    return r1.title !== r2.title;
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
  itemDescription:{
    fontSize:12
  },

  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  },
  today: {
    color: '#2F9B63',
    marginTop: 6,
    marginRight: 15,
    fontSize: 12,
    fontWeight: 'bold'
  }
});
