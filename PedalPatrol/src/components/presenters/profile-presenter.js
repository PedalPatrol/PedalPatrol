import BasePresenter from './presenter';
import { ProfileM } from '../models/export-models'; // Using the ProfileModel class because an ProfileModel class would have the same purpose
import ImageUtil from '../../util/imageutil';

const NO_DATA = 'NO-DATA';
const PROFILE_TYPE = ImageUtil.getTypes().PROFILE;

/**
 * Class for the Profile presenter and view
 * @extends BasePresenter
 */
class ProfilePresenter extends BasePresenter {
	/**
	 * Creates an instance of ProfilePresenter
	 *
	 * @constructor
	 * @param {Object} view - An instance of a view class
	 */
	constructor(view) {
		super();
		this.view = view;
		this.currentPhotos = Object.assign(ImageUtil.getPhotoEntries(PROFILE_TYPE));
		ProfileM.subscribe(this);
	}

	/**
	 * Updates the profile model with new data.
	 *
	 * @param {Object} newData - New data to update the model's data with.
	 * @param {Function} callback - A function that will execute a callback when accessing is complete
	 */
	update = (newData, callback) => {
		const builtData = this._buildDataFromView(newData);

		// TODO : Proper checking to see if it was uploaded. Consider adding callback to onUpdated
		ProfileM.setCallback(callback);

		ProfileM.update(builtData);
	}

	/**
	 * Build the data obtained from the view and insert it into a new data object.
	 * Current attributes of newData object: 
	 * 			{Object} inputTextData: [{name, multiline, profile_editable, text}]
	 * 			{Object} picture: uri
	 *		
	 *
	 * @param {Object} newData - The new data from the view. 
	 * @return {Object} The built data of the object. Attributes: data
	 */
	_buildDataFromView = (newData) => {
		const inputTextData = newData.inputTextData;
		const pictureSource = newData.picture;
		const currentID = newData.currentID;

		let builtData = {
			data: {
				id: currentID,
				email: inputTextData[inputDataList.index.email].text,
				phoneNum: inputTextData[inputDataList.index.phoneNum].text,
				full_name: inputTextData[inputDataList.index.full_name].text,
				thumbnail: pictureSource != null ? pictureSource : [{illustration: ImageUtil.getDefaultImage(PROFILE_TYPE)}]
			}
		}

		return builtData;
	}


	/**
	 * Called when the model is updated with new data. Refreshes the state of the view.
	 * Method is supplied with the data to add.
	 * Better way to refresh the state?
	 *
	 * @param {Object} newData - New data to add.
	 */
	onUpdated = (newData) => {
		// Do something with the new data or let the view auto update?
		this.view.refreshState();
	};


	/**
	 * Called when the model is updated with new data. Refreshes the state of the view.
	 * Better way to refresh the state?
	 */
	onUpdated = () => {
	 	this.view.refreshState();
	};

	/**
	 * Gets the data from the model and returns it to the caller.
	 *
	 * @return {Object} Data from the model.
	 */
	getData = () => {
		return ProfileM.get().data;
	};

	/**
	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
	 */
	onDestroy = () => {
		ProfileM.unsubscribe(this);
	};


	/**
	 * Checks the editing state of the view and calls one of its passed in functions.
	 *
	 * @param {Boolean} editingState - The editing state of the view
	 * @param {Function} success - A function to call on a true value of the editing state
	 * @param {Function} failure - A function to call on a false value of the editing state
	 */
	checkEditingState = (editingState, success, failure) => {
		// Do any checks on the editing state
		if (editingState) {
			success();
		} else {
			failure();
		}
	}

	
	/**
	 * Open the image picker. Set the editing option to true.
	 *
	 * @param {Object} imagePicker - The ImagePicker class from react-native-image-picker
	 * @param {Function} setEditing - A function so the presenter can set the editing value
	 */
	selectPhotoTapped(imagePicker, setEditing, id, photos) {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true,
			},
		};

		 // Set the editing state to true by calling a passed in function where the view can do what it needs to
		setEditing(true);

		imagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled photo picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				let source = { uri: response.uri };

				// You can also display the image using data:
				// let source = { uri: 'data:image/jpeg;base64,' + response.data };

				photos[id].illustration = source;
				this.currentPhotos = photos;

				console.log(id, photos);

				this.view.setState({
					photoEntries: JSON.parse(JSON.stringify(this.currentPhotos)),
				});

				this.view.refreshState();
			}
		});
	}

	/**
	 * @private
	 * Makes sure the object with the key exists.
	 */
	getProp = (object, key) => object && this.check(object[key]);

	/**
	 * @private
	 * Simple regex check
	 * 
	 * return {Boolean}
	 */
	check = (s) => {
		return s.replace(/[\W\[\] ]/g, function (a) {
			return a;
		})
	};

	/**
	 * Checks the input data for required inputs and calls an alert function if inputs are missing.
	 *
	 * @param {List} inputData - A list of input data (see inputDataList for structure)
	 * @param {Function} inputRequirementFailure - A function that will define the alert to be displayed.
	 * @return {Boolean} true: some required inputs are blank; false: required inputs are not blank
	 */
	checkInputs = (inputData, inputRequirementFailure) => {
		let required = this._getRequiredInputs(inputData);
		let names = [];
		for (let i=0; i < required.length; i++) {
			if (required[i].text === "") {
				names.push(required[i].name);
			}
		}
		if (names.length !== 0) {
			inputRequirementFailure(names);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the required inputs based on the required property
	 *
	 * @param {List} inputs - A list of input data
	 * @return {List} A list of required text inputs
	 */
	_getRequiredInputs = (inputs) => {
		return inputs.filter(obj => {return obj.required});
	}


	/**
	 * Return the data for the text inputs.
	 * Object:
	 *		name: the name/label of the text input
	 * 		multiline: true: if the input is allowed to span multiple lines; false: otherwise
	 *		text: initial text of the input
	 *
	 * @param {Object} data - type 'Object' if there is data, type 'string' if no data
	 * @return {List} A list of data objects (name, multiline, text)
	 */
	getTextInputData = (data) => {
	    console.log('gettextinputdata '+ data)
		return data === NO_DATA ? this._deepCopy(inputDataList.data) : this._translateDataToInput(data);
	}


	/**
	 * Translates data input (Profile data) to the text inputs. Could be refactored to be made easier for adaptations.
	 *
	 * @param {Object} data - The data from the view (=== 'NO-DATA' if not set)
	 * @return {List} A copy of the data that is now in the form of the text input
	 */
	_translateDataToInput = (data) => {
	    console.log(data)
		let dataCopy = this._deepCopy(inputDataList.data);

		// We  take data[0] because the data is a list
		dataCopy[inputDataList.index.email].text 	= this._getString(data[0].email);
		dataCopy[inputDataList.index.full_name].text 	= this._getString(data[0].full_name);
		dataCopy[inputDataList.index.phoneNum].text 	= this._getString(data[0].phoneNum);

		this.currentPhotos = ImageUtil.formThumbnail(data[0].thumbnail);
		this.view.setState({ currentID: data.id });

		return this._deepCopy(dataCopy); 
	}


	/**
	 * Checks if the value is valid and if so, convert it to a string.
	 *
	 * @param {Number/string} val - A number or string to check
	 * @return {string} Value converted to a string
	 */
	_getString = (val) => {
		return val == undefined || val == null ? '' : val.toString();
	}

	/**
	 * Resets the current photos to the default photos.
	 */
	clearPhotos = () => {
		this.currentPhotos = ImageUtil.getDefaultPhotos(PROFILE_TYPE);
	}

	/**
	 * Returns a deep copy of the current photos.
	 *
	 * @return {List} A list of the current photos
	 */
	getCurrentPhotos = () => {
		return JSON.parse(JSON.stringify(this.currentPhotos));
	}

	/**
	 * Returns a deep copy of the array by reassigning the values. This is to make sure we can clear the data.
	 *
	 * @return {List} A list to copy
	 */
	_deepCopy = (array) => {
		return array.map(a => Object.assign({}, a));
	}
}

export default ProfilePresenter;


// List of text inputs for adding Profile information. Items in list appear in this order
/*
 * data:
 *		name: The name/label of the text input
 *		multiline: true: if the user's text can span multiple lines; false: otherwise
 *		text: The initial text of the name/label
 */
const inputDataList = {
	index: {
		email: 		0,
		full_name: 	1,
		phoneNum: 	2,
	},
	data: [
		{
			name: 'Email',
			multiline: false,
			disabled: true,
			required: false,
			text: '',
		},
		{
			name: 'Full Name',
			multiline: false,
			disabled: false,
			required: false,
			text: ''
		},
		{
			name: 'Phone Number',
			multiline: false,
			disabled: false,
			required: false,
			text: ''
		},
	]
}