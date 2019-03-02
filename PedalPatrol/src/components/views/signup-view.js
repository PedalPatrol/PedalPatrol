import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, Image, PixelRatio, Alert,} from 'react-native';
import { HeaderBackButton } from 'react-navigation';

import BaseView from './view';
import LoginButton from './helpers/loginbutton';
import SignUpPresenter from '../presenters/signup-presenter';

export default SignUpView;
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
	 * Extract data from the component's view and send an update to the presenter to do any logic before sending it to the model
	 */
	render() {
		return (
			<View style={styles.view}>
				 
				<View style={styles.editGroup}>
					<View style={styles.username}>


						<TextInput
							style={styles.edit}
							placeholder="Username"
							placeholderTextColor="#c4c4c4"
							onChangeText={(username) => this.setState({username})}
							/>
					</View>
					<View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>
						<View style={styles.password}>
							<TextInput
							style={styles.edit}
							placeholder="Password"
							placeholderTextColor="#c4c4c4"
							secureTextEntry={true}
							onChangeText={(password) => this.setState({password})}
							/>
						</View>
						 <View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>
							<View style={styles.password}>
													 <TextInput
													 style={styles.edit}
													 placeholder="Reentry your password"
													 placeholderTextColor="#c4c4c4"
													 secureTextEntry={true}
													 onChangeText={(RPassword) => this.setState({RPassword})}
													 />
												 </View>
													<View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>
						<View style={{marginTop: 30}}>
						<LoginButton text="SIGN UP" onPress={this._handleClick.bind(this)}/>
						</View>


				</View>
			</View>
		);
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
		new_data = {
			data:	{
				username: this.state.username,
				password: this.state.password
			}
		}
		data = new_data;
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
}

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