import React, { Component } from 'react';
import { StyleSheet, FlatList, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';
import BikeItemHelper from './helpers/bikeitem';
import SearchBarHelper from './helpers/searchbar';
import BaseView from './view';
import BikePresenter from '../presenters/bike-presenter';

export default class BikeView extends BaseView {
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
		this.BikeP = new BikePresenter(this);
	}

	resetState = () => {
		this.state = { refresh: true, data: [] };
	}

	// TODO : Add update from new bike page that refreshes bike view page

	/**
	 * Extract data from the component's view and send an update to the presenter to do any logic before sending it to the model.
	 */
	sendUpdate = () => {
		const d = this.BikeP.getData();
		const i = d[d.length-1]
		// Extract data from components
		let new_data = { 
			data:	{
						id: i.id+1,
						name: 'BikeName'+(i.id+1),
						model: 'Model'+(i.id+1),
						owner: 'Owner'+(i.id+1),
						colour: 'Red',
						serial_number: 72613671,
						notable_features: 'lime green grips, scratch on side',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
		}
		const data = new_data; 

		// console.log(data);

		// EVERYTHING ABOVE IS TEMPORARY - TO TEST ONLY
		// Get data to add here

		this.BikeP.update(data);
	}


	/**
	 * Renders an item from a list to the screen by extracting data.
	 * 
	 * @param {Object} item - An item to be rendered
	 */
	_renderItem = ({item}) => (
		<BikeItemHelper
			id={item.id}
			name={item.name}
			model={item.model}
			owner={item.owner}
			colour={item.colour}
			serial_number={item.serial_number}
			notable_features={item.notable_features}
			thumbnail={item.thumbnail}
			navigation={this.props.navigation}/>
	);

	/**
	 * Renders a search bar as the header including the profile icon and the filter button
	 */
	_renderSearchBar = () => (
		<SearchBarHelper 
			handleSearchFilter={(text) => this.BikeP.handleSearchFilter(text)}
			handleSearchCancel={this.BikeP.handleSearchCancel}
			handleSearchClear={this.BikeP.handleSearchClear}
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
			data: this.BikeP.getData()
		});
		console.log('Mounted'); // What to do here?
	};

	/**
	 * Triggers when a component or this component is unmounted.
	 */
	componentWillUnmount = () => {
		console.log('Unmounted'); // What to do here?
	};


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
						stickyHeaderIndices={[0]}>
					</FlatList>
					<TouchableHighlight style={styles.add} onPress={() => this.sendUpdate()} accessibilityLabel="New">
						<Icon name="md-add" type="ionicon" size={30} color="#01a699" />
					</TouchableHighlight>
				</View>
				);
	};

};

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
		bottom:5,
		right:5,
		alignSelf:'flex-end',
	}
});