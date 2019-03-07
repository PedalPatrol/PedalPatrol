import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PixelRatio, TouchableOpacity, Image, Alert, ScrollView, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { HeaderBackButton } from 'react-navigation';

import BaseView from './view';
import SafeArea from './helpers/safearea';
import HandleBack from './helpers/handleback';
import ImageCarousel from './helpers/imagecarousel';
import BikeDetailsPresenter from '../presenters/bikedetails-presenter';

class BikeDetailsView extends BaseView {
	state = {
		data: [],
		photoEntries: []
	}

	/**
	 * Set the navigation options, change the header to handle a back button.
	 *
	 * @return {Object} Navigation option
	 */
	static navigationOptions = ({navigation, transitioning}) => {
		return {
			headerLeft: (<HeaderBackButton disabled={transitioning} onPress={()=>{navigation.state.params._onBack()}}/>),
			title: navigation.getParam('title', 'Bike Details')
		}
	}

	/**
	 * Creates an instance of the add bike view
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.BikeDetP = new BikeDetailsPresenter(this);
	}

	/**
	 * Component is about to mount, initialize the data.
	 * This function is called before componentDidMount
	 */
	componentWillMount = () => {
		this.props.navigation.setParams({
			_onBack: this._onBack,
		});

		const { navigation } = this.props;
		const data = navigation.getParam('data', 'NO-DATA');

		const { formedData, thumbnail } = this.BikeDetP.translateData(data);

		this.setState({
			data: formedData,
			avatarSource: null,
			photoEntries: thumbnail
		});
	}

	/**
	 * Component mounted
	 */
	componentDidMount = () => {
		const { navigation } = this.props;
		// const data = navigation.getParam('data', 'NO-DATA');

		// item = this.sectionedMultiSelect._findItem(data.colour);
		// this.sectionedMultiSelect._toggleItem(item, false);
	}

	/**
	 * Component will unmount after this method is called, do any clean up here
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.BikeDetP);
	}

	/**
	 * When the back button is clicked, check if the user was editing.
	 */
	_onBack = () => {
		this.props.navigation.navigate('Tabs');
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
	 * Renders a bike detail 
	 */
	_renderItem = ({item}) => (
		<View style={styles.textrow}>
			<Text style={styles.titleText}>
				{item.title}
			</Text>
			<Text style={styles.dataText} numberOfLines={4}>
				{item.text}
			</Text>
		</View>
	);

	/**
	 * Extract the key from the item and index
	 */
	_keyExtractor = (item, index) => item.id;

	/**
	 * Renders items to the screen
	 *
	 * @return {Component} 
	 */
	render() {
		return (
				<HandleBack onBack={this._onBack}>
					<SafeArea/>
						<View style={styles.container}>
							<ScrollView contentContainerStyle={styles.contentContainer}>

							<ImageCarousel 
								photos={this.state.photoEntries} 
								selected={() => 'default'}/>


							{/* List of text inputs */}
							<FlatList
								style={styles.flatList}
								data={this.state.data}
								extraData={this.state}
								keyExtractor={this._keyExtractor}
								renderItem={this._renderItem}/>

							</ScrollView>
						</View>
					<SafeArea/>
				</HandleBack>
		);
	}

}

export default BikeDetailsView;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	flatList: {
		// marginTop: 220
	},
	textrow: {
		flexDirection: 'row'
	},
	titleText: {
		fontWeight: 'bold'
	},
	dataText: {

	}
});