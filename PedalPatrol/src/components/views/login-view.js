import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, PixelRatio, Alert, TouchableOpacity, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles, text, colours, login_styles } from './stylesheets/login-styles';

import BaseView from './view';
import SafeArea from './helpers/safearea';
import LoginButton from './helpers/loginbutton';
import LoginPresenter from '../presenters/login-presenter';

/**
 * Class for the Login view
 * @extends BaseView
 */
class LoginView extends BaseView {
	
	static navigationOptions = {header:null};
	
	/**
	 * Create an instance of LoginView
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		};
		this.LoginP = new LoginPresenter(this);
	}

	/**
	 * Navigate to the tabs screen
	 */
	navigateToTabs = () => {
		this.props.navigation.navigate('Tabs');
	}

	/**
	 * Handle the click of the signup button
	 */
	_handleClick() {
		if (this.LoginP.checkInput(this.state.username, this.state.password, this.reportError)) {
			this.sendUpdate();
		}
	}

	/**
	 * Called if the user input username or password is invalid.
	 * @param {Object} errmsg - the error message that corresponding to the problem.
	 */
	reportError = (errmsg) => {
		Alert.alert(
				'Error',
				errmsg,
				[
					{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);
	}

	/**
	 * Send an update to the presenter
	 */
	sendUpdate = () => {
		// Extract data from components
		let new_data = {
			data:	{
				username: this.state.username,
				password: this.state.password
			}
		}
		let data = new_data;
		this.LoginP.update(data);
	}

	/**
	 * Refreshes the state of the component so new data is fetched.
	 */
	refreshState = () => {
		this.setState({
			refresh: !this.state.refresh
		});
	};

	/**
	 * Handle an incorrect login by displaying an alert
	 */
	handleLoginIncorrect = () => {
		Alert.alert(
			'Error',
			'Username or Password is incorrect',
			[
				{ text: "Ok", onPress: () => {}, style: "ok" },
			],
			{cancelable: false}
		);
	};

	/**
	 * Component will unmount after this method is called, do any clean up here
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.LoginP);
	}

	renderContent = () => (
		<View>
			<View style={login_styles.centered}>
				<Text style={login_styles.title}>Pedal Patrol</Text>
			</View>
			<View style={login_styles.editGroup}>
				<View style={login_styles.username}>
					<TextInput
						style={text.textInput}
						label="Username"
						textContentType='username'
						value={this.state.username}
						onChangeText={(username) => this.setState({username})}/>
				</View>
				
				<View style={login_styles.password}>
					<TextInput
						style={text.textInput}
						label="Password"
						textContentType='password'
						secureTextEntry
						value={this.state.password}
						onChangeText={(password) => this.setState({password})}/>
				</View>
				
				<View style={{marginTop: 30}}>
					<LoginButton text="SIGN IN" onPress={this._handleClick.bind(this)}/>
				</View>
				
				<View>
					<Text style={login_styles.centerText}> Login With Social Account: </Text>
					<View style={login_styles.socialIcons}>
						<Icon.Button
							name="facebook"
							type="FontAwesome"
							color="#000000"
							backgroundColor={colours.ppGrey}
							onPress={() => 'default'}
							size={30}>
						</Icon.Button>
						<Icon.Button
							name="twitter"
							type="FontAwesome"
							color="#000000"
							backgroundColor={colours.ppGrey}
							onPress={() => 'default'}
							size={30}>
						</Icon.Button>
					</View>
				</View>
			</View>
		</View>
	);

	/**
	 * Extract data from the component's view and send an update to the presenter to do any logic before sending it to the model
	 */
	render() {
		return (
			<View style={[styles.container]}>
				<SafeArea overrideColour={colours.ppGrey} />
				{
					Platform.OS === 'ios' &&
					<KeyboardAvoidingView
						style={styles.container}
						behavior="padding"
						enabled>
						{this.renderContent()}
					</KeyboardAvoidingView>
				}

				{
					Platform.OS !== 'ios' &&
					this.renderContent()
				}

				<View style={login_styles.bottom}>
					<TouchableOpacity style={login_styles.signupButton} onPress={() => this.props.navigation.navigate('Signup')}>
						<Text style={login_styles.signupText}>
							{"New Member?      SIGN UP!"}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

export default LoginView;