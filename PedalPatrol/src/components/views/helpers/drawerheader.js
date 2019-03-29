import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { colours } from '../stylesheets/base-styles';

/**
 * Class to display the drawer header.
 * @extends Component
 */
class DrawerHeader extends Component {
	/**
	 * Creates an instance of the DrawerHeader.
	 * @constructor
	 */
	constructor (props) {
		super(props);
	}

	static propTypes = {
		image: PropTypes.string
	}

	render() {
		return (
			<View style={styles.container} >
				<Image style={styles.image} source={{uri: this.props.image, flex:1, width: 70, height: 70, left: 40}}/>
				<Text style={styles.text}>
					{this.props.name}
				</Text>
			</View>
		);
	}

}

export default DrawerHeader;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: colours.ppGreen,
		paddingVertical: 28,
		paddingLeft: 17,
		height: 100,
		alignItems: 'center',
	},
	image: {
		borderRadius: 35
	},
	text: { 
		color: '#FFF', 
		paddingLeft: 15, 
		fontSize: 24
	}
});