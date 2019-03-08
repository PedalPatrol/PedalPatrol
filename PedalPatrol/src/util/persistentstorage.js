import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

/**
 * Class for the persistent storage of data on a device using ASyncStorage.
 */
class PersistentStorage extends Component {
	/**
	 * Creates an instance of AuthLoadingView
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
	}

	/**
	 * Stores key, data using AsyncStorage to the device.
	 *
	 * @param {string} key - A key to store data with
	 * @param {string/Number} value - A value to store (can be string or number)
	 * @param onError - An error callback to call if there's an error while storing data
	 */
	async storeData(key, value, onError) {
		if (this.checkValid(key) && this.checkValid(value)) {
			try {
				await AsyncStorage.setItem(key, value);
			} catch (error) {
				onError(error);
			}
		} else {
			onError('Key or Value is undefined or null');
		}
	}

	/**
	 * Checks if the parameter passed in is valid.
	 *
	 * @param {string} val - A value to check
	 * @return {Boolean} true: Value is valid; false: Value is invalid
	 */
	checkValid(val) {
		return val != undefined && val != null;
	}

	/**
	 * Retrieves data from AsyncStorage and calls the success callback with the value.
	 *
	 * @param {string} key - A key to fetch the data for
	 * @param {Function} onSuccess - A success callback to process the data
	 * @param {Function} onError - A failure callback to call if an error occurs
	 */
	async retrieveData(key, onSuccess, onError) {
		if (this.checkValid(key)) {
			try {
				const value = await AsyncStorage.getItem(key);
				onSuccess(value); // Let someone else deal with the logic of it being null or not
			} catch (error) {
				onError(error);
			}
		} else {
			onError('Key is undefined or null')
		}
	}

	async removeData(key, onError) {
		if (this.checkValid(key)) {
			try {
				await AsyncStorage.removeItem(key);
			} catch (error) {
				onError(error);
			}
		} else {
			onError('Key is undefined or null');
		}
	}
}

const PersistStorage = new PersistentStorage();
export default PersistStorage;