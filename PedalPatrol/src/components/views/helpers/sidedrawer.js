import React, { Component } from 'react';
import {Platform, TouchableHighlight, Text, View, StyleSheet} from 'react-native';
import Drawer from 'react-native-drawer';

import DrawerHelp from '../../../util/drawerhelper';
import SafeArea from './safearea';

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
		console.log(this.state.drawerOpen);
		DrawerHelp.setDrawer(this);
	};

	/**
	 * Toggles the side drawer open and closed.
	 */
	toggleDrawer = () => {
		console.log(this.state.drawerOpen);
		this.setState({
			drawerOpen: !this.state.drawerOpen
		});
	}

	/**
	 * Render the contents of the drawer.
	 */
	renderSideMenuContent = () => {
		return (
			<View style={{height: '100%'}}>
				<SafeArea/>
				<Text style={styles.sideMenuContentItem}>
					This is the side menu
				</Text>
				<SafeArea />
			</View>
		)
	}

	render() {
		return (
			<Drawer
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
	sideMenuContentItem: {
		marginTop: 20,
		marginLeft: 20,
		marginRight: 20,
		borderWidth: 1,
		borderColor: '#fff',
		padding: 10,
		backgroundColor: '#557f90',
	}
});