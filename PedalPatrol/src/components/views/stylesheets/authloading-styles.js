import { StyleSheet } from 'react-native';
import { styles, colours } from './base-styles';

const authloading_styles = StyleSheet.create({
	logoutLoading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	image: {
		width: 200,
		height: 200,
		zIndex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	load: {
		zIndex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	container: {
		backgroundColor: colours.ppGreen, 
		justifyContent: 'flex-start', 
		paddingTop:200
	}
});

export { styles, colours, authloading_styles };