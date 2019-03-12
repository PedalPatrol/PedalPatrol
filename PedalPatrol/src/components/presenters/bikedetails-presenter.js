import BasePresenter from './presenter';
import { HomeM } from '../models/export-models';
import ImageUtil from '../../util/imageutil';

const NO_DATA = 'NO-DATA';

/**
 * Class for the BikeDetails presenter and view
 * @extends BasePresenter
 */
class BikeDetailsPresenter extends BasePresenter {
	/**
	 * Creates an instance of BikeDetailsPresenter
	 *
	 * @constructor
	 * @param {Object} view - An instance of a view class
	 */
	constructor(view) {
		super();
		this.view = view;
		HomeM.subscribe(this);
	}

	/**
	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
	 */
	onDestroy = () => {
		HomeM.unsubscribe(this);
	};

	/**
	 * Updates the bike model with new data.
	 *
	 * @param {Object} newData - New data to update the model's data with.
	 */
	update = (newData) => {
		// HomeM.update(newData);
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
		// return HomeM.get().data;
	};

	/**
	 * Translates the data from a list of objects to a title and text with an id.
	 * 
	 * @param {Object} data - The data to be translated
	 * @return {List, List} An object with two lists. 1. The formed data; 2. The list of thumbnails
	 */
	translateData = (data) => {
		let formedData = [];
		// console.log(data);

		Object.keys(data).forEach((key,index) => {
			if (this.getIgnoredDetails().includes(key.toString())) { // Ignore any keys defined in getIgnoredDetails
				return; // Acts as continue in 'forEach'
			}

			let keyStr = (key.toString()).replace('_', ' ');
    		keyStr = this.convertCase(keyStr);
    		// Build the object
    		// id must be unique
    		// title is the text input label
    		const translated = {
    			title: keyStr + ": ",
    			text: Array.isArray(data[key]) ? data[key].join(', ') : data[key],
    			id: index.toString()
    		};
    		formedData.push(translated);
		});

		// Need to form the thumbnail properly because it's just a link right now
		let thumbnail = ImageUtil.formThumbnail(data.thumbnail);

		formedData = this.reorderData(formedData);

		// console.log(formedData, thumbnail);

		return { formedData, thumbnail };
	}

	/**
	 * Reorders the data to be based on a specific order defined in getDetailsOrder.
	 *
	 * @param {List} data - The data to be reordered
	 * @return {List} The reordered data
	 */
	reorderData = (data) => {
		let orderedData = [];

		const order = this.getDetailsOrder();

		for (let i=0; i < order.length; i++) {
			const found_element = this.findElement(data, order[i]);
			// If the element exists and was defined in the data, then add it, otherwise ignore it
			if (found_element != undefined && found_element.text !== '') {
				orderedData.push(found_element);
			}
		}

		return orderedData;
	}

	/**
	 * Finds if an element exists with a specific title based on a key.
	 *
	 * @param {List} data - Data to find an element in
	 * @param {string} key - A key to look for
	 * @return {Object} The first element found since data titles should be unique anyway
	 */
	findElement = (data, key) => {
		return data.filter(el => {
			return el.title === key + ": ";
		})[0]; // Takes the first element because keys should be unique so just to be safe
	}

	/**
	 * Convert the case of a string to title case (first letter of each word is uppercase).
	 *
	 * @param {string} str - A string to convert
	 * @return {string} The string converted to title case
	 */
	convertCase = (str) => {
		return str == undefined || str == null ? '' : str.toLowerCase().replace(/(^| )(\w)/g, s => s.toUpperCase()); // Regex FTW
  	}

  	/**
  	 * Returns the order of the details as a list. List will appear in this order.
  	 * Keys should be defined as the property name replacing all underscores with spaces then converted to title case (Does not include ': ').
  	 *
  	 * @return {List} A list of title case key names in the order that is needed
  	 */
  	getDetailsOrder = () => {
  		return ["Name", "Serial Number", "Timeago", "Datetime", "Model", "Brand", "Colour", "Frame Size", "Wheel Size", "Notable Features"];
  	}

  	/**
  	 * Ignore this list of properties when transforming data objects to formed data.
  	 * 
  	 * @return {List} A list of string properties to ignore
  	 */
  	getIgnoredDetails = () => {
  		return ['id', 'owner', 'thumbnail', 'dataID', 'milliseconds'];
  	}

}

export default BikeDetailsPresenter