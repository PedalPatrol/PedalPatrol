import Model from './model';
import Database from '../../util/database';

/**
 * Class for the home/notification model to be used by the Home Presenter
 * @extends Model 
 */
class HomeModel extends Model {
	/**
	 * Creates an instance of HomeModel. Initializes , creates an observerlist,
	 * and registers an on read from the database.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		
		this._data = {data: []};
		this._activeBookmarks = [];

		this._createObserverList();
		this._registerDatabaseRead();
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
	 * Register an 'on' read from the database, supplying the callback when the database has changed.
	 */
	_registerDatabaseRead() {
		Database.readBikeDataOn((snapshot) => {
			// console.log(snapshot.val());
			this._insertDataOnRead(snapshot.val());
			this.moveBookmarkedDataToFront();
			this._notifyAll(this._data);
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
		if (databaseData != null) { // Check if there are objects in the database
			for (let val in databaseData) {
				if (!databaseData[val].hasOwnProperty('id')) {
					continue;
				}

				databaseData[val].dataID = dataID++;
				databaseData[val].timeago = this._getTimeAgoFromDateTime(databaseData[val].milliseconds);
				databaseData[val].datetime = this._getDateFormatFromDateTime(databaseData[val].milliseconds);
				tempData.data.push(databaseData[val]);
			}
			this._data = tempData;
		}
		// console.log(this._data);
	}

	/**
	 * Returns the milliseconds time formatted as 'HH:MM - DD/MM/YY'.
	 *
	 * @param {Number} datetime - The time in milliseconds
	 * @return {string} Milliseconds represented as a string
	 */
	_getDateFormatFromDateTime(datetime) {
		let converted = new Date(datetime);
		let date = converted.getDate()+'/'+(converted.getMonth()+1)+'/'+converted.getFullYear();
		let time = converted.getHours() + ":" + converted.getMinutes();
		let dateTime = time+' - '+date;
		return dateTime
	}

	/**
	 * Returns millisecond time as a time ago string (# __ ago).
	 *
	 * @param {Number} datetime - The time in milliseconds
	 * @return {string} The millisecond time represented as a string
	 */
	_getTimeAgoFromDateTime(datetime) {
		const currentTime = new Date();
		
		let time = this._parseMillisecondsIntoReadableTime(currentTime-datetime);

		let parsetime = time.split(':');
		let suffix = '';
		let outtime = '';

		const hours = parseInt(parsetime[0]);
		const minutes = parseInt(parsetime[1]);
		const seconds = parseInt(parsetime[2]);

		if (hours >= 24) {
			suffix = ' days ago';
			outtime = Math.floor(hours/24);
			if (outtime >= 30 && outtime < 365) {
				suffix = ' months ago';
				outtime = Math.floor(outtime/30);
			} else {
				suffix = ' years ago'
				outtime = Math.floor(outtime/365);
			} 
		} else if (hours > 0) {
			suffix = ' hrs ago';
			outtime = hours;
		} else {
			if (minutes > 0) {
				suffix = ' mins ago';
				outtime = minutes;
			} else {
				suffix = ' secs ago';
				outtime = seconds;
			}
		}

		return outtime + suffix;
	}

	/**
	 * Returns the milliseconds time as readable time (HH:MM:SS)
	 *
	 * @param {Number} milliseconds - The time in milliseconds
	 * @return {string} Milliseconds formatted to time
	 */
	_parseMillisecondsIntoReadableTime(milliseconds){
		//  Get hours from milliseconds
		let hours = milliseconds / (1000*60*60);
		let absoluteHours = Math.floor(hours);
		let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

		// Get remainder from hours and convert to minutes
		let minutes = (hours - absoluteHours) * 60;
		let absoluteMinutes = Math.floor(minutes);
		let m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

		// Get remainder from minutes and convert to seconds
		let seconds = (minutes - absoluteMinutes) * 60;
		let absoluteSeconds = Math.floor(seconds);
		let s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

		return h + ':' + m + ':' + s;
	}

	/**
	 * Recalculates the 'timeago' property of the object, based on the milliseconds.
	 */
	recalculateTimeAgo() {
		let tempData = Object.assign(this._data.data);
		let dataID = 0;
		for (let i=0; i < tempData.length; i++) {
			tempData[i].dataID = dataID++;
			tempData[i].timeago = this._getTimeAgoFromDateTime(tempData[i].milliseconds);
		}
		this._data.data = Object.assign(tempData);
	}


	/**
	 * Moves the bookmarked data to the front of the list.
	 */
	moveBookmarkedDataToFront() {
		if (typeof this._data !== "undefined" || this._data != undefined) {
			const temp = this._data.data;

			const nonBookmarkedData = this.getBookmarkedData(temp, false);
			const bookmarkedData	= this.getBookmarkedData(temp, true);

			const sortedBookmarkedData 		= this._sortOnTime(bookmarkedData).reverse();
			const sortedNonBookmarkedData 	= this._sortOnTime(nonBookmarkedData).reverse();
		
			// console.log(sortedNonBookmarkedData);

			const totalTempData = sortedBookmarkedData.concat(sortedNonBookmarkedData);

			this._data.data = totalTempData;

			this._notifyAll(this._data);
		}
	}

	/**
	 * Gets the bookmarked or unbookmarked data from based on the toggle value.
	 *
	 * @param {List} data - A list of objects with property id
	 * @param {Boolean} toggle - true: Look for bookmarked data; false: Look for unbookmarked data
	 * @return {List} A list of bookmarked or unbookmarked data depending on the toggle value
	 */
	getBookmarkedData(data, toggle) {
		return data.filter(obj => this.isBookmarked(obj.id) === toggle);
	}

	/**
	 * Quick sorts the data based on the timeago property. Arguably faster than using the built in sort function
	 * with a custom compare function.
	 *
	 * @param {List} data - Unsorted object data with a timeago property
	 * @return {List} Sorted data
	 */
	_sortOnTime(data) {
		if (data.length <= 1) {
			return data;
		}

		let pivot = data[0];

		let left = []; 
		let right = [];

		for (let i = 1; i < data.length; i++) {
			data[i].milliseconds < pivot.milliseconds ? left.push(data[i]) : right.push(data[i]);
		}

		return this._sortOnTime(left).concat(pivot, this._sortOnTime(right));
	};

	/**
	 * Update method for presenters to update the model's data.
	 *
	 * @param {Object} newData - New data to add
	 */
	update(newData) {
		// this._data = {...this._data, ...newData} // Overwrite - Use this if the data is appended to previous data in the presenter
		this._data.data.push(newData.data); // Appends to the list - Use this if only a single piece of data is passed in 
		// console.log(this._data);
		// this.notifyAll() // Send with no message?
		this._notifyAll(this._data); // Consider not having a message and forcing the presenter to 'get' the message itself
		// this._eventEmitter.emit('change')
	}

	/**
	 * Returns the bookmarked state for a bike ID
	 *
	 * @param {Number} id - A bike notification ID
	 * @return {Boolean} true: if ID is bookmarked by user; false: otherwise
	 */
	isBookmarked(id) {
		return this._activeBookmarks.includes(id);
	}

	/**
	 * Sets a bookmark for a specific ID
	 *
	 * @param {Number} id - A bike notification ID to bookmark
	 */
	setBookmark(id) {
		this._activeBookmarks.push(id);
	}

	/**
	 * Unsets a bookmark for a specific ID
	 *
	 * @param {Number} id - A bike nofication ID to unbookmark
	 */
	unsetBookmark(id) {
		this._activeBookmarks = this._activeBookmarks.filter(bid => {return bid != id;})
	}
}

export default HomeModel;