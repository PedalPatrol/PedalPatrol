import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import PropTypes from 'prop-types';

import { colours } from '../stylesheets/base-styles';

/**
 * Class to add a login button helper for the login and signup views
 */
class LoginButton extends Component {

	static propTypes = {
		onPress: PropTypes.func.isRequired,
		text: PropTypes.string.isRequired
	}

	_renderContent() {
		return(
			<View >
				<Text style={styles.text}>{this.props.text}</Text>
			</View>
		);
	}

	render() {
		if (Platform.OS === 'android') {
			return(
				<TouchableNativeFeedback
					style={styles.content}
					onPress={this.props.onPress}>
					{this._renderContent()}
				</TouchableNativeFeedback>
		  	);
		} else if (Platform.OS === 'ios') {
			return(
				<TouchableHighlight
					style={styles.content}
					onPress={this.props.onPress}>
					{this._renderContent()}
				</TouchableHighlight>
			);
		}
	}
}

export default LoginButton;

const styles = StyleSheet.create({
	text: {
		color: 'black',
		fontSize: 14,
		fontWeight:'bold',
	},
	content: {
		height: 45,
		borderRadius: 30,
		backgroundColor: colours.ppGreen,
		alignItems:'center',
		justifyContent:'center',
		overflow: 'hidden'
	},
});