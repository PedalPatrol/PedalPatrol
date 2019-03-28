import { StyleSheet } from 'react-native';
import { styles, text, colours } from './base-styles';

const login_styles = StyleSheet.create({
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
	edit: {
		height: 40,
		fontSize: 13,
		backgroundColor: colours.ppGrey,
		paddingLeft: 15,
		paddingRight: 15,
	},
	bottom: {
		flex: 1,
		justifyContent: 'flex-end',
		marginBottom: 45,
	},
	signupButton: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	signupText: {
		color: 'black',
		fontSize: 14,
		fontWeight:'bold',
	},
	socialIcons: {
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'center', 
		marginTop: 10
	}
});

export { styles, text, colours, login_styles }