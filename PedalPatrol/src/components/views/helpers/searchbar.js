import React, { Component } from 'react';
import { Platform, Image, StyleSheet, View, TouchableHighlight, TouchableOpacity, ViewStyle, NativeModules } from 'react-native';
import { Icon } from 'react-native-elements';
import { Searchbar } from 'react-native-paper';
import PropTypes from 'prop-types';

import { colours } from '../stylesheets/base-styles';

import SafeArea from './safearea';
import ProfileButton from './profilebutton';
import FilterHelper from './filter';

const {StatusBarManager} = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

/**
 * Class to add a search bar header to a page.
 * @extends Component
 */
class SearchBar extends Component {
	state = {
		value: '',
	}

	static propTypes = {
		profilePicture: PropTypes.string,
		name: PropTypes.string,
		searchBy: PropTypes.string,
		numNotifications: PropTypes.number.isRequired,
		handleSearchFilter: PropTypes.func.isRequired,
		handleSearchCancel: PropTypes.func.isRequired,
		handleSearchClear: PropTypes.func.isRequired,
		openFilter: PropTypes.func.isRequired,
	}

	render() {
		return (   
			<View>
				<SafeArea/>
				<View style={styles.searchContainer}>
					{/* Profile */}
					<ProfileButton 
						profilePicture={this.props.profilePicture} 
						numNotifications={this.props.numNotifications}/>

					{/* Search Bar */}
					<View style={{flex:6}}>
						<Searchbar        
							placeholder={"Search" + (this.props.searchBy && this.props.searchBy !== '' ? ' by ' + this.props.searchBy : '')}
							style={styles.searchBar}
							value={this.state.value}
							onChangeText={(text) => { this.props.handleSearchFilter(text); this.setState({ value: text })}}
						/>
					</View>
					
						{/* Filter button - Using sectioned multi select */}
						{/* <View style={{flex:1, bottom:25}}> */}
							{/* <FilterHelper onSelectedItemsChange={this.props.onSelectedItemsChange} selectedItems={this.props.selectedItems}/> */}
						{/* </View> */}

						{/* Filter button - Using button - Needs dropdown */}
						<View style={{flex:1, top:5}}>
							<TouchableOpacity onPress={() => this.props.openFilter()} accessibilityLabel="New">
								<Icon name="filter-list" type="MaterialIcons" size={30} color={colours.ppGreen} />
							</TouchableOpacity>
						</View>
					
				</View>
			</View>
		);  
	};
};

export default SearchBar;

const styles = StyleSheet.create({
	searchContainer: { // View that contains search bar
		backgroundColor: colours.ppWhite,
		flexDirection:'row',
		paddingBottom: STATUSBAR_HEIGHT,
		paddingTop: STATUSBAR_HEIGHT
	},
	searchBar: {
		backgroundColor: colours.ppGrey,
		borderWidth: 1,
		borderRadius: 50,
		height: 35,
		left: 20,
		top: 5,
		marginRight: 20
	},
});