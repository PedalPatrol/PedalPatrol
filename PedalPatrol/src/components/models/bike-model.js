import Model from './model';
import Database from '../../util/export-database';

const DEFAULT_IMAGE = 'https://i.imgur.com/Fwx1TXQ.png';

/**
 * Class for the bike model to be used by the BikePresenter and AddBikePresenter
 * @extends Model
 */
class BikeModel extends Model {
	/**
	 * Creates an instance of BikeModel. Sets the default callback, creates an observerlist,
	 * and registers an on read from the database.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this._callback = this._defaultCallback;

		this._data = {data: []};
		this._createObserverList();
		this._registerDatabaseRead();		
	}

	/**
	 * Default callback
	 */
	_defaultCallback(message) {
		console.log(message);
	}

	/**
	 * Set the model's callback to a new callback. This callback can be used anywhere and is usually passed in from a presenter.
	 *
	 * @param {Function} callback - A callback to run when certain code is executed
	 */
	setCallback(callback) {
		this._callback = callback;
	}

	/**
	 * Register an 'on' read from the database to get updates anytime data changes in the database.
	 */
	_registerDatabaseRead() {
		Database.readBikeDataOn((snapshot) => {
			// console.log(snapshot.val());
			this._insertDataOnRead(snapshot.val());
			this._notifyAll(); // Don't supply data to force a refresh by the presenter
		});
	}

	/**
	 * Get method for presenters to get data.
	 *
	 * @return {Object} data stored in the model
	 */
	get() {
		return {...this._data} // Immutable
	}


	/**
	 * Update method for presenters to update the model's data. Datetime and Owner are handled in database class.
	 *
	 * @param {Object} newData - New data to add
	 */
	update(newData) {
		// Add ID here
		if (newData.data.id === '' || newData.data.id === undefined) {
			console.log('Fetching new ID...');
			newData.data.id = Database.getNewBikeID();
		}

		this._writeImageToStorage(newData.data.id, newData.data.thumbnail, (uploaded_images, num_defaults) => {
			newData.data.thumbnail = uploaded_images;

			let result = this._insertDataOnUpdate(newData);

			console.log(result);
			console.log(this._data.data);

			const finishCallback = (5-num_defaults === uploaded_images.length) ? (result) => {this._callback(result); this._notifyAll(this._data);} : (_) => 'default';

			if (result) {
				this._editExistingInDatabase(newData.data, finishCallback);			
			} else {
				this._writeNewInDatabase(newData.data, finishCallback);
			}

		}, this._callback);

		// this._data = {...this._data, ...newData} // Overwrite - Use this if the data is appended to previous data in the presenter
		// this._data.data.push(newData.data); // Appends to the list - Use this if only a single piece of data is passed in 
		// console.log(this._data);
		// this._notifyAll() // Send with no message?
		// this._notifyAll(this._data); // Consider not having a message and forcing the presenter to 'get' the message itself
	}

	/**
	 * Checks if the image supplied is the set default image.
	 *
	 * @param {string} image - An image link
	 * @return {Boolean} true: if the image is the default image; false: otherwise
	 */
	isDefaultImage(image) {
		return image === DEFAULT_IMAGE;
	}

	/**
	 * Write the image to the firebase storage and call the callbacks with the urls that were defined.
	 *
	 * @param {Number} id - The id of the bike corresponding to the image
	 * @param {List} images - A list of objects with the property 'illustration'
	 * @param {Function} onSuccess - A callback to call when an image has been successfully uploaded
	 * @param {Function} onError - A callback to call when an image has failed to upload
	 */
	_writeImageToStorage(id, images, onSuccess, onError) {
		let uploaded_pictures = [];
		let count_default = 0;

		for (let i=0; i < images.length; i++) {
			if (this.isDefaultImage(images[i].illustration)) {
				count_default++;
				continue;
			}

			const filename = (new Date()).getTime() + i + '.jpg';
			Database.writeImage(id, images[i].illustration, filename, (url) => {
				uploaded_pictures.push(url);
				onSuccess(uploaded_pictures, count_default);
				return url;
			}, (error) => {
				console.log(error);
				onError(false);
			});

		}
	}

	/**
	 * Write new data in database and call the function callback depending on if it was successful or not.
	 *
	 * @param {Object} newData - Data to be written to the database
	 */
	_writeNewInDatabase(newData, callback) {
		Database.writeBikeData(newData, (data) => {
			console.log(data);
			callback(typeof data !== 'undefined' && data !== undefined);
			// return typeof data !== 'undefined' && data !== undefined
			// this._callback(typeof data !== 'undefined' && data !== undefined);
		},(error) => {
			console.log(error);
			callback(false);
			// this._callback(false);
		});
	}

	/**
	 * Overwrite existing data in database and call the function callback depending on if it was successful or not.
	 *
	 * @param {Object} newData - Data to be written to the database
	 */
	_editExistingInDatabase(newData, callback) {
		return Database.editBikeData(newData, (data) => {
			console.log(data);
			callback(typeof data !== 'undefined' && data !== undefined);
			// return typeof data !== 'undefined' && data !== undefined;
			// this._callback(typeof data !== 'undefined' && data !== undefined);
		},(error) => {
			console.log(error);
			callbacK(false);
			// this._callback(false);
		});
	}

	/**
	 * Insert data into the data object on an update trigger (from Presenter).
	 *
	 * @param {Object} newData - New data passed in, of the form : {data: []}
	 * @return {Boolean} true: Data was an edited value; false: Data was a new value
	 */
	_insertDataOnUpdate(newData) {
		let i = 0;

		if (this._data.data.length === 0) {
			this._data.data.push(newData.data);
			return false;
		} 

		while (i < this._data.data.length && this._data.data[i].id !== newData.data.id) {
			i++;
		}

		if (i === this._data.data.length) {
			this._data.data.push(newData.data); // Appends to the list - Use this if only a single piece of data is passed in 
			return false;
		} else {
			this._data.data[i] = newData.data;
			return true;
		}
	}

	/**
	 * Checks if an object has a certain property.
	 * 
	 * @param {Object} obj - An object to check
	 * @param {string} property - The name of a property
	 * @return {Boolean} true: if the object has the property; false: otherwise
	 */
	_hasProperty(obj, property) {
		return obj.hasOwnProperty(property);
	}

	/**
	 * Insert data into the data object on a read from the database.
	 *
	 * @param {Object} databaseData - An objects of objects containing data from the database.
	 */
	_insertDataOnRead(databaseData) {
		let tempData = {data:[]};
		let dataID = 0;
		const currentUser = Database.getCurrentUser();

		if (databaseData != null) { // Check if there are objects in the database
			for (val in databaseData) {
				if (!this._hasProperty(databaseData[val], 'id')) {
				// if (!databaseData[val].hasOwnProperty('id')) {
					continue;
				}

				if (currentUser == null || currentUser != databaseData[val].owner) {
					continue;
				}


				// Arrays don't show up in firebase so we manually have to insert to make sure we don't get errors in the view
				if (!this._hasProperty(databaseData[val], 'colour')) {
				// if (!databaseData[val].hasOwnProperty('colour')) {
					databaseData[val].colour = [];
				}
				if (!this._hasProperty(databaseData[val], 'thumbnail')) {
				// if (!databaseData[val].hasOwnProperty('thumbnail')) {
					databaseData[val].thumbnail = [];
				}

				databaseData[val].dataID = dataID; // Assign a dataID which is just an incremental temporary value
				tempData.data.push(databaseData[val]);
				dataID++;
			}
			this._data = tempData;
		}
		// console.log(this._data);
	}
}

export default BikeModel;