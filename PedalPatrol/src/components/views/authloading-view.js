import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import BaseView from './view';
import AuthLoadingPresenter from '../presenters/authloading-presenter';

/**
 * Class for the auth loading view to process the state before continuing.
 */
class AuthLoadingView extends BaseView {
	/**
	 * Creates an instance of AuthLoadingView
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.AuthLoadingP = new AuthLoadingPresenter(this);
	}

	/**
	 * Component mounted
	 */
	componentDidMount = () => {
		this.AuthLoadingP.checkAuthenticationState(this.onAuthenticationSuccess, this.onAuthenticationFailure);
	}

	/**
	 * A function to call on the success of authentication verification
	 */
	onAuthenticationSuccess = () => {
		console.log('Authentication Success!');
		const { navigate } = this.props.navigation;
		navigate('App');
	}

	/**
	 * A function to call on the failure of authentication verification
	 */
	onAuthenticationFailure = () => {
		console.log('Authentication Failure!');
		const { navigate } = this.props.navigation;
		navigate('AuthStack');
	}

	render() {
		return (
			<View style={styles.loading} pointerEvents="none">
				<ActivityIndicator size='large' color="#0000ff" />
			</View>
		);
	}
}

export default AuthLoadingView;

const styles = StyleSheet.create({
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F5FCFF88',
	}
});