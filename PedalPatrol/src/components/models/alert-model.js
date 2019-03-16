import Model from './model';
import Database from '../../util/database';
import AuthState from '../../util/authenticationstate';
import TimeUtil from '../../util/timeutility';

/**
 * Class for the alert model to be used by the alert Presenter
 * @extends Model 
 */
class AlertModel extends Model {
	/**
	 * Creates an instance of AlertModel. Initializes , creates an observerlist,
	 * and registers an on read from the database.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		
		this._data = {data: []};
		this._activeBookmarks = [];

		this._createObserverList();
		this._registerDBReadListener();
	}

	/**
	 * Get method for presenters to get data.
	 *
	 * @return {Object} data stored in the model
	 */
	get() {
		return {...this._data} // immutable
	}

	/**
	 * Return the number of notifications.
	 *
	 * @return {Number} The number of notifications
	 */
	getNotificationsCount() {
		return this._data.numNotifications;
	}

	/**
	 * Register an 'on' read from the database, supplying the callback when the database has changed.
	 */
	_registerDBReadListener() {
		Database.readBikeDataOn((snapshot) => {
			// console.log(snapshot.val());
			this._insertDataOnRead(snapshot.val());
			this.moveTimeDataToFront();
		});
	}

	/**
	 * Insert data into the data object when data has changed from the database
	 *
	 * @param {Object} databaseData - Each data item is an object within the overall object
	 */
	_insertDataOnRead(databaseData) {
		let tempData = {data:[]};
		let dataID = 0;
		const currentUser = AuthState.getCurrentUserID();

		if (databaseData != null) { // Check if there are objects in the database
			for (let val in databaseData) {
				if (!databaseData[val].hasOwnProperty('id')) { // Make sure id exists, otherwise skip
					continue;
				}

				if (currentUser == null || databaseData[val].owner !== currentUser) {
					console.log(currentUser)
					continue;
				}

				if (databaseData[val].hasOwnProperty('found') && databaseData[val].found) {
					databaseData[val].dataID = dataID++;
					// Add timeago and datetime formatted info
					databaseData[val].timeago = TimeUtil.getTimeAgoFromMilliseconds(databaseData[val].milliseconds);
					databaseData[val].datetime = TimeUtil.getDateFormatFromDateTime(databaseData[val].milliseconds);
					tempData.data.push(databaseData[val]);
				}
			}
			this._data = tempData;
		}
	}

	/**
	 * Recalculates the 'timeago' property of the object, based on the milliseconds.
	 */
	recalculateTimeAgo() {
		let tempData = Object.assign(this._data.data);
		let dataID = 0;
		for (let i=0; i < tempData.length; i++) {
			tempData[i].dataID = dataID++;
			// Convert back to timeago from milliseconds
			tempData[i].timeago = TimeUtil.getTimeAgoFromMilliseconds(tempData[i].milliseconds);
		}
		this._data.data = Object.assign(tempData);
	}


	/**
	 * Moves the bookmarked data to the front of the list.
	 */
	moveTimeDataToFront() {
		if (typeof this._data !== "undefined" && this._data != undefined) {
			const temp = this._data.data;

			// Reverse the lists because we want latest time first
			const sortedData = TimeUtil.sortOnTime(temp).reverse();

			this._data.data = sortedData;
			this._data.numNotifications = sortedData.length;
			this._notifyAll(this._data);
		}
	}

	/**
	 * Update method for presenters to update the model's data.
	 *
	 * @param {Object} newData - New data to add
	 */
	update(newData) {
		// this._data = {...this._data, ...newData} // Overwrite - Use this if the data is appended to previous data in the presenter
		// this._data.data.push(newData.data); // Appends to the list - Use this if only a single piece of data is passed in 
		// console.log(this._data);
		// this.notifyAll(null) // Send with no message?
		// this._notifyAll(this._data); // Consider not having a message and forcing the presenter to 'get' the message itself
		// this._eventEmitter.emit('change')
	}
}

export default AlertModel;