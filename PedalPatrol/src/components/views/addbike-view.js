import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PixelRatio, TouchableOpacity, Image, Alert, ScrollView, FlatList, ActivityIndicator, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { HeaderBackButton } from 'react-navigation';
import { TextInput } from 'react-native-paper';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

import { styles, text, edit_styles } from './stylesheets/edit-styles';

import BaseView from './view';
import SafeArea from './helpers/safearea';
import HandleBack from './helpers/handleback';
import ImageCarousel from './helpers/imagecarousel';
import AddBikePresenter from '../presenters/addbike-presenter';
import ImageUtil from '../../util/imageutility';
import TimeUtil from '../../util/timeutility';

const colours = require('../../assets/colours/colours.json');

const NO_DATA = 'NO-DATA';
const UNIQUE_COLOUR_KEY = 'name'; // A unique key for the colours for the sectioned list

/**
 * Class for the AddBike view
 * @extends BaseView
 */
class AddBikeView extends BaseView {
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

	state = { // Initializing the state
		editing: false, // Checks if user is editing
		refresh: true, // Triggers a view refresh
		loaderVisible: false,
		isEditPage: false,

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
		const { params = {} } = navigation.state;
		const back = params._onBack ? params._onBack : () => 'default';
		const clear = params._clearData ? params._clearData : () => 'default';
		return {
			headerLeft: (<HeaderBackButton disabled={transitioning} onPress={()=>{back()}}/>),
			headerRight: (<Button disabled={transitioning} onPress={()=>{clear()}} title='Clear'/>),
			title: navigation.getParam('title', 'Add Bike') // Default title is Add Bike
		};
	}

	/**
	 * Component is about to mount, initialize the data.
	 * This function is called before componentDidMount
	 */
	componentWillMount = () => {
		this.props.navigation.setParams({
			_onBack: this._onBack,
			_clearData: this._clearData
		});

		const { navigation } = this.props;
		const data = navigation.getParam('data', 'NO-DATA');
		const viewTitle = navigation.getParam('title', 'Add Bike');

		// This can be done before the component has mounted so we do it before so data appears immediately
		this.setState({
			rawData: data,
			inputData: this.AddBikeP.getTextInputData(data, this.state.isEditPage),
			photoEntries: this.AddBikeP.getCurrentPhotos(),
			isEditPage: this.isEditBikePage(viewTitle)
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
	 * Checks if the title of the view is edit bike, and if so, returns true.
	 *
	 * @param {string} title - The title of the view
	 * @return {Boolean} true: If the page is edit bike; false: If the page is add bike
	 */
	isEditBikePage = (title) => {
		return title === 'Edit Bike';
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
		if (!this.state.loaderVisible) {
			this.AddBikeP.checkEditingState(this.state.editing, this.editingSuccess, this.editingFailure);
		}
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
		this.props.navigation.navigate('Bike');
	}

	/**
	 * Clears all the data
	 */
	_clearData = () => {
		if (!this.state.loaderVisible) {
			this.AddBikeP.clearPhotos();
			this.sectionedMultiSelect._removeAllItems();
			let inputData = this.AddBikeP.getTextInputData(NO_DATA, this.state.isEditPage); // inputData is a property in state
			let photoEntries = ImageUtil.getDefaultPhotos(ImageUtil.getTypes().BIKE);
			this.setState({ inputData, photoEntries });
			this.setEditing(false); // Set editing to false so user can easily go back (for clear button)
		}
	}

	/**
	 * Prompt to ask the user if they want to delete the bike
	 */
	deletePrompt = () => {
		Alert.alert(
			"Are you sure you want to delete this bike?",
			"",
			[
				{ text: "Yes", onPress: () => {this._enableLoader(); this.AddBikeP.deleteBike(this.state.currentID, this.deleteCallback)}},
				{ text: "No", onPress: () => {}, style: "cancel" },
			],
			{ cancelable: false },
		);
	}

	/**
	 * Sets a callback on what to do if there is a success or error when a bike is uploaded.
	 *
	 * @param {Boolean} success - true: Uploading successful; false: Uploading failed
	 */
	deleteCallback = (success) => {
		this._disableLoader();
		this.refreshState();
		if (success) {
			Alert.alert(
				"Bike successfully deleted!",
				"",
				[
					{ text: "Ok", onPress: () => this.resetAllOnBack(), style: "ok" },
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				"Bike was not able to be deleted.",
				"Please try again.",
				[
					{ text: "Ok", onPress: () => {}, style: "ok" },
				],
				{ cancelable: false },
			);
		}
	}	

	/**
	 * Render a text input item.
	 * 
	 * @param {Object} item - A list item, index - The index of the item in the data list
	 */
	_renderItem = ({item, index}) => (
		<TextInput
			style={text.textInput}
			label={item.required ? this._renderName(item.name) : item.name} // Give required inputs a different render
			multiline={item.multiline}
			disabled={item.disabled || this.state.loaderVisible}
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
		<Text style={[{color: colour}, text.colourText]}>{name}</Text>
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
			
			<KeyboardAvoidingView
				style={styles.container}
				behavior="padding"
				enabled>
				<HandleBack onBack={this._onBack}>
					<SafeArea/>
					<View style={styles.container}>
						<ScrollView 
							contentContainerStyle={edit_styles.contentContainer}
							keyboardShouldPersistTaps='always'
							keyboardDismissMode='interactive'>

							<ImageCarousel 
								loading={this.state.loaderVisible}
								photos={this.state.photoEntries}
								selected={(id) => {this.AddBikeP.selectPhotoTapped(ImagePicker, this.setEditing, id, this.state.photoEntries)}} />
							
							{/* List of text inputs */}
							<FlatList
								style={edit_styles.flatList}
								data={this.AddBikeP.getTextInputData(NO_DATA, this.state.isEditPage)}
								extraData={this.state}
								keyExtractor={this._keyExtractor}
								renderItem={this._renderItem}/>
						
							{/* List of colours */}
							{/* colors attribute makes the 'Confirm' button flip from red to green if a colour is selected */}
							<SectionedMultiSelect
								style={text.textInput}
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
							<TouchableOpacity style={[edit_styles.submitTouchable, {marginBottom: this.state.isEditPage ? 0 : 10}]}>
								<Button
									title={this.state.isEditPage ? 'Save' : 'Submit'}
									disabled={this.state.loaderVisible}
									onPress={() => this._getDataToUpdate()}/>
							</TouchableOpacity>

							{/* TODO : Add delete button */}
							{
								this.state.isEditPage &&
								<View> 
									<View style={{flexDirection: 'row', marginTop: 20}}> 
										<View style={edit_styles.deleteInline} /> 
											<Text style={edit_styles.delete}>Delete Bike</Text> 
										<View style={edit_styles.deleteInline} /> 
									</View>
									
									<TouchableOpacity style={edit_styles.deleteTouchable} onPress={() => 'default'}>
										<Button
											title='Delete'
											disabled={this.state.loaderVisible}
											onPress={() => this.deletePrompt()}/>
									</TouchableOpacity>
								</View>
							}

							{/* Spinning loading circle */}
							{
								this.state.loaderVisible &&
								<View style={edit_styles.loading} pointerEvents="none">
									<ActivityIndicator size='large' color="#0000ff" />
								</View>
							}
						</ScrollView>
					</View>
					<SafeArea/>
				</HandleBack>
				</KeyboardAvoidingView>
			
		);
	}
}

export default AddBikeView;