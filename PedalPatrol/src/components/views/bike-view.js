import React, { Component } from 'react';
import { StyleSheet, FlatList, View, TouchableHighlight, Alert, RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements';

import SafeArea from './helpers/safearea';
import BikeItemHelper from './helpers/bikeitem';
import SearchBarHelper from './helpers/searchbar';
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
		// Another way to bind is to do () => {}
		this._renderItem = this._renderItem.bind(this);
		this._renderSearchBar = this._renderSearchBar.bind(this);
		this.BikeP = new BikePresenter(this);
	}

	/**
	 * Resets the state
	 */
	resetState = () => {
		this.state = { refresh: true, data: [], refreshing: false };
	}

	/**
	 * Renders an item from a list to the screen by extracting data.
	 * 
	 * @param {Object} item - An item to be rendered
	 */
	_renderItem = ({item}) => (
		<BikeItemHelper
			data={item}
			navigation={this.props.navigation}/>
	);

	/**
	 * Sets the profile image for the view
	 */
	_setProfileImage = () => {
		this.BikeP.getProfileImage((result) => this.setState({profilePicture: result}));
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
		<SearchBarHelper 
			handleSearchFilter={(text) => this.BikeP.handleSearchFilter(text)}
			handleSearchCancel={this.BikeP.handleSearchCancel}
			handleSearchClear={this.BikeP.handleSearchClear}
			openFilter={this.temporaryFilter}
			profilePicture={this.state.profilePicture}
			numNotifications={this.BikeP.getNotificationCount()}/>
	);


	/**
	 * Refreshes the state of the component so new data is fetched.
	 */
	refreshState = () => {
		this.setState({ 
			refresh: !this.state.refresh
		});
	};

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
					{/* List of bikes */}
					<FlatList
						data={this.state.data}
						extraData={this.state.refresh}
						keyExtractor={this._keyExtractor}
						renderItem={this._renderItem}
						ListHeaderComponent={this._renderSearchBar}
						stickyHeaderIndices={[0]}>
					</FlatList>

					{/* Add button */}
					<TouchableHighlight style={styles.add} onPress={() => this.props.navigation.navigate('AddBike', {title: 'Add Bike'})} accessibilityLabel="New">
						<Icon name="md-add" type="ionicon" size={30} color="#01a699" />
					</TouchableHighlight>
				</View>
				);
	};

};

export default BikeView;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	add: {
		borderWidth:1,
		borderColor:'rgba(0,0,0,0.2)',
		alignItems:'center',
		justifyContent:'center',
		width:60,
		height:60,
		backgroundColor:'#fff',
		borderRadius:60,
		position:'absolute',
		bottom:15,
		right:15,
		alignSelf:'flex-end',
	}
});