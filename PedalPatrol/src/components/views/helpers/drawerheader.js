import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

/**
 * Class to display the drawer header.
 */
class DrawerHeader extends Component {
	constructor (props) {
		super(props);
	}

	static propTypes = {
		image: PropTypes.string
	}

	render() {
		return (
			<TouchableOpacity>
				<View style={styles.container} >
					<Image style={styles.image} source={{uri: this.props.image, flex:1, width: 80, height: 80, left: 40}}/>
					<Text style={styles.text}>
						{this.props.name}
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