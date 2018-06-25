// https://github.com/xcarpentier/ex-react-native-i18n
import I18n from 'ex-react-native-i18n';

var en_US_data = require('./en.json');
var fr_CA_data = require('./fr.json');

I18n.fallbacks = true

I18n.translations = {
  en: en_US_data,
  fr: fr_CA_data
}

I18n.initAsync(); // if this creates errors, put it in the componentWillMount of each dependant components

export { I18n };