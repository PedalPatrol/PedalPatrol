import React, { Component } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';

import DrawerHelp from '../../../util/drawerhelper';

/**
 * Class to add a profile button to the search bar header
 */
class ProfileButton extends Component {
	render() {
		return (
			<View>
				{/* Profile */}
				<View style={{flex:1}}>
					<TouchableOpacity onPress={() => {DrawerHelp.toggle()}}>
						<Image style={styles.profile} resizeMode="cover" source={{uri: this.props.profilePicture}} />
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