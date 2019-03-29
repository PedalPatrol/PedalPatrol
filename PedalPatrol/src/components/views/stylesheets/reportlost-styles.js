import { StyleSheet } from 'react-native';
import { styles, colours } from './base-styles';

const reportlost_styles = StyleSheet.create({
	row1: {
		flex: 1,
	},
	row2: {
		flex: 5,
	},
	cell: {
		flex: 1,
		borderWidth: StyleSheet.hairlineWidth,
	},
	textButton: {
		color: 'deepskyblue',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'deepskyblue',
		margin: 2,
	},
	dropdown_2: {
		alignSelf: 'center',
		width: 300,
		marginTop: 32,
		borderWidth: 0,
		borderRadius: 3,
		backgroundColor: 'cornflowerblue',
	},
	dropdown_2_text: {
		marginVertical: 10,
		marginHorizontal: 6,
		fontSize: 18,
		color: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	dropdown_2_dropdown: {
		width: 300,
		height: undefined,
		borderColor: 'cornflowerblue',
		borderWidth: 2,
		borderRadius: 3,
	},
	dropdown_2_row: {
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
	},
	dropdown_2_row_text: {
		marginHorizontal: 4,
		fontSize: 16,
		color: 'navy',
		textAlignVertical: 'center',
	},
	submitButton: {
		height: 45,
		backgroundColor: colours.ppGreen,
		alignItems:'center',
		justifyContent:'center',
		overflow: 'hidden'
	},
});

export {styles, colours, reportlost_styles};