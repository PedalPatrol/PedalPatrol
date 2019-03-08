import React, { Component } from 'react';
import { Platform, TouchableHighlight, Text, View, StyleSheet, FlatList } from 'react-native';
import Drawer from 'react-native-drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

import DrawerHelp from '../../../util/drawerhelper';
import SafeArea from './safearea';
import DrawerHeader from './drawerheader';
import NavigatorService from '../../../config/navigationservice';

/**
 * Class for the side drawer component.
 */
class SideDrawer extends Component {
	/**
	 * Creates an instance of the SideDrawer component.
	 *
	 * @constructor
	 * @param {Object} props - The component's properties
	 */
	constructor (props) {
		super(props);
		this.state = {drawerOpen: false};
		// console.log(this.state.drawerOpen);
		DrawerHelp.setDrawer(this);
	};

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
				size={25}
				onPress={() => this.navigateToScreen(item.screen)}>
				<Text style={styles.itemText}>{item.text}</Text>
			</Icon.Button>
		</View>
	);

	/**
	 * Navigate to a specified screen. Screen must be a possible navigation
	 *
	 * @param {string} screen - The name of the screen to navigate to.
	 */
	navigateToScreen = (screen) => {
		// console.log(screen);
		this.closeDrawer();
		NavigatorService.navigate(screen);
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
	 */
	openDrawer = () => {
		this._drawer.open();
		this.setState({drawerOpen: true});
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
				<DrawerHeader/>
		
				<FlatList
					style={styles.flatList}
					data={data}
					extraData={this.state}
					keyExtractor={this._keyExtractor}
					renderItem={this._renderItem}/>

				<SafeArea />
			</View>
		)
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

const data = [
	{
		text: 'Profile',
		icon_name: 'user',
		icon_type: 'FontAwesome',
		screen: 'Profile'
	},
	{
		text: 'Alerts',
		icon_name: 'exclamation-circle',
		icon_type: 'FontAwesome',
		screen: 'Alerts'
	},
	{
		text: 'Settings',
		icon_name: 'cog',
		icon_type: 'FontAwesome',
		screen: 'Settings'
	},
	{
		text: 'Logout',
		icon_name: 'sign-out',
		icon_type: 'FontAwesome',
		screen: 'Logout'
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
	}
});