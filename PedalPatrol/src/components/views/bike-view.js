import React, { Component } from 'react';
import { StyleSheet, FlatList, View, TouchableHighlight, Alert, RefreshControl, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';

import { styles, colours, bike_styles } from './stylesheets/bike-styles';

import SafeArea from './helpers/safearea';
import BikeItem from './helpers/bikeitem';
import SearchBar from './helpers/searchbar';
import BaseView from './view';
import BikePresenter from '../presenters/bike-presenter';

/**
 * Class for the Bike view
 * @extends BaseView
 */
class BikeView extends BaseView {
	/**
	 * Creates an instance of BikeView
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.resetState();

		this.searchBarRef = null;
		// Another way to bind is to do () => {}
		this._renderItem = this._renderItem.bind(this);
		this._renderSearchBar = this._renderSearchBar.bind(this);
		this.BikeP = new BikePresenter(this);
	}

	/**
	 * Resets the state
	 */
	resetState = () => {
		this.state = { refresh: true, data: [], refreshing: false, profileData: {} };
	}

	/**
	 * Renders an item from a list to the screen by extracting data.
	 * 
	 * @param {Object} item - An item to be rendered
	 */
	_renderItem = ({item}) => (
		<BikeItem
			data={item}
			navigation={this.props.navigation}/>
	);

	/**
	 * Sets the profile image for the view
	 */
	_setProfileImage = () => {
		this.BikeP.getProfileImage((result) => this.setState({profileData: result}));
	}
	
	temporaryFilter = () => {
		Alert.alert(
				"The search filter is currently disabled.",
				"Sorry for any inconvenience.",
				[
					{ text: "Ok", style: "ok" },
				],
				{ cancelable: false },
			);
	}

	/**
	 * Renders a search bar as the header including the profile icon and the filter button.
	 * TODO : Get profile picture from profile page
	 */
	_renderSearchBar = () => (
		<SearchBar 
			handleSearchFilter={(text) => this.BikeP.handleSearchFilter(text)}
			handleSearchCancel={this.BikeP.handleSearchCancel}
			handleSearchClear={this.BikeP.handleSearchClear}
			searchBy='name'
			openFilter={this.temporaryFilter}
			profilePicture={this.state.profileData.profilePicture}
			name={this.state.profileData.full_name}
			numNotifications={this.BikeP.getNotificationCount()}
			searchRef={(ref) => this.searchBarRef = ref}/>
	);


	/**
	 * Refreshes the state of the component so new data is fetched.
	 */
	refreshState = () => {
		this.setState({ 
			refresh: !this.state.refresh
		});
	};

	/**
	 * Component is about to mount
	 */
	componentWillMount = () => {
		this._setProfileImage();
	}

	/**
	 * Triggers when the component is mounted.
	 */
	componentDidMount = () => {
		this.setState({
			data: this.BikeP.getData()
		});
		this._setProfileImage();
	};

	/**
	 * Component has updated with set state.
	 */
	componentDidUpdate = () => {
		if (this.searchBarRef && !this.searchBarRef.isSearching()) {
			const data = this.BikeP.getData();
			// DANGEROUS - Only set the state again if the data is different
			if (JSON.stringify(data) !== JSON.stringify(this.state.data)) {
				this.setState({data}); // This is very dangerous to do in componentDidUpdate
			}
		}
	}

	/**
	 * Component is about to unmount, do any cleanup here.
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.BikeP);
	}

	/**
	 * Triggers a force refresh of the view
	 */
	_onRefresh = () => {
		this.BikeP.forceRefresh();
	}

	/**
	 * Extracts the item id as a string.
	 *
	 * @param {Object} item - An item being rendered
	 * @param {Number} index - The index of the item 
	 */
	_keyExtractor = (item, index) => item.id;

	/**
	 * Renders the screen
	 */
	render() {
		return (
				<View style={styles.container}>
					<SafeArea/>
					<View>
						<FlatList
							scrollEnabled={false}
							ListHeaderComponent={this._renderSearchBar}
							stickyHeaderIndices={[0]}/>
					</View>
					{/* List of bikes */}
					<ScrollView>
						<FlatList
							data={this.state.data}
							extraData={this.state.refresh}
							keyExtractor={this._keyExtractor}
							renderItem={this._renderItem}
							contentContainerStyle={{paddingBottom: 5}}>
						</FlatList>
					</ScrollView>

					{/* Add button */}
					<TouchableHighlight style={bike_styles.add} onPress={() => this.props.navigation.navigate('AddBike', {title: 'Add Bike'})} accessibilityLabel="New">
						<Icon name="md-add" type="ionicon" size={30} color={colours.ppGreen} />
					</TouchableHighlight>
				</View>
		);
	};

};

export default BikeView;