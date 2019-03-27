import React, { Component } from 'react';
import { Platform, TouchableHighlight, Text, View, StyleSheet, FlatList } from 'react-native';
import Drawer from 'react-native-drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

import DrawerHelp from '../../../util/drawerhelper';
import SafeArea from './safearea';
import DrawerHeader from './drawerheader';
import NavigatorService from '../../../config/navigationservice';

/**
 * Class for the side drawer component.
 */
class SideDrawer extends Component {
	static propTypes = {
		renderMainContent: PropTypes.func.isRequired
	}

	/**
	 * Creates an instance of the SideDrawer component.
	 *
	 * @constructor
	 * @param {Object} props - The component's properties
	 */
	constructor (props) {
		super(props);
		this.state = { drawerOpen: false, numNotifications: 0, profileData: {} };
		// console.log(this.state.drawerOpen);
		DrawerHelp.setDrawer(this);
	};

	componentDidMount = () => {
		this.setState({
			profileData: {profilePicture: DrawerHelp.getDefaultProfile()}
		})
	}

	/**
	 * Toggles the side drawer open and closed.
	 */
	toggleDrawer = () => {
		// console.log(this.state.drawerOpen);
		this.setState({
			drawerOpen: !this.state.drawerOpen
		});
	}

	/**
	 * Render a text input item.
	 * 
	 * @param {Object} item - A list item
	 */
	_renderItem = ({item}) => (
		<View style={styles.icon}>
			<Icon.Button
				name={item.icon_name} 
				type={item.icon_type}
				backgroundColor="#F5FCFF"
				color="#000"
				size={30}
				onPress={() => this.onItemPressed(item)}>
				<Text style={styles.itemText}>{item.text}</Text>
				{
					this.state.numNotifications > 0 &&
					item.text === 'Alerts' &&
					<View style={styles.notifications}>
						<Text style={styles.notificationsText}>{this.state.numNotifications}</Text>
					</View>
				}
			</Icon.Button>
		</View>
	);

	/**
	 * Function is called when a drawer item is pressed.
	 *
	 * @param {Object} item - The drawer item that is pressed, see drawerData for possible items.
	 */
	onItemPressed = (item) => {
		let routeParams = {};
		if (item.hasOwnProperty('params')) { // If there's parameters, flatten them
			routeParams = this.getParams(item.params);
		}
		this.navigateToScreen(item.screen, routeParams);
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
	 * Navigate to a specified screen. Screen must be a possible navigation
	 *
	 * @param {string} screen - The name of the screen to navigate to.
	 */
	navigateToScreen = (screen, params) => {
		// console.log(screen);
		this.closeDrawer();
		// Need to use navigator service because we are navigating from above the root navigator
		NavigatorService.navigate(screen, params);
	}

	/**
	 * Closes the drawer.
	 */
	closeDrawer = () => {
		this._drawer.close();
		this.setState({drawerOpen: false});
	};
	
	/**
	 * Opens the drawer.
	 *
	 * @param {Number} numNotifications - The number of notifications
	 */
	openDrawer = (numNotifications) => {
		this._drawer.open();
		this.setState({drawerOpen: true, numNotifications});
	};


	/**
	 * Extract the key from the item and index
	 */
	_keyExtractor = (item, index) => item.text;

	/**
	 * Render the contents of the drawer.
	 */
	renderSideMenuContent = () => {
		return (
			<View style={{height: '100%'}}>
				<SafeArea/>
				<DrawerHeader 
					image={this.state.profileData.profilePicture}
					name={this.state.profileData.full_name ? this.state.profileData.full_name : ''}/>
		
				<FlatList
					style={styles.flatList}
					data={drawerData}
					extraData={this.state}
					keyExtractor={this._keyExtractor}
					renderItem={this._renderItem}/>

				<SafeArea />
			</View>
		);
	}

	render() {
		return (
			<Drawer
				ref={(ref) => this._drawer = ref}
				open={this.state.drawerOpen}
				content={this.renderSideMenuContent()}
				type="overlay"
				tapToClose={true}
				styles={drawerStyles}
				openDrawerOffset={0.2}
				panCloseMask={0.2}
				closedDrawerOffset={-3}
				onClose={() => {
					this.setState({drawerOpen: false});
				}}
				panOpenMask={0.80}
				captureGestures="open"
				acceptPan={false}>
						
					{/* Main Content goes here (e.g. Tab Views) */}
					{this.props.renderMainContent()}

			</Drawer>
		);
	}
}

export default SideDrawer;

/**
 * 'text' property is the drawer name
 * 'icon_name' property is the icon name from the icon type
 * 'icon_type' property is the type of icon (see react-native-vector-icons)
 * 'screen' property must be the stack navigator defined in navigation.js
 * 'params' property is a list of key, value pair objects. The 'key' property will appear as a param in the navigated to screen, with value 'value'
 */
const drawerData = [
	{
		text: 'Profile',
		icon_name: 'user',
		icon_type: 'FontAwesome',
		screen: 'ProfileStack',
	},
	{
		text: 'Alerts',
		icon_name: 'exclamation-circle',
		icon_type: 'FontAwesome',
		screen: 'AlertStack'
	},
	{
		text: 'Settings',
		icon_name: 'cog',
		icon_type: 'FontAwesome',
		screen: 'SettingStack'
	},
	{
		text: 'Help Center',
		icon_name: 'cog',
		icon_type: 'FontAwesome',
		screen: 'HelpStack'
	},
	{
		text: 'Logout',
		icon_name: 'sign-out',
		icon_type: 'FontAwesome',
		screen: 'AuthLoading',
		params: [{ key: 'logout', value: true }]
	}

]

const drawerStyles = StyleSheet.create({
   drawer: {
		shadowColor: '#000000',
		shadowOpacity: 0.8,
		shadowRadius: 3,
		// backgroundColor: 'rgba(0, 0, 0, 0.5)',
		backgroundColor: '#F5FCFF',
	},
	main: {
		paddingLeft: 3
	},
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	icon: {
		marginTop: 5,
		marginLeft: 5,
		marginRight: 5,
		// padding: 10
	},
	flatlist: {
		flex: 1,
		marginTop: 5
	},
	itemText: {
		flex: 1,
		fontSize: 20,
	    paddingRight: 40,
	    marginLeft: 20,
	    marginTop: 3
	},
	notifications: {
		width: 30,
		height: 30,
		borderRadius: 15,
		marginLeft: 5,
		backgroundColor: '#696969',
		alignItems: 'center',
		justifyContent: 'center'
	},
	notificationsText: {
		fontSize: 20, 
		color: 'white', 
	}
});