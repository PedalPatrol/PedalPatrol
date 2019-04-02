import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

/**
 * Class for the persistent storage of data on a device using ASyncStorage.
 * @extends Component
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

	/**
	 * Removes an item from the persistent storage.
	 *
	 * @param {string} key - The key for an item that should be removed
	 * @param {Function} onError - A failure callback if an error occurs
	 */
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

	/**
	 * Get all the stored keys.
	 *
	 * @param {Function} onComplete - A callback function to call with an array of keys and an error if it failed. onComplete(error, keys)
	 */
	async getAllStoredKeys(onComplete) {
		await AsyncStorage.getAllKeys(onComplete);
	}

	/**
	 * Removes all stored keys in the AsyncStorage.
	 *
	 * @param {List} keepKeys - A list of keys as strings to keep in local storage.
	 * @param {Function} onSuccess - A callback function to call if all keys were successfully removed.
	 * @param {Function} onError - A callback function to call if one or more keys threw an error when being removed.
	 */
	async removeAllData(keepKeys, onSuccess, onError) {
		this.getAllStoredKeys(async (error, keys) => {
			keys = keys.filter( ( el ) => !keepKeys.includes(el));
			await AsyncStorage.multiRemove(keys, (err) => {
				if (err == null) {
					const message = keepKeys.length === 0 ? '' : "- Except: " + (keepKeys.length === 1 ? keepKeys : keepKeys.join(', '));
					onSuccess(message);
				} else {
					console.log(err);
					onError(err);
				}
			});
		});
	}
}

const PersistStorage = new PersistentStorage();
export default PersistStorage;