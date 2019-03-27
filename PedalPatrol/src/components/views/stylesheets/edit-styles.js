import { StyleSheet, PixelRatio } from 'react-native';
import { styles, text, colours } from './base-styles';

const edit_styles = StyleSheet.create({
	avatarContainer: {
		borderColor: '#9B9B9B',
		borderWidth: 1 / PixelRatio.get(),
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		height: 200,
		padding: 10,
		marginRight: 10,
		marginLeft: 10,
		marginTop: 10,
		borderRadius: 4,
		shadowOffset:{  width: 1,  height: 1,  },
		shadowColor: '#CCC',
		shadowOpacity: 1.0,
		shadowRadius: 1,
	},
	avatar: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		height: 200
	},
	profileAvatar: {
		height: 200,
		width: 200, height: 200, 
		borderRadius: 200/ 2
	},
	scrollContainer: {
		paddingVertical: 20,
	},
	flatList: {
		marginRight: 10,
		marginLeft: 10
	},
	submitTouchable: {
		borderWidth: 1, 
		textAlign: 'center', 
		borderColor: 'black',
		borderRadius: 5,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: '#FFF'
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
		backgroundColor: 'transparent',
	},
	deleteView: {
		borderWidth: 2,
		borderColor: 'red',
		marginLeft: 5,
		marginRight: 5,
		marginTop: 20,
		marginBottom: 5
	},
	deleteTouchable: {
		borderWidth: 1, 
		textAlign: 'center', 
		borderColor: 'red',
		borderRadius: 5,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: '#FFF'
	},
	delete: {
		alignSelf: 'center', 
		paddingHorizontal: 5, 
		fontSize: 20,
		color: 'red'
	},
	deleteInline: {
		borderColor: 'red',
		backgroundColor: 'red', 
		height: 2, 
		flex: 1, 
		alignSelf: 'center'
	},
	contentContainer: {
		flexGrow: 1
	}
});

export { styles, text, colours, edit_styles };