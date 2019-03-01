import Model from './model';
import Database from '../../util/export-database';

export default class BikeModel extends Model {
	constructor() {
		super();
		// Initial data
		// this._data = { 
		// 	data: [
		// 			{
		// 				id: 1,
		// 				dataID: 0,
		// 				name: 'BikeName1',
		// 				model: 'Model1',
		// 				brand: 'Schwin',
		// 				owner: 'Owner1',
		// 				description: 'Testing',
		// 				colour: ['Red', 'Blue', 'Green'],
		// 				serial_number: 72613671,
		// 				notable_features: 'lime green grips, scratch on side',
		// 				wheel_size: 52,
		// 				frame_size: 123,
		// 				thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
		// 			}
		// 	]

		// }

		// ABOVE IS TEMPORARY

		this._callback = this.defaultCallback;

		this._data = {data: []};
		this._createObserverList();
		this._registerDatabaseRead();		
	}

	/**
	 * Default callback
	 */
	defaultCallback(message) {
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

		let result = this._insertDataOnUpdate(newData);

		if (result) {
			this.editExistingInDatabase(newData.data);			
		} else {
			this.writeNewInDatabase(newData.data);
		}

		// this._data = {...this._data, ...newData} // Overwrite - Use this if the data is appended to previous data in the presenter
		// this._data.data.push(newData.data); // Appends to the list - Use this if only a single piece of data is passed in 
		// console.log(this._data);
		// this._notifyAll() // Send with no message?
		this._notifyAll(this._data); // Consider not having a message and forcing the presenter to 'get' the message itself
	}

	writeNewInDatabase(newData) {
		Database.writeBikeData(newData, (data) => {
			console.log(data);
			this._callback(typeof data !== 'undefined' && data !== undefined);
		},(error) => {
			console.log(error);
			this._callback(false);
		});
	}

	editExistingInDatabase(newData) {
		Database.editBikeData(newData, (data) => {
			console.log(data);
			this._callback(typeof data !== 'undefined' && data !== undefined);
		},(error) => {
			console.log(error);
			this._callback(false);
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
	 * Insert data into the data object on a read from the database.
	 *
	 * @param {Object} databaseData - An objects of objects containing data from the database.
	 */
	_insertDataOnRead(databaseData) {
		let tempData = {data:[]};
		let dataID = 0;
		if (databaseData != null) { // Check if there are objects in the database
			for (val in databaseData) {
				databaseData[val].dataID = dataID; // Assign a dataID which is just an incremental temporary value
				tempData.data.push(databaseData[val]);
				dataID++;
			}
			this._data = tempData;
		}
		// console.log(this._data);
	}
}