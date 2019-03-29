import { StyleSheet } from 'react-native';
import { styles, colours } from './base-styles';

const reportfound_styles = StyleSheet.create({
	row1: {
		backgroundColor: colours.ppGrey,
		flex: 0.2,
	},
	row2: {
		flex: 3,
	},
	cell: {
		flex: 1,
		borderWidth: StyleSheet.hairlineWidth,
	},
	contentContainer: {
		height: 400,
		paddingVertical: 100,
		paddingLeft: 20,
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
		height: 300,
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
	serial_number: {
		fontSize: 18, 
		marginTop: 10, 
		textAlign: 'center', 
		textAlignVertical: 'center',
		flex: 0.1
	}
});

export {styles, colours, reportfound_styles};