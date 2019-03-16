import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, Alert } from 'react-native';

import BaseView from './view';
import AuthLoadingPresenter from '../presenters/authloading-presenter';

/**
 * Class for the auth loading view to process the state before continuing.
 */
class AuthLoadingView extends BaseView {
	state = {
		shouldLogout: false
	}

	/**
	 * Creates an instance of AuthLoadingView.
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.AuthLoadingP = new AuthLoadingPresenter(this);
	}

	/**
	 * Component is about to mount
	 */
	componentWillMount = () => {
		const { navigation } = this.props;
		const shouldLogout = navigation.getParam('logout', false);
		this.AuthLoadingP.tryLogout(shouldLogout, this.onLogoutSuccess, this.onLogoutFailure);
		this.setState({shouldLogout});
	}

	/**
	 * Component mounted
	 */
	componentDidMount = () => {
		if (!this.state.shouldLogout) {
			this.AuthLoadingP.checkAuthState(this.onAuthenticationSuccess, this.onAuthenticationFailure);
		}
	}

	/**
	 * Component will unmount after this method is called, do any clean up here.
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method.
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.AuthLoadingP);
	}

	/**
	 * A function to call on the success of authentication verification.
	 */
	onAuthenticationSuccess = () => {
		console.log('Authentication Success!');
		this.navigateToScreen('App');
	}

	/**
	 * A function to call on the failure of authentication verification.
	 */
	onAuthenticationFailure = () => {
		console.log('Authentication Failure!');
		this.navigateToScreen('AuthStack');
	}

	/**
	 * A function to call on a successful logout.
	 */
	onLogoutSuccess = () => {
		console.log('Logout Success');
		this.navigateToScreen('AuthStack');
	}

	/**
	 * A function to call on a failure to logout.
	 */
	onLogoutFailure = () => {
		console.log('Logout Failure');
		Alert.alert(
			"Error: Unable to logout",
			"Please try again.",
			[
				{ text: "Ok", style: "ok" },
			],
			{ cancelable: false },
		);
		this.navigateToScreen('App');
	}

	/**
	 * Navigate to a particular screen
	 *
	 * @param {string} screen - A screen to navigate to. See defined screens in navigation.js
	 */
	navigateToScreen = (screen) => {
		const { navigate } = this.props.navigation;
		navigate(screen);
	}

	render() {
		return (
			<View style={this.state.shouldLogout ? styles.logoutLoading : styles.loading} pointerEvents="none">
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
	}, 
	logoutLoading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	}
});