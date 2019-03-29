import SettingsList from 'react-native-settings-list';
import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, Image, PixelRatio, Alert } from 'react-native';
import { HeaderBackButton } from 'react-navigation';

import { styles, colours, settings_styles } from './stylesheets/settings-styles';

import BaseView from './view';
import TimeUtil from '../../util/timeutility';

/**
 * Class for the Settings view
 * @extends BaseView
 */
class SettingsView extends BaseView {

	/**
	 * Creates an instance of the setting view
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props){
		super(props);
		this.onValueChange = this.onValueChange.bind(this);
		this.state = {switchValue: false};
	}

	/**
	 * Set the navigation options, change the header to handle a back button.
	 *
	 * @return {Object} Navigation option
	 */
	static navigationOptions = ({navigation, transitioning}) => {
		const { params = {} } = navigation.state;
		const back = params._onBack ? params._onBack : () => 'default';
		return {
			headerLeft: (<HeaderBackButton disabled={transitioning} onPress={()=>{back()}}/>),
		};
	}

	/**
	 * Component is about to mount.
	 */
	componentWillMount = () => {
		this.props.navigation.setParams({
			_onBack: this._onBack,
		});
	}

	/**
	 * Back function to decide go back to the previous page.
	 */
	_onBack = () => {
		this.props.navigation.navigate('Tabs');
	}

	/**
	 * toggle the status of item
	 * @ param {Boolean} value - status of the item
	 */
	onValueChange(value){
		this.setState({switchValue: value});
	}

	/**
	 * Flattens a list of objects into an object with properties.
	 * Example:
	 * 		Original: [{key: k1, value: v1}, {key: k2, value: v2}]
	 * 		After:	  {k1: v1, k2: v2}
	 * 
	 * @param {List} params - A list of key, value pair objects
	 * @return {Object} An object with properties 
	 */
	getParams = (params) => {
		let paramsAsObject = {};
		for (let i=0; i < params.length; i++) {
			// Property value 'key' becomes the property in final object
			paramsAsObject[params[i].key] = params[i].value;
		}
		return paramsAsObject;
	}

	/**
	 * Navigate to a particular screen.
	 *
	 * @param {string} screen - The name of the screen to navigate to.
	 * @param {Object} params - The params to add to the navigation call. Key, value pairs
	 */
	navigate = (screen, params) => {
		let routeParams = {};
		if (params && params != null || params != undefined && params.length > 0) { // If there's parameters, flatten them
			routeParams = this.getParams(params);
		}

		this.props.navigation.navigate({
			routeName: screen,
			params: routeParams,
			key: screen + TimeUtil.getDateTime()
		});
	}

	render() {
		var bgColor = '#DCE3F4';
		return (
			<View style={styles.container}>

				<View style={styles.container}>
					<SettingsList borderColor={colours.ppDarkGrey} defaultItemSize={60}>
						<SettingsList.Item
							hasNavArrow={false}
							title='Account Settings'
							titleStyle={settings_styles.settingsItem}
							itemWidth={50}
							borderHide={'Both'}/>
			  			<SettingsList.Item
							title='Change Password'
							onPress= {() =>  Alert.alert('Route To change password')}
							borderHide={'Both'}/>
					<SettingsList.Header headerStyle={{marginTop:2}}/>
						<SettingsList.Item
							hasNavArrow={false}
							title='Device'
							titleStyle={settings_styles.settingsItem}
							itemWidth={50}
							borderHide={'Both'}/>
			  			<SettingsList.Item
							title='Notifications'
							onPress= {() => this.navigate('Notifications')}/>
			  		<SettingsList.Header headerStyle={{marginTop:2}}/>
			  			<SettingsList.Item
						   hasNavArrow={false}
							titleStyle={settings_styles.logout}
							title='Logout'
							onPress= {() => this.navigate('AuthLoading', [{ key: 'logout', value: true }])}/>

					</SettingsList>
				</View>
			</View>
		);
	}

}

export default SettingsView;