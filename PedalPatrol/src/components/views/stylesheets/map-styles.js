import { StyleSheet } from 'react-native';
import { styles, colours } from './base-styles';

const map_styles = StyleSheet.create({
	reportButton:{
		position: 'absolute',
		top: '70%',
		alignSelf: 'flex-end',
	},
	saveDeleteButton:{
		position: 'absolute',
		top: '70%',
		left:'30%',
	},
	circleRadiusButton: {
		position: 'absolute',
		top: '20%',
		alignSelf:'flex-end',
   	},
	map: {
		flex: 1,
		zIndex: -1,
   	},
	Buttons:{
		marginTop:10,
		borderWidth:2,
		borderColor: 'grey',
	},
	mapButton: {
		width: 46,
		height: 46,
		borderRadius: 23,
		backgroundColor: '#FFF',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		shadowRadius: 8,
		shadowOpacity: 0.12,
		zIndex: 10,
	},
	modelText: {
		fontWeight: 'bold',
		fontSize: 12,
		color: '#777'
	},
	mapText: {
		fontSize: 11,
		color: '#777'
	},
	timeagoText: {
		marginTop: 2,
		marginBottom: 2,
		marginRight: 5,
		marginLeft: 5,
		color: 'white'
	},
	calloutColumn: {
		flexDirection: 'column', 
		width: 200,
	},
	calloutRow: {
		flexDirection: 'row', 
		flex: 1, 
		justifyContent: 'space-between'
	},
	timeago: {
		borderRadius: 8,
		backgroundColor: '#01AA64',
		overflow: 'hidden',
	}
});

export { styles, colours, map_styles };