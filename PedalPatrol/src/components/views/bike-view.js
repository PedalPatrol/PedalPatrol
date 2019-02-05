import React, { Component } from 'react';
import { StatusBar, StyleSheet, FlatList, Text, View, Button, TouchableHighlight } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import BikeItem from './helpers/bikeitem';
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
		this.state = { refresh: {}, data: [] };
		this._renderItem = this._renderItem.bind(this);
		this.BikeP = new BikePresenter(this);
	}

	// TODO : Add update from new bike page that refreshes bike view page

	/**
	 * Extract data from the component's view and send an update to the presenter to do any logic before sending it to the model.
	 */
	sendUpdate = () => {
		// Extract data from components
		new_data = { 
			data:	{
						id: 2,
						name: 'Bike2Name',
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
			name={item.name}
			model={item.model}
			owner={item.owner}
			thumbnail={item.thumbnail}
			navigation={this.props.navigation}/>
	);


	/**
	 * Extracts the item id as a string.
	 *
	 * @param {Object} item - An item being rendered
	 * @param {Number} index - The index of the item 
	 */
	 _keyExtractor = (item, index) => item.id.toString();

	render() {
		return 	<View style={styles.container}>
					<FlatList
						data={this.state.data}
						extraData={this.state.refresh}
						keyExtractor={this._keyExtractor}
						renderItem={this._renderItem}
						ListHeaderComponent={this.renderHeader}>
					</FlatList>
					<TouchableHighlight style={styles.add} onPress={() => this.sendUpdate()} accessibilityLabel="New">
						<Icon name="md-add" type="ionicon" size={30} color="#01a699" />
					</TouchableHighlight>
				</View>
	}

	renderHeader = () => {    
		return (   
			<View style={styles.searchContainer}> 
				<View style={{flex:6}}>
					<SearchBar        
						placeholder="Type Here..."        
						lightTheme
						round
						containerStyle={styles.searchBar}
						onChangeText={(text) => this.handleSearchFilter(text)}
						onCancel={this.handleSearchCancel}
						onClear={this.handleSearchClear}
						autoCorrect={false}             
					/>
				</View>
				<View style={{flex:1}}>
					<TouchableHighlight  onPress={() => this.sendUpdate()} accessibilityLabel="New">
						<Icon name="filter-list" type="MaterialIcons" size={30} color="#01a699" />
					</TouchableHighlight>
				</View>
			</View>
  		);  
	};

	// Maybe differentiate between cancel and clear
	handleSearchCancel = () => {
		this.setState({
			data: this.BikeP.getData()
		});
	};

	handleSearchClear = () => {
		this.setState({
			data: this.BikeP.getData()
		});
	};

	handleSearchFilter = (text) => {
		console.log(this.BikeP.getData());
		const newData = this.BikeP.getData().filter(item => {
			const itemData = `${item.name.toUpperCase()}}`;
			const textData = text.toUpperCase();
			return itemData.indexOf(textData) > -1;
		});
		this.setState({
			data: newData
		});
	};


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
		width:80,
		height:80,
		backgroundColor:'#fff',
		borderRadius:80,
		position:'absolute',
		bottom:0,
		alignSelf:'flex-end',
	},
	filter: {
		borderWidth:1,
		borderColor:'rgba(0,0,0,0.2)',
		alignItems:'center',
		justifyContent:'center',
		width:15,
		height:15,
		backgroundColor:'#fff',
		borderRadius:15,
		position:'absolute',
		alignSelf:'flex-end',

	},
	searchContainer: { // View that contains search bar
		backgroundColor: '#F5FCFF',
		flexDirection:'row',
		alignItems:'center',
		paddingTop: 5,
	},
	searchBar: {
		backgroundColor:'transparent', 
		borderTopWidth: 0, 
		borderBottomWidth: 0,
	}
});