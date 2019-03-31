import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import { styles, colours } from './base-styles';

const help_theme = {
	...DefaultTheme,
	roundness: 2,
	colors: {
		primary: '#34bb83',
		accent: '#ff0000'
	},
	font: {
		fontWeight: 'thin'
	}
};
export { styles, colours, help_theme };