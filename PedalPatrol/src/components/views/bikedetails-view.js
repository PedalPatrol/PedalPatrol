import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PixelRatio, TouchableOpacity, Image, Alert, ScrollView, FlatList, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { HeaderBackButton } from 'react-navigation';
import { TextInput } from 'react-native-paper';

import { styles, text, bikedetails_styles } from './stylesheets/bikedetails-styles';

import BaseView from './view';
import SafeArea from './helpers/safearea';
import HandleBack from './helpers/handleback';
import ImageCarousel from './helpers/imagecarousel';
import BikeDetailsPresenter from '../presenters/bikedetails-presenter';
import TimeUtil from '../../util/timeutility';

/**
 * Class for the bike details view to display information about a bike.
 */
class BikeDetailsView extends BaseView {
	state = {
		data: [],
		photoEntries: [],
		rawData: []
	}

	/**
	 * Set the navigation options, change the header to handle a back button.
	 *
	 * @return {Object} Navigation option
	 */
	static navigationOptions = ({navigation, transitioning}) => {
		const { params = {} } = navigation.state;
		const back = params._onBack ? params._onBack : () => 'default';
		return {
			headerLeft: (<HeaderBackButton disabled={transitioning} onPress={()=>{back()}}/>),
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
	 * Navigates to a certain screen with parameters.
	 * 
	 * @param {string} screen - The screen name to navigate to. Name must be in navigation.js
	 */
	navigate = (screen) => {
		this.props.navigation.navigate({
			routeName: screen,
			params: {
				rawData: this.state.rawData,
				from: 'BikeDetails'
			},
			key: screen + TimeUtil.getDateTime()
		});

	};

	/**
	 * Handles the report found button clicked.
	 */
	_handleClick() {
		this.navigate("ReportFound");
	}

	/**
	 * Handles the confirm found button clicked
	 */
	_handleClickToConfirm(){
		this.BikeDetP.confirmFound(this.state.rawData,this.alertConfirmCallback);
	}

	/**
	 * Handles the reject button clicked
	 */
	_handleClickToReject(){
		this.BikeDetP.rejectFound(this.state.rawData,this.alertRejectionCallback);
	}

	/**
	 * Function for decision confirm
	 */
	decisionConfirm = () => {
		Alert.alert(
			"Are you sure you want to confirm your bike found?",
			"",
			[
				{ text: "No", onPress: () => {}, style: "cancel" },
				{ text: "Yes", onPress: () => this._handleClickToConfirm() },
			],
			{ cancelable: false },
		);
	}

	/**
	 * Function for decision reject
	 */
	decisionReject = () => {
		Alert.alert(
			"Are you sure you want to reject the found bike report?",
			"",
			[
				{ text: "No", onPress: () => {}, style: "cancel" },
				{ text: "Yes", onPress: () => this._handleClickToReject() },
			],
			{ cancelable: false },
		);
	}

	 /**
	 * Confirm callback on success or failure trying to confirm.
	 *
	 * @param {Boolean} success - If the found bike confirmation was accepted or not
	 */
	alertConfirmCallback = (success) => {
		this.refreshState();
		if (success) {
			Alert.alert(
				"Congratulations, you have found your bike!",
				"",
				[
					{ text: "Ok", onPress: () => this.props.navigation.navigate('Home'), style: "ok" },
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				"Fail to confirm.",
				"Please try again.",
				[
					{ text: "Ok", onPress: () => {}, style: "ok" },
				],
				{ cancelable: false },
			);
		}
	}

	/**
	 * Reject callback on success or failure trying to reject.
	 *
	 * @param {Boolean} success - If the found bike rejection was accepted or not
	 */
	alertRejectionCallback = (success) => {
		this.refreshState();
		if (success) {
			Alert.alert(
				"Bike found report rejected.",
				"",
				[
					{ text: "Ok", onPress: () => this.props.navigation.navigate('Home'), style: "ok" },
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				"Fail to confirm.",
				"Please try again.",
				[
					{ text: "Ok", onPress: () => {}, style: "ok" },
				],
				{ cancelable: false },
			);
		}
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
	 * Component is about to mount, initialize the data.
	 * This function is called before componentDidMount
	 */
	componentWillMount = () => {
		this.props.navigation.setParams({
			_onBack: this._onBack,
		});

		const { navigation } = this.props;
		let data=[];
		const id = navigation.getParam('id','NO-DATA');
		const fromPage = navigation.getParam('from', 'Home');
		if (id ==='NO-DATA'){
			data = navigation.getParam('data', 'NO-DATA');
		}else{
			data = this.BikeDetP.getDataFromID(id);
		}

		const { formedData, thumbnail } = this.BikeDetP.translateData(data, fromPage);

		this.setState({
			rawData: data,
			from: fromPage,
			data: formedData,
			photoEntries: thumbnail
		});
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
		this.setState({
			data: [],
			photoEntries: []
		});
		this.props.navigation.navigate(this.state.from);
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
	 *
	 * @param {Object} item - The item of the bike
	 * @return {Component} A react-native component
	 */
	_renderItem = ({item}) => (
		<TextInput
			style={text.textInput}
			label={this._renderText(item.title)}
			value={item.text}
			multiline
			disabled/>
	);

	/**
	 * Renders the text of the label.
	 *
	 * @param {string} text - The text to render
	 */
	_renderText = (text) => (
		<Text style={[{color: 'black'}]}>{text}</Text>
	);

	/**
	 * Extract the key from the item and index
	 */
	_keyExtractor = (item, index) => item.id;

	/**
	 * A callback function if there is a map open error.
	 */
	onMapOpenError = () => {
		Alert.alert(
			"Unable to Open Directions",
			"",
			[
				{ text: "Ok", onPress: () => {}, style: "ok" },
			],
			{ cancelable: false },
		);
	}

	/**
	 * Renders items to the screen
	 *
	 * @return {Component} 
	 */
	render() {
		const { width: windowWidth } = Dimensions.get('window');

		return (
				<HandleBack onBack={this._onBack}>
					<SafeArea/>
						<View style={styles.container}>
							<ScrollView contentContainerStyle={bikedetails_styles.contentContainer}>

							<ImageCarousel 
								photos={this.state.photoEntries} 
								selected={() => 'default'}/>


							{/* List of text inputs */}
							<FlatList
								style={bikedetails_styles.flatList}
								data={this.state.data}
								extraData={this.state}
								keyExtractor={this._keyExtractor}
								renderItem={this._renderItem}/>

							<View>
							<TouchableOpacity
								style={bikedetails_styles.touchableButtons}>
								<Button 
									title='Get Directions'
									onPress={() => {this.BikeDetP.goToDirectionsOnMap(this.state.rawData, this.onMapOpenError)}}/>
							</TouchableOpacity>
							</View>

							{
								this.state.rawData.stolen &&
								<View>
									<TouchableOpacity style={bikedetails_styles.touchableButtons}>
										<Button
											onPress={()=>this._handleClick()}
											title="Report Found"/>
									</TouchableOpacity>
								</View>
							}
							{
								this.state.rawData.found &&
								<View style={{flexDirection: 'row', width: windowWidth, justifyContent: 'space-between', marginTop: 10}}>
									<TouchableOpacity style={[bikedetails_styles.touchableButtons, {width: (windowWidth/2)-15, alignSelf: 'flex-start', marginRight: 5}]}>
										<Button
											onPress={()=>this.decisionConfirm()}
											title="Confirm Found"/>
									</TouchableOpacity>
									<TouchableOpacity style={[bikedetails_styles.touchableButtons, {width: (windowWidth/2)-15, alignSelf: 'flex-end', marginLeft: 5}]}>
										<Button
											onPress={()=>this.decisionReject()}
											title="Reject Found"/>
									</TouchableOpacity>
								</View>
								}

							</ScrollView>
						</View>
					<SafeArea/>
				</HandleBack>
		);
	}

}

export default BikeDetailsView;