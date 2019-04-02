import React, { Component } from 'react';
import { Platform, Image, StyleSheet, View, TouchableHighlight, TouchableOpacity, ViewStyle, NativeModules } from 'react-native';
import { Icon } from 'react-native-elements';
import { Searchbar } from 'react-native-paper';
import PropTypes from 'prop-types';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

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
		selectedItems: [],
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
		searchRef: PropTypes.func
	}

	/**
	 * Component mounted
	 */
	componentDidMount = () => {
		if (this.props.searchRef) {
			this.props.searchRef(this);			
		}
	}

	/**
	 * Returns if there is text in the search bar. If the user is searching something.
	 *
	 * @return {Boolean} If the user is currently searching
	 */
	isSearching = () => {
		return this.state.value !== '';
	}

	/**
	 * Add the new selected items to the state and update
	 *
	 * @param {List} selectedItems - List of selected items
	 */
	_onSelectedItemsChange = (selectedItems) => {
		this.setState({ selectedItems });
	} 

	/**
	 * Renders an icon.
	 */
	_renderIcon = () => (
		<Icon name="filter-list" type="MaterialIcons" size={30} color={colours.ppGreen} />
	);

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
								<Icon name="filter-list" type="MaterialIcons" size={35} color={colours.ppGreen} />
							</TouchableOpacity>
						</View>
					
				</View>


				{/*<SectionedMultiSelect
					items={filters}
					displayKey='name'
					uniqueKey={'id'}
					colors={{ primary: this.state.selectedItems.length ? 'forestgreen' : 'crimson' }}
					selectText=''
					selectToggleIconComponent={this._renderIcon()}
					hideSelect
					showDropDowns
					showChips={false}
					alwaysShowSelectText={false}
					showCancelButton={false}
					onSelectedItemsChange={this._onSelectedItemsChange}
					selectedItems={this.state.selectedItems}
					ref={(SectionedMultiSelect) => this.sectionedMultiSelect = SectionedMultiSelect}
				/>*/}
			</View>
		);  
	};
};

export default SearchBar;

const filters = [
	{
		id: 0,
		name: 'Model',
		icon: { uri: "https://cdn4.iconfinder.com/data/icons/free-crystal-icons/512/Gemstone.png" }
	},
	{
		id: 1,
		name: 'Brand',
		icon: { uri: "https://cdn4.iconfinder.com/data/icons/free-crystal-icons/512/Gemstone.png" }
	}
]

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