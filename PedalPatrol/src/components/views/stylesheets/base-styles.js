import { StyleSheet } from 'react-native';

const colours = {
	// ppGreen: '#34BB83',
	ppGreen: '#67CCA2',
	ppPinRed: '#FF0000',
	ppPinGreen: '#008000',
	ppGrey: '#E6ECF0',
	ppDarkGrey: '#7F7F7F',
	ppWhite: '#FFFFFF',
	ppBlue: '#4285F4'
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colours.ppGrey
	},
	rowContainer: {
		flexDirection: 'row',
		backgroundColor: '#FFF',
		height: 200,
		padding: 10,
		marginRight: 10,
		marginLeft: 10,
		marginTop: 10,
		borderRadius: 4,
		shadowOffset:{  width: 1,  height: 1,  },
		shadowColor: '#CCC',
		shadowOpacity: 1.0,
		shadowRadius: 1
	},
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		zIndex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colours.ppGrey,
	}
});

const text = StyleSheet.create({
	textInput: {
		backgroundColor: colours.ppGrey,
	},
	colourText: {
		textShadowColor: 'rgba(0, 0, 0, 1)', 
		textShadowOffset: {width: -1, height: 1}, 
		textShadowRadius: 1,
	},
	titleText: {
		fontWeight: 'bold'
	},
});

export { styles, text, colours };