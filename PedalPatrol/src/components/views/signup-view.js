import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, PixelRatio, Alert,} from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { TextInput } from 'react-native-paper';

import { styles, text, signup_styles } from './stylesheets/signup-styles';

import BaseView from './view';
import SafeArea from './helpers/safearea';
import LoginButton from './helpers/loginbutton';
import SignUpPresenter from '../presenters/signup-presenter';

/**
 * Class for the SignUp view
 * @extends BaseView
 */
class SignUpView extends BaseView {
	/**
	 * Set the navigation options, change the header to handle a back button.
	 *
	 * @param {Object} navigation, transitioning - Navigation properties
	 * @return {Object} Navigation option
	 */
	static navigationOptions = ({navigation, transitioning}) => {
		return {
			headerLeft: (<HeaderBackButton disabled={transitioning} onPress={()=>{navigation.state.params._onBack()}}/>)
		}
	}

	
	/**
	 * Create an instance of SignUpView
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			RPassword:'',
		};
		this.SignupP = new SignUpPresenter(this);
	}

	/**
	 * This function will trigger before the component mounts
	 */
	componentWillMount = () => {
		this.props.navigation.setParams({
			_onBack: this._onBack
		});
	}

	/**
	 * Component will unmount after this method is called, do any clean up here
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.SignupP);
	}

	/**
	 * When the back button is clicked, check if the user was editing.
	 */
	_onBack = () => {
		this.props.navigation.navigate('Login');
	}

	/**
	 * Handle the click of the button
	 */
	_handleClick() {
		if (this.state.password != this.state.RPassword) {
			Alert.alert('Please confirm your password!')}
		else {
			if (this.SignupP.checkInput(this.state.username, this.state.password, this.reportError)) {
				this.sendUpdate();
			}
		}
	}

	/**
	 * Send an update to the presenter with the relevant data.
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
		this.SignupP.update(data);
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
	 * Extract data from the component's view and send an update to the presenter to do any logic before sending it to the model
	 */
	render() {
		return (
			<View style={styles.container}>
				<SafeArea/>
				<View style={signup_styles.editGroup}>
					<View style={signup_styles.username}>
						<TextInput
							style={text.textInput}
							label="Username"
							textContentType="username"
							value={this.state.username}
							onChangeText={(username) => this.setState({username})}/>
					</View>

					<View style={signup_styles.password}>
						<TextInput
							style={text.textInput}
							label="Password"
							secureTextEntry
							textContentType="newPassword"
							value={this.state.password}
							onChangeText={(password) => this.setState({password})}/>
					</View>
					<View style={signup_styles.password}>
						<TextInput
							style={text.textInput}
							label="Re-enter your password"
							secureTextEntry
							textContentType="newPassword"
							value={this.state.RPassword}
							onChangeText={(RPassword) => this.setState({RPassword})}/>
					</View>
					
					<View style={{marginTop: 30}}>
						<LoginButton text="SIGN UP" onPress={this._handleClick.bind(this)}/>
					</View>
				</View>
			</View>
		);
	}
}

export default SignUpView;