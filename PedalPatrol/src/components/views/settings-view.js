import SettingsList from 'react-native-settings-list';
import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, Image, PixelRatio, Alert } from 'react-native';
import { HeaderBackButton } from 'react-navigation';

import BaseView from './view';


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

	componentWillMount = () => {
		this.props.navigation.setParams({
			_onBack: this._onBack,
		});
	}

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

	render() {
		var bgColor = '#DCE3F4';
		return (
			<View style={{backgroundColor:'#EFEFF4',flex:1}}>

				<View style={{backgroundColor:'#EFEFF4',flex:1}}>
					<SettingsList borderColor='#c8c7cc' defaultItemSize={60}>
						<SettingsList.Item
							hasNavArrow={false}
							title='Account Settings'
							titleStyle={{color:'#009688', marginBottom:3, fontWeight:'500'}}
							itemWidth={50}
							borderHide={'Both'}/>
						<SettingsList.Item
							title='ReportLost'
							onPress= {() =>   this.props.navigation.navigate('ReportLost')}
							borderHide={'Both'}/>
						<SettingsList.Item
							title='ReportFound'
							onPress= {() =>   this.props.navigation.navigate('ReportFound')}
							borderHide={'Both'}/>
			  			<SettingsList.Item
							title='Change Password'
							onPress= {() =>  Alert.alert('Route To change password')}
							borderHide={'Both'}/>
					<SettingsList.Header headerStyle={{marginTop:2}}/>
						<SettingsList.Item
							hasNavArrow={false}
							title='Device'
							titleStyle={{color:'#009688', marginBottom:3, fontWeight:'500'}}
							itemWidth={50}
							borderHide={'Both'}/>
			  			<SettingsList.Item
							title='Notifications'
							onPress= {() => this.props.navigation.navigate('Notifications')}/>
			  		<SettingsList.Header headerStyle={{marginTop:2}}/>
			  			<SettingsList.Item
						   hasNavArrow={false}
							titleStyle={{color:'red', fontSize: 16}}
							title='Logout'
							onPress= {() => Alert.alert('Route To logout')}/>

					</SettingsList>
				</View>
			</View>
		);
	}

}

export default SettingsView;

const styles = StyleSheet.create({
	imageStyle:{
		marginLeft:15,
		marginRight:20,
		alignSelf:'center',
		width:20,
		height:24,
		justifyContent:'center'
	}
});