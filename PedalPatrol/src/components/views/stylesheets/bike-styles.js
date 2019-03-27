import { StyleSheet } from 'react-native';
import { styles, colours } from './base-styles';

const bike_styles = StyleSheet.create({
	add: {
		borderWidth:1,
		borderColor:'rgba(0,0,0,0.2)',
		alignItems:'center',
		justifyContent:'center',
		width:60,
		height:60,
		backgroundColor:'#fff',
		borderRadius:60,
		position:'absolute',
		bottom:15,
		right:15,
		alignSelf:'flex-end',
	}
});

export { styles, colours, bike_styles };