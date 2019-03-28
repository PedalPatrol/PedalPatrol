import { StyleSheet } from 'react-native';
import { styles, colours } from './base-styles';

const settings_styles = StyleSheet.create({
	settingsItem: {
		color: '#009688', 
		marginBottom: 3, 
		fontWeight: '500'
	},
	imageStyle: {
		marginLeft: 15,
		marginRight: 20,
		alignSelf: 'center',
		width: 20,
		height: 24,
		justifyContent: 'center'
	},
	logout: {
		color: 'red', 
		fontSize: 16
	}
});

export { styles, colours, settings_styles };