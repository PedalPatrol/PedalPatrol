import React, { Component } from 'react';
import { StatusBar, StyleSheet, FlatList, Text, View, Button } from 'react-native';
import BikeItem from './helpers/bikeitem';
import BaseView from './view';
import BikePresenter from '../presenters/bike-presenter'

export default class BikeView extends BaseView {
	/**
	 * Creates an instance of BikeView
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.state = { refresh: {} };
		this._renderItem = this._renderItem.bind(this);
		this.BikeP = new BikePresenter(this);
	}

	/**
	 * Extract data from the component's view and send an update to the presenter to do any logic before sending it to the model.
	 */
	sendUpdate = () => {
		// Extract data from components
		new_data = { 
		  	data:	{
						id: 2,
						model: 'Model2',
						owner: 'Owner2',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
		}
		data = new_data; 

		// console.log(data);

		// EVERYTHING ABOVE IS TEMPORARY - TO TEST ONLY
		// Get data here

		this.BikeP.update(data);
	}

	/**
	 * Renders an item from a list to the screen by extracting data.
	 * 
	 * @param {Object} item - An item to be rendered
	 */
	_renderItem = ({item}) => (
		<BikeItem
			id={item.id}
			model={item.model}
			owner={item.owner}
			thumbnail={item.thumbnail}
			navigation={this.props.navigation}/>
	);

	 _keyExtractor = (item, index) => item.id.toString();

	render() {
		return 	<View style={styles.container}>
					<FlatList
					data={this.BikeP.getData()}
					extraData={this.state.refresh}
					keyExtractor={this._keyExtractor}
					renderItem={this._renderItem}/>
					<Button
		  			onPress={() => this.sendUpdate()}
		  			title="New Bike"
		  			color="#841584"
		  			accessibilityLabel="New"/>
				</View>
	}


	/**
	 * Refreshes the state of the component so new data is fetched.
	 */
	refreshState = () => {
		this.setState({ 
    		refresh: !this.state.refresh
		});
	}

	/**
	 * Triggers when a component or this component is mounted.
	 */
	componentWillMount = () => {
		console.log('Mounted'); // What to do here?
	}

	/**
	 * Triggers when a component or this component is unmounted.
	 */
	componentWillUnmount = () => {
		console.log('Unmounted'); // What to do here?
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	}
});