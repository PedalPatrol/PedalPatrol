import React, { Component } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import Avatar from 'react-native-badge-avatar';
import PropTypes from 'prop-types';

import DrawerHelp from '../../../util/drawerhelper';

/**
 * Class to add a profile button to the search bar header.
 * @extends Component
 */
class ProfileButton extends Component {
	static propTypes = {
		numNotifications: PropTypes.number.isRequired,
		profilePicture: PropTypes.string
	}

	//<Image style={styles.profile} resizeMode="cover" source={{uri: this.props.profilePicture}} />
	render() {
		return (
			<View>
				{/* Profile */}
				<View style={{flex:1}}>
					<TouchableOpacity onPress={() => {DrawerHelp.openDrawer(this.props.numNotifications)}}>
						<Avatar
							style={styles.profile}
							size={40}
							name="Sean"
							source={this.props.profilePicture}
							badge={this.props.numNotifications}
				        />
					</TouchableOpacity>
				</View>
			</View>
		);  
	};
};

export default ProfileButton;

const styles = StyleSheet.create({
	profile: {
		flex:1,
		width: 40,
		height: 40,
		borderRadius: 20,
		left:10,
	}
});