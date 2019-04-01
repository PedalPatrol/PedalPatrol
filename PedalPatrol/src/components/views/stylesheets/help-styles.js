import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import { styles, colours } from './base-styles';

const help_styles = StyleSheet.create({
  itemStyle:{
    fontSize: 14,
    flexWrap:"wrap",
    backgroundColor: '#F7F7F7',
    padding: 5
  }

});

export { styles, colours, help_styles };