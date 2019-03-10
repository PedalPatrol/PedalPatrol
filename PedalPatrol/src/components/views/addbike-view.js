import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PixelRatio, TouchableOpacity, Image, Alert, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { HeaderBackButton } from 'react-navigation';
import { TextInput } from 'react-native-paper';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import BaseView from './view';
import SafeArea from './helpers/safearea';
import HandleBack from './helpers/handleback';
import ImageCarousel from './helpers/imagecarousel';
import AddBikePresenter from '../presenters/addbike-presenter';
import ImageUtil from '../../util/imageutil';

const colours = require('../../assets/colours/colours.json');

const NO_DATA = 'NO-DATA';
const UNIQUE_COLOUR_KEY = 'name'; // A unique key for the colours for the sectioned list

/**
 * Class for the AddBike view
 * @extends BaseView
 */
class AddBikeView extends BaseView {
	state = { // Initializing the state
		editing: false, // Checks if user is editing
		refresh: true, // Triggers a view refresh
		loaderVisible: false,

		inputData: [], // Input text data is at each index
		colours: colours.data, // Current colours

		currentID: '', // Current ID of the bike being edited (Edit Bike only)

		photoEntries: [], // Current photos

		selectedItems: [] // Selected colours
	};

	/**
	 * Set the navigation options, change the header to handle a back button.
	 *
	 * @return {Object} Navigation option
	 */
	static navigationOptions = ({navigation, transitioning}) => {
		return {
			headerLeft: (<HeaderBackButton disabled={transitioning} onPress={()=>{navigation.state.params._onBack()}}/>),
			headerRight: (<Button disabled={transitioning} onPress={()=>{navigation.state.params._clearData()}} title='Clear'/>),
			title: navigation.getParam('title', 'Add Bike') // Default title is Add Bike
		};
	}


	/**
	 * Creates an instance of the add bike view
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.AddBikeP = new AddBikePresenter(this);
	}

	/**
	 * Component is about to mount, initialize the data.
	 * This function is called before componentDidMount
	 */
	componentWillMount = () => {
		// There's a problem with clicking the back button too quickly so need to find a better place to put this
		this.props.navigation.setParams({
			_onBack: this._onBack,
			_clearData: this._clearData
		});

		const { navigation } = this.props;
		const data = navigation.getParam('data', 'NO-DATA');

		// This can be done before the component has mounted so we do it before so data appears immediately
		this.setState({
			inputData: this.AddBikeP.getTextInputData(data),
			photoEntries: this.AddBikeP.getCurrentPhotos()
		});
	}

	/**
	 * Component mounted
	 */
	componentDidMount = () => {
		this.AddBikeP.changeText(colours.data, this._renderText);

		const { navigation } = this.props;
		const data = navigation.getParam('data', 'NO-DATA');

		// This can only be done once the component has mounted since it affects other components
		this.AddBikeP.toggleColours(this.sectionedMultiSelect, data, this._onSelectedItemsChange, UNIQUE_COLOUR_KEY);
	}

	/**
	 * Component will unmount after this method is called, do any clean up here
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.AddBikeP);
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
	 * Toggle the editing mode.
	 */
	toggleEditing = () => {
		this.setState({ editing: !editing });
	}

	/**
	 * Set the editing value to the passed in value.
	 *
	 * @param {Boolean} edit - true: user is editing; false: user is not editing
	 */
	setEditing = (edit) => {
		this.setState({ editing: edit });
	}

	/**
	 * When the back button is clicked, check if the user was editing.
	 */
	_onBack = () => {
		this.AddBikeP.checkEditingState(this.state.editing, this.editingSuccess, this.editingFailure);
	}

	/**
	 * A function to execute when the editing state is true.
	 */
	editingSuccess = () => {
		Alert.alert(
			"You're still editing!",
			"Are you sure you want to go back with your edits not saved?",
			[
				{ text: "Keep Editing", onPress: () => {}, style: "cancel" },
				{ text: "Go Back", onPress: () => this.resetAllOnBack() },
			],
			{ cancelable: false },
		);
	}

	/**
	 * A function to execute when the editing state is false.
	 */
	editingFailure = () => {
		// Clear the data just in case
		this.resetAllOnBack(); // If not editing then go back
	}

	/**
	 * Resets all the data and goes back to the bike page
	 */
	resetAllOnBack = () => {
		this._clearData();
		this.props.navigation.navigate('Tabs');
	}

	/**
	 * Clears all the data
	 */
	_clearData = () => {
		this.AddBikeP.clearPhotos();
		this.sectionedMultiSelect._removeAllItems();
		let inputData = this.AddBikeP.getTextInputData(NO_DATA); // inputData is a property in state
		let photoEntries = ImageUtil.getDefaultPhotos();
		this.setState({ inputData, photoEntries });
		this.setEditing(false); // Set editing to false so user can easily go back (for clear button)
	}

	/**
	 * Render a text input item.
	 * 
	 * @param {Object} item - A list item, index - The index of the item in the data list
	 */
	_renderItem = ({item, index}) => (
		<TextInput
			style={styles.textInput}
			label={item.required ? this._renderName(item.name) : item.name} // Give required inputs a different render
			multiline={item.multiline}
			value={this.state.inputData[index].text}
			onChangeText={(text) => {
					let { inputData } = this.state; // inputData is a keyword in state
					inputData[index].text = text;
					this.setState({ inputData });
					this.setEditing(true); // Now editing
				} 
			}/>
	);

	/**
	 * Renders the name of a required field.
	 *
	 * @param {string} name - The name of the field
	 */
	_renderName = (name) => (
		<Text style={[{color: 'red'}]}>{name + " *"}</Text>
	);


	/**
	 * Extract the key from the item and index
	 *
	 * @param {Object} item - A list item
	 * @param {Number} index - The index of the item
	 */
	_keyExtractor = (item, index) => item.name;

	/**
	 * Add the new selected items to the state and update
	 *
	 * @param {List} selectedItems - List of selected items
	 */
	_onSelectedItemsChange = (selectedItems) => {
		this.setEditing(true); // Now editing
		this.setState({ selectedItems });
	} 

	/**
	 * Generates the style and colouring of the colours in the multiselect.
	 * 
	 * @param {string} colour - A colour, usually hexcode
	 * @param {string} name - The name of the item 
	 */
	_renderText = (colour, name) => (
		<Text style={[{color: colour}, styles.colourText]}>{name}</Text>
	);


	/**
	 * Get the data from the state and send an update to the presenter
	 */
	_getDataToUpdate = () => {
		if (!this.AddBikeP.checkInputs(this.state.inputData, this._inputRequirementFailure)) {
			return; // Callback is called within checkInputs so no need to call anything here
		}

		this._enableLoader(); // Activates spinning loader
		this.refreshState();
		
		// We like it tight so pack it together neatly
		let updateData = {
			currentID: this.state.currentID,
			inputTextData: this.state.inputData, 
			selectedColours: this.state.selectedItems, 
			picture: this.state.photoEntries
		};

		this.AddBikeP.update(updateData, this.alertCallback);
	}

	/**
	 * Enables the loader.
	 */
	_enableLoader = () => { this.setState({ loaderVisible: true }); }

	
	/**
	 * Disables the loader.
	 */
	_disableLoader = () => { this.setState({ loaderVisible: false }); }

	/**
	 * Alert for requirement input failure
	 */
	_inputRequirementFailure = (names) => {
		const joiner = names.length > 1 ? " are" : " is";
		Alert.alert(
			"Required (*) inputs cannot be blank.",
			names.join(', ') + joiner + " required.",
			[
				{ text: "Ok", onPress: () => {}, style: "ok" },
			],
			{ cancelable: false },
		);
	}

	/**
	 * Sets a callback on what to do if there is a success or error when a bike is uploaded.
	 *
	 * @param {Boolean} success - true: Uploading successful; false: Uploading failed
	 */
	alertCallback = (success) => {
		this._disableLoader();
		this.refreshState();
		if (success) {
			Alert.alert(
				"Bike successfully uploaded!",
				"",
				[
					{ text: "Ok", onPress: () => this.resetAllOnBack(), style: "ok" },
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				"Bike was not able to be uploaded.",
				"Please try again.",
				[
					{ text: "Ok", onPress: () => {}, style: "ok" },
				],
				{ cancelable: false },
			);
		}
	}	

	/**
	 * DON'T USE THIS METHOD UNLESS ABSOLUTELY NECESSARY.
	 * Force a refresh of the view.
	 */
	_forceRefresh = () => {
		this.forceUpdate();
	}

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
								selected={(id) => {this.AddBikeP.selectPhotoTapped(ImagePicker, this.setEditing, id, this.state.photoEntries)}} />
							
							{/* List of text inputs */}
							<FlatList
								style={styles.flatList}
								data={this.AddBikeP.getTextInputData(NO_DATA)}
								extraData={this.state}
								keyExtractor={this._keyExtractor}
								renderItem={this._renderItem}/>
						
							{/* List of colours */}
							{/* colors attribute makes the 'Confirm' button flip from red to green if a colour is selected */}
							<SectionedMultiSelect
								style={styles.textInput}
								items={this.state.colours}
								displayKey='text_component'
								uniqueKey={UNIQUE_COLOUR_KEY}
								showRemoveAll
								colors={{ primary: this.state.selectedItems.length ? 'forestgreen' : 'crimson' }}
								selectText='Colours'
								modalWithSafeAreaView={true}
								showDropDowns={true}
								filterItems={this.AddBikeP.filterItems}
								onSelectedItemsChange={this._onSelectedItemsChange}
								selectedItems={this.state.selectedItems}
								ref={(SectionedMultiSelect) => this.sectionedMultiSelect = SectionedMultiSelect}
								/>

							{/* Submit button */}
							<TouchableOpacity style={styles.submitTouchable}>
								<Button
									title='Submit'
									onPress={() => this._getDataToUpdate()}
								/>
							</TouchableOpacity>

							{/* TODO : Add delete button */}

							{/* Spinning loading circle */}
							{
								this.state.loaderVisible &&
								<View style={styles.loading} pointerEvents="none">
									<ActivityIndicator size='large' color="#0000ff" />
								</View>
							}
						</ScrollView>
					</View>
					<SafeArea/>
				</HandleBack>
		);
	}
}

export default AddBikeView;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	avatarContainer: {
		borderColor: '#9B9B9B',
		borderWidth: 1 / PixelRatio.get(),
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		height: 200,
		padding: 10,
		marginRight: 10,
		marginLeft: 10,
		marginTop: 10,
		borderRadius: 4,
		shadowOffset:{  width: 1,  height: 1,  },
		shadowColor: '#CCC',
		shadowOpacity: 1.0,
		shadowRadius: 1,
	},
	avatar: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		height: 200
	},
	scrollContainer: {
		paddingVertical: 20,
	},
	textInput: {
		marginRight: 10,
		marginLeft: 10,
		marginBottom: 10,
		backgroundColor: '#F5FCFF',
	},
	flatList: {
		// marginTop: 220
	},
	colourText: {
		textShadowColor: 'rgba(0, 0, 0, 1)', 
		textShadowOffset: {width: -1, height: 1}, 
		textShadowRadius: 1,
	},
	submitTouchable: {
		borderWidth: 1, 
		textAlign: 'center', 
		borderColor: 'black',
		borderRadius: 5,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		backgroundColor: '#FFF'
	},
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F5FCFF88',
	}
});