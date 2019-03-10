import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const LOGO_URL = 'https://i.imgur.com/uWzNO72.jpg'; // TODO: Fetch from profile

/**
 * Class to display the drawer header.
 */
class DrawerHeader extends Component {
	constructor (props) {
		super(props);
	}

	render() {
		return (
			<TouchableOpacity>
				<View style={styles.container} >
					<Image style={styles.image} source={{uri: LOGO_URL, flex:1, width: 80, height: 80, left: 40}}/>
					<Text style={styles.text}>
						Sean Remedios
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

}

export default DrawerHeader;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: '#196628',
		paddingVertical: 28,
		paddingLeft: 17,
		height: 100,
		alignItems: 'center',
	},
	image: {
		borderRadius: 10
	},
	text: { 
		color: '#FFF', 
		paddingLeft: 9, 
		fontSize: 16 
	}
});