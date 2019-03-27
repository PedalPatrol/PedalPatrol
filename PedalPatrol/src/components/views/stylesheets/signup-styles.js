import { StyleSheet } from 'react-native';
import { styles, text, colours } from './base-styles';

const signup_styles = StyleSheet.create({
	title:{
		color: 'black',
		fontWeight: 'bold',
		fontSize: 50,
	},
	centered:{
		alignItems:'center',
		marginTop:30,
	},
	centerText: {
		textAlign: 'center',
		marginTop:20,
	},
	view: {
		flex: 1,
		backgroundColor: colours.ppGrey,
	},
	editGroup: {
		margin: 20,
	},
	username: {
		marginTop: 30,
		height: 48,
		backgroundColor: colours.ppGrey,
		justifyContent: 'center',
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
	},
	password: {
		marginTop: 10,
		height: 48,
		backgroundColor: colours.ppGrey,
		justifyContent: 'center',
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
	},
	edit:{
		height: 40,
		fontSize: 13,
		backgroundColor: colours.ppGrey,
		paddingLeft: 15,
		paddingRight: 15,
	},
});

export { styles, text, signup_styles };