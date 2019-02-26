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
		
		this._createObserverList();
		this._registerDatabaseRead();		
	}

	_registerDatabaseRead() {
		Database.readBikeDataOn((snapshot) => {
			console.log(snapshot.val());
			this._insertDataOnRead(snapshot.val());
			this._notifyAll(this._data); // Consider not having a message and forcing the presenter to 'get' the message itself
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
	 * Update method for presenters to update the model's data.
	 *
	 * @param {Object} newData - New data to add
	 */
	update(newData) {
		newData.data.owner = this._getOwner(); // Needs the owner

		if (newData.data.id === '' || newData.data.id === undefined) {
			newData.data.id = Database.getNewBikeID();
		}

		this._insertData(newData);

		Database.writeBikeData(newData.data, (data) => {
			console.log(data);
		},(error) => {
			console.log(error);
		});
		// this._data = {...this._data, ...newData} // Overwrite - Use this if the data is appended to previous data in the presenter
		// this._data.data.push(newData.data); // Appends to the list - Use this if only a single piece of data is passed in 
		// console.log(this._data);
		// this._notifyAll() // Send with no message?
		this._notifyAll(this._data); // Consider not having a message and forcing the presenter to 'get' the message itself
	}

	_insertData(newData) {
		let i = 0;

		while (i < this._data.data.length && this._data.data[i].id !== newData.data.id) {
			i++;
		}

		if (i === this._data.data.length) {
			this._data.data.push(newData.data); // Appends to the list - Use this if only a single piece of data is passed in 
		} else {
			this._data.data[i] = newData.data
		}
	}

	_insertDataOnRead(databaseData) {
		let tempData = {data:[]};
		let dataID = 0;
		if (databaseData != null) { // Check if there are objects in the database
			for (val in databaseData) {
				databaseData[val].dataID = dataID;
				tempData.data.push(databaseData[val]);
				dataID++;
			}
			this._data = tempData;
		}
		console.log(this._data);
	}

	/**
	 * Gets a new ID for the bike from the database. Cannot conflict with other bike IDs
	 *
	 * @return {Number} A bike ID
	 */
	getIDFromDatabase() {
		// Database.readBikeDataOnce((snapshot) => {

		// });

		return Math.max.apply(Math, this._data.data.map(function(o){return o.id;}))+1
	}

	/**
	 * Returns the owner of the bike (the user that is currently logged in)
	 *
	 * @return {String} The owner of the bike (current user)
	 */
	_getOwner() {
		return 'Owner';
	}
}