import BasePresenter from './presenter';
import { BikeM } from '../models/export-models'; // Using the BikeModel class because an AddBikeModel class would have the same purpose

export default class AddBikePresenter extends BasePresenter {
	/**
	 * Creates an instance of BikePresenter
	 *
	 * @constructor
	 * @param {Object} view - An instance of a view class
	 */
	constructor(view) {
		super();
		this.view = view;
		BikeM.subscribe(this);
	}

	/**
	 * Updates the bike model with new data.
	 *
	 * @param {Object} newData - New data to update the model's data with.
	 */
	update = (newData) => {
		BikeM.update(newData); 
	};


	/**
	 * Called when the model is updated with new data. Refreshes the state of the view.
	 * Method is supplied with the data to add.
	 * Better way to refresh the state?
	 *
	 * @param {Object} newData - New data to add.
	 */
	onUpdated = (newData) => {
		// Do something with the new data or let the view auto update?
		console.log(newData)
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
		return BikeM.get().data;
	};

	/**
	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
	 */
	onDestroy = () => {
		BikeM.unsubscribe(this);
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
	selectPhotoTapped(imagePicker, setEditing) {
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

				this.view.setState({
					avatarSource: source,
				});
			}
		});
	}


	/**
	 * Converts a list of colour objects to a list of objects with a component using the renderer function.
	 *
	 * @param {List} colours - A list of colour objects (name, colour)
	 * @param {Function} renderer - A function that will produce the component to render for this colour
	 */
	changeText = (colours, renderer) => {
		let new_colours = []
		let new_item = {}
		let count = 0
		for (const item of colours) {
			const colour = item.colour
			new_item.text_component = renderer(colour, item.name);
			// <Text style={[{color: colour}, styles.colourText]}>{item.name}</Text>
			new_item.name = item.name;
			new_colours.push(new_item);
			new_item = {}
		}
		
		this.view.setState({
			colours: new_colours
		});
	}

	/**
	 * Makes sure the object with the key exists.
	 */
	getProp = (object, key) => object && this.check(object[key]);

	/**
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
	 * This function is an adaptation of the filter function used in SectionedMultiSelect.
	 * This one filters on uniqueKey instead of displayKey and ignores accents since it is
	 * a predefined list of colours.
	 *
	 * Link: https://github.com/renrizzolo/react-native-sectioned-multi-select/blob/master/exampleapp/App.js#L337
	 */
	filterItems = (searchTerm, items, { subKey, displayKey, uniqueKey }) => {
		let filteredItems = [];
		let newFilteredItems = [];
		items.forEach((item) => {
			const parts = searchTerm.trim().split(/[[ \][)(\\/?\-:]+/);
			const regex = new RegExp(`(${parts.join('|')})`, 'i');
			if (regex.test(this.getProp(item, uniqueKey))) {
				filteredItems.push(item);
		  	}
			if (item[subKey]) {
				const newItem = Object.assign({}, item);
				newItem[subKey] = [];
				item[subKey].forEach((sub) => {
					if (regex.test(this.getProp(sub, uniqueKey))) {
						newItem[subKey] = [...newItem[subKey], sub];
						newFilteredItems = this.rejectProp(filteredItems, singleItem =>
					  		item[uniqueKey] !== singleItem[uniqueKey]);
						newFilteredItems.push(newItem);
						filteredItems = newFilteredItems;
					}
				})
		  	}
		})
		return filteredItems
	}


	/**
	 * Return the data for the text inputs.
	 * Object:
	 *		name: the name/label of the text input
	 * 		multiline: true: if the input is allowed to span multiple lines; false: otherwise
	 *		text: initial text of the input
	 *
	 * @return {List} A list of data objects (name, multiline, text)
	 */
	getTextInputData = () => {
	 	return this._deepCopy(inputDataList.data); 
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


// List of text inputs for adding bike. Items in list appear in this order
/*
 * data:
 *		name: The name/label of the text input
 *		multiline: true: if the user's text can span multiple lines; false: otherwise
 *		text: The initial text of the name/label
 */
const inputDataList = {
	data: [
		{
			name: 'Serial Number',
			multiline: false,
			text: ''
		},
		{
			name: 'Brand',
			multiline: false,
			text: ''
		},
		{
			name: 'Model',
			multiline: false,
			text: ''
		},
		{
			name: 'Notable Features',
			multiline: true,
			text: ''
		},
		{
			name: 'Wheel Size',
			multiline: false,
			text: ''
		},
		{
			name: 'Frame Size',
			multiline: false,
			text: ''
		}
	]
}