import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PixelRatio, TouchableOpacity, Image, SafeAreaView, Alert, ScrollView, FlatList, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
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
import ProfilePresenter from '../presenters/profile-presenter';
import ImageUtil from '../../util/imageutil';

const PROFILE_TYPE = ImageUtil.getTypes().PROFILE;
const NO_DATA = 'NO-DATA';

/**
 * Class for the Profile view
 * @extends BaseView
 */
class ProfileView extends BaseView {
	state = { // Initializing the state
		editing: false, // Checks if user is editing
		refresh: true, // Triggers a view refresh
		loaderVisible: false,

		inputData: [], // Input text data is at each index

		currentID: '',

		photoEntries: [],
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
			title: navigation.getParam('title', 'Profile')
		}
	}

	/**
	 * Creates an instance of the profile view
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.ProfileP = new ProfilePresenter(this);
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

		this.setState({
			inputData: this.ProfileP.getTextInputData(this.ProfileP.getData()),
			photoEntries: this.ProfileP.getCurrentPhotos()
		});
	}

	/**
	 * Component will unmount after this method is called, do any clean up here
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.ProfileP);
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
			this.ProfileP.checkEditingState(this.state.editing, this.editingSuccess, this.editingFailure);
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
		this.props.navigation.navigate('Tabs');
	}

	/**
	 * Clears all the data
	 */
	_clearData = () => {
		if (!this.state.loaderVisible) {
			this.ProfileP.clearPhotos();
			let inputData = this.ProfileP.getTextInputData(NO_DATA); // inputData is a property in state
			let photoEntries = ImageUtil.getDefaultPhotos(PROFILE_TYPE);
			this.setState({ inputData, photoEntries });
			this.setEditing(false); // Set editing to false so user can easily go back (for clear button)
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
			label={item.disabled ? this._renderName(item.name) : item.name}
			multiline={item.multiline}
			disabled={item.disabled}
			keyboardType={item.keyboardType}
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
	 */
	_renderName = (name) => (
		<Text style={[{color: 'black'}]}>{name}</Text>
	);


	/**
	 * Extract the key from the item and index
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
	 * Get the data from the state and send an update to the presenter
	 */
	_getDataToUpdate = () => {
		if (this.ProfileP.checkInputs(this.state.inputData, this._inputRequirementFailure)) {
			return;
		}

		this._enableLoader();
		this.refreshState();

		let updateData = {
			currentID: this.state.currentID,
			inputTextData: this.state.inputData, 
			picture: this.state.photoEntries
		};

		this.ProfileP.update(updateData, this.alertCallback);
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
				"Profile successfully updated!",
				"",
				[
					{ text: "Ok", onPress: () => this.resetAllOnBack(), style: "ok" },
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				"Profile was not able to be updated.",
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
							photos={this.state.photoEntries}
							selected={(id) => {this.ProfileP.selectPhotoTapped(ImagePicker, this.setEditing, id, this.state.photoEntries)}} />

						{/* List of text inputs */}
						<FlatList
							style={edit_styles.flatList}
							data={this.ProfileP.getTextInputData(NO_DATA)}
							extraData={this.state}
							keyExtractor={this._keyExtractor}
							renderItem={this._renderItem}/>

						<TouchableOpacity style={edit_styles.submitTouchable}>
							<Button
								title='Save'
								onPress={() => this._getDataToUpdate()}/>
						</TouchableOpacity>

						{
							this.state.loaderVisible &&
							<View style={styles.loading} pointerEvents="none">
								<ActivityIndicator size='large' color="#0000ff" />
							</View>
						}
					</ScrollView>
				</View>
				<SafeAreaView style={{ flex:0, backgroundColor: '#F5FCFF' }} />
			</HandleBack>
			</KeyboardAvoidingView>
		);
	}
}

export default ProfileView;