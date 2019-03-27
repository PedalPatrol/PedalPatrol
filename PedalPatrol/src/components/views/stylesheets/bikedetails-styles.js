import { StyleSheet } from 'react-native';
import { styles, text, colours } from './base-styles';

const bikedetails_styles = StyleSheet.create({
	flatList: {
		marginRight: 10,
		marginLeft: 10
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
		backgroundColor: colours.ppGrey
	}
});

export { styles, text, colours, bikedetails_styles };