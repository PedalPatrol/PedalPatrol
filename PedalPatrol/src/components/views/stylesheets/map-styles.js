import { StyleSheet } from 'react-native';
import { styles } from './base-styles';

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
	mapText: {
		fontSize: 14,
		color: '#777'
	},
	calloutColumn: {
		flexDirection: 'column', 
		width: 150,
	},
	calloutRow: {
		flexDirection: 'row', 
		flex: 1, 
		justifyContent: 'space-between'
	}
});

export { styles, map_styles };