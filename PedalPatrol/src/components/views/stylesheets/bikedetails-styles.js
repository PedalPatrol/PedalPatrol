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
	touchableButtons: {
		borderWidth: 1, 
		textAlign: 'center', 
		borderColor: 'black',
		borderRadius: 5,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: colours.ppWhite
	}
});

export { styles, text, colours, bikedetails_styles };