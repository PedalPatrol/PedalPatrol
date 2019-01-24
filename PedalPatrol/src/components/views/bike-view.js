import React, { Component } from 'react';
import { StatusBar, StyleSheet, FlatList, Text, View, Button } from 'react-native';
import BikeItem from './helpers/bikeitem';
import BaseView from './view';
import BikePresenter from '../presenters/bike-presenter'

export default class BikeView extends BaseView {
	constructor(props) {
		super(props);
		this._renderItem = this._renderItem.bind(this);
		this.BikeP = new BikePresenter(this);
	}

	sendUpdate = (data) => {
		new_data = { 
		  	data: 	[
						{
							id: 2,
							model: 'Model2',
							owner: 'Owner2',
							thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
						}
					] 
		}
		data = new_data; 

		console.log(data);

		// EVERYTHING ABOVE IS TEMPORARY - TO TEST ONLY

		this.BikeP.update(data);

	}

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
		const { bikeList, newItem, onAddNewItem, onChangeNewItem } = this.props
 
		return 	<View style={styles.container}>
					<FlatList
					// data={this.state.bikes}
					data={this.BikeP.getData()}
					keyExtractor={this._keyExtractor}
					renderItem={this._renderItem}/>
					<Button
		  			onPress={() => this.sendUpdate('test')}
		  			title="New Bike"
		  			color="#841584"
		  			accessibilityLabel="New"/>
				</View>
	}


	componentWillMount = () => {
		console.log('Mounted'); // What to do here?
	}

	componentWillUnmount = () => {
		console.log('Unmounted');
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	}
});