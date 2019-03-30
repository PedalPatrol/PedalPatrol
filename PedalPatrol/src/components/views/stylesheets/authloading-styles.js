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
	}
});

export { styles, colours, authloading_styles };