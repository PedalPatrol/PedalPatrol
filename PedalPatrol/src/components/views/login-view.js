import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, Image, PixelRatio, Alert,} from 'react-native';

import BaseView from './view';
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
	 * Extract data from the component's view and send an update to the presenter to do any logic before sending it to the model
	 */
	render() {
		return (
			<View style={styles.view}>
				<View style={styles.centered}>
					<Text style={styles.title}>Pedal Patrol</Text>
				</View>
				<View style={styles.editGroup}>
					<View style={styles.username}>
						<TextInput
							style={styles.edit}
							placeholder="Username"
							placeholderTextColor="#c4c4c4"
							onChangeText={(username) => this.setState({username})}/>
					</View>
					<View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>
					<View style={styles.password}>
						<TextInput
						style={styles.edit}
						placeholder="Password"
						placeholderTextColor="#c4c4c4"
						secureTextEntry={true}
						onChangeText={(password) => this.setState({password})}/>
					</View>
					
					<View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>
					
					<View style={{marginTop: 30}}>
						<LoginButton text="SIGN IN" onPress={this._handleClick.bind(this)}/>
					</View>
					
					<View>
						<Text style={styles.centerText}> Login With Social Account: </Text>
					</View>
					
					<View style={{marginTop: 30}}>
						<LoginButton text="New Member?      SIGN UP!" onPress={() => this.props.navigation.navigate('Signup')}/>
					</View>
				</View>
			</View>
		);
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
		new_data = {
			data:	{
				username: this.state.username,
				password: this.state.password
			}
		}
		data = new_data;
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
}

export default LoginView;

const styles = StyleSheet.create({
	title:{
		color: 'black',
		fontWeight: 'bold',
		fontSize: 50,
	},
	centered:{
		alignItems:'center',
		marginTop:30,
	},
	centerText: {
		textAlign: 'center',
		marginTop:20,
		},
	view: {
		flex: 1,
		backgroundColor: 'grey',
	},
	editGroup: {
		margin: 20,
	},
	username: {
		marginTop: 30,
		height: 48,
		backgroundColor: 'grey',
		justifyContent: 'center',
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
	},
	password: {
		marginTop: 5,
		height: 48,
		backgroundColor: 'grey',
		justifyContent: 'center',
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
	},
	edit:{
		height: 40,
		fontSize: 13,
		backgroundColor: 'grey',
		paddingLeft: 15,
		paddingRight: 15,
	},
});