import React, { Component } from 'react';
import { StyleSheet, FlatList, View, TouchableHighlight, RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements';
import NotificationBikeItemHelper from './helpers/notificationbikeitem';
import SearchBarHelper from './helpers/searchbar';
import BaseView from './view';
import HomePresenter from '../presenters/home-presenter';

export default class HomeView extends BaseView {
	/**
	 * Creates an instance of BikeView
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.resetState();
		this._renderItem = this._renderItem.bind(this);
		this._renderSearchBar = this._renderSearchBar.bind(this);
		this.HomeP = new HomePresenter(this);
	}

	// TODO : Add update from new bike page that refreshes bike view page

	resetState = () => {
		this.state = { refresh: true, data: [], refreshing: false };
	}

	/**
	 * Extract data from the component's view and send an update to the presenter to do any logic before sending it to the model.
	 */
	sendUpdate = () => {
		const d = this.HomeP.getData();
		const i = d[d.length-1]
		// Extract data from components
		let new_data = { 
			data:	{
						id: i.id+1,
						name: 'BikeName'+(i.id+1),
						model: 'Model'+(i.id+1),
						owner: 'Owner'+(i.id+1),
						description: 'Testing',
						colour: ['Red', 'Blue'],
						serial_number: 72613671,
						notable_features: 'lime green grips, scratch on side',
						timeago: (i.id+1) + ' hrs ago',
						datetime: '3:30 PM - 16 Jan. 19',
						address: '162 Barrie St. Kingston, ON',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
		}
		const data = new_data; 
		// Get data to add here

		this.HomeP.update(data);
	}

	/**
	 * Renders an item from a list to the screen by extracting data.
	 * 
	 * @param {Object} item - An item to be rendered
	 */
	_renderItem = ({item}) => (
		<NotificationBikeItemHelper
			data={item}
			setBookmark={this.HomeP.setBookmark}
			bookmarked={this.HomeP.getBookmarked(item.id)}
			navigation={this.props.navigation}/>
	);

		/**
	 * Renders a search bar as the header including the profile icon and the filter button
	 */
	_renderSearchBar = () => (
		<SearchBarHelper 
			handleSearchFilter={(text) => this.HomeP.handleSearchFilter(text)}
			handleSearchCancel={this.HomeP.handleSearchCancel}
			handleSearchClear={this.HomeP.handleSearchClear}
			openFilter={this.sendUpdate}
			profilePicture={'https://i.imgur.com/uWzNO72.jpg'}/>
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
	 * Triggers when a component or this component is mounted.
	 */
	componentWillMount = () => {
		this.setState({
			data: this.HomeP.getData()
		});
	};


	/**
	 * Component is about to unmount, do any cleanup here.
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.HomeP);
	}

	_onRefresh = () => {
		this.HomeP.forceRefresh();
	}

	/**
	 * Extracts the item id as a string.
	 *
	 * @param {Object} item - An item being rendered
	 * @param {Number} index - The index of the item 
	 */
	_keyExtractor = (item, index) => item.id.toString();

	render() {
		return (	
				<View style={styles.container}>
					<FlatList
						data={this.state.data}
						extraData={this.state.refresh}
						keyExtractor={this._keyExtractor}
						renderItem={this._renderItem}
						ListHeaderComponent={this._renderSearchBar}
						stickyHeaderIndices={[0]}
						refreshControl={
						    <RefreshControl
						        colors={["#9Bd35A", "#689F38"]}
						        refreshing={this.state.refreshing}
						        onRefresh={() => this._onRefresh()}
						    />
						}>
					</FlatList>
				</View>
				);
	};

};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	}
});