import { StyleSheet } from 'react-native';
import { styles, text } from './base-styles';

const bikedetails_styles = StyleSheet.create({
	flatList: {
		// marginTop: 220
	},
	contentContainer: {
		flexGrow: 1
	},
	direction: {
		borderWidth: 1,
		borderColor: 'black',
		marginRight: 10,
		marginLeft: 10,
		marginBottom: 10,
		backgroundColor: '#F5FCFF'
	}
});

export { styles, text, bikedetails_styles };