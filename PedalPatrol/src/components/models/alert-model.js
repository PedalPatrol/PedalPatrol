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
		
		this.listener = null;
		this._data = {data: []};
		this._activeBookmarks = [];
        this._callback = this._defaultCallback;
		this._createObserverList();
		this._registerDBReadListener();
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
		this.listener = Database.readBikeDataOn((snapshot) => {
			// console.log(snapshot.val());
			this._insertDataOnRead(snapshot.val());
			this.moveTimeDataToFront();
		});
	}

	toggleListeners() {
		if (this.listener != null) {
			Database.readBikeDataOff(this.listener);
			this._registerDBReadListener();
		}
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
					// console.log(currentUser)
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
        Database.editBikeData(newData, (data) => {
        // console.log(data);
        this._callback(typeof data !== 'undefined' && data !== undefined);
        },(error) => {
        console.log(error);
        this._callback(false);
        // this._callback(false);
        });
	}
}

export default AlertModel;