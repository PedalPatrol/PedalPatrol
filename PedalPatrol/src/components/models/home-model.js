import Model from './model';
import Database from '../../util/export-database';

export default class HomeModel extends Model {
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
		// 				owner: 'Owner1',
		// 				description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		// 				colour: 'Red',
		// 				serial_number: 72613671,
		// 				notable_features: 'lime green grips, scratch on side',
		// 				timeago: '1 hrs ago',
		// 				datetime: '3:30 PM - 16 Jan. 19',
		// 				address: '162 Barrie St. Kingston, ON',
		// 				thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
		// 			}
		// 	]

		// }

		this._activeBookmarks = [];

		// ABOVE IS TEMPORARY
		
		this._createObserverList();
		this._registerDatabaseRead();
		this.moveBookmarkedDataToFront();
	}

	_registerDatabaseRead() {
		Database.readBikeDataOn((snapshot) => {
			console.log(snapshot.val());
			this._insertDataOnRead(snapshot.val());
			this._notifyAll(this._data);
		});
	}

	/**
	 * Get method for presenters to get data.
	 *
	 * @return {Object} data stored in the model
	 */
	get() {
		return {...this._data} // immutable
	}

	_insertDataOnRead(databaseData) {
		let tempData = {data:[]};
		let dataID = 0;
		if (databaseData != null) { // Check if there are objects in the database
			for (val in databaseData) {
				databaseData[val].dataID = dataID;
				databaseData[val].timeago = this.getTimeAgoFromDateTime(databaseData[val].datetime);
				tempData.data.push(databaseData[val]);
				dataID++;
			}
			this._data = tempData;
		}
		console.log(this._data);
	}

	getTimeAgoFromDateTime(datetime) {
		const YEAR = 4;
		const MONTH = 3;
		const DAY = 2;
		const MINUTE = 1;
		const HOUR = 0;

		let tempDT = this.replaceAll(datetime, ' ', '');
		tempDT = this.replaceAll(datetime, '-', ' ');
		tempDT = this.replaceAll(tempDT, ':', ' ');
		tempDT = this.replaceAll(tempDT, '/', ' ');
		let timeList = tempDT.split(' ');
		timeList = timeList.filter((el) => {
  			return el != '';
		});
		const datetimeAsDate = new Date(timeList[YEAR], timeList[MONTH]-1, timeList[DAY], timeList[HOUR], timeList[MINUTE]);
		const currentTime = new Date();
		console.log(currentTime);
		console.log(datetimeAsDate);
		console.log(currentTime-datetimeAsDate);
		let time = this.parseMillisecondsIntoReadableTime(currentTime-datetimeAsDate);

		let parsetime = time.split(':');
		let suffix = '';
		let outtime = '';
		console.log(parsetime);
		if (parseInt(parsetime[0]) >= 24) {
			suffix = ' days ago';
			outtime = Math.floor(parseInt(parsetime[0])/24) + suffix;
		} else if (parseInt(parsetime[0]) > 0) {
			suffix = ' hours ago';
			outtime = parseInt(parsetime[0]) + suffix;
		} else {
			if (parseInt(parsetime[1]) > 0) {
				suffix = ' minutes ago';
				outtime = parseInt(parsetime[1]) + suffix;
			} else {
				suffix = ' seconds ago';
				outtime = parseInt(parsetime[2]) + suffix;
			}
		}

		return outtime;
	}

	parseMillisecondsIntoReadableTime(milliseconds){
		//Get hours from milliseconds
		let hours = milliseconds / (1000*60*60);
		let absoluteHours = Math.floor(hours);
		let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

		//Get remainder from hours and convert to minutes
		let minutes = (hours - absoluteHours) * 60;
		let absoluteMinutes = Math.floor(minutes);
		let m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

		//Get remainder from minutes and convert to seconds
		let seconds = (minutes - absoluteMinutes) * 60;
		let absoluteSeconds = Math.floor(seconds);
		let s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


		return h + ':' + m + ':' + s;
	}


	replaceAll(str, find, replace) {
		return str.replace(new RegExp(find, 'g'), replace);
	}

	/**
	 * Moves the bookmarked data to the front of the list.
	 */
	moveBookmarkedDataToFront() {
		if (typeof this._data !== "undefined" || this._data != undefined) {
			const temp = this._data.data;

			const nonBookmarkedData = this.getBookmarkedData(temp, false);
			const bookmarkedData	= this.getBookmarkedData(temp, true);

			const sortedBookmarkedData 		= this.sortOnTime(bookmarkedData);
			const sortedNonBookmarkedData 	= this.sortOnTime(nonBookmarkedData);

			const totalTempData = sortedBookmarkedData.concat(sortedNonBookmarkedData);

			this._data.data = totalTempData;

			this._notifyAll(this._data);
		}
	}

	/**
	 * Gets the bookmarked or unbookmarked data from based on the toggle value.
	 *
	 * @param {List} data - A list of objects with property id
	 * @param {Boolean} true: Look for bookmarked data; false: Look for unbookmarked data
	 * @return {List} A list of bookmarked or unbookmarked data depending on the toggle value
	 */
	getBookmarkedData(data, toggle) {
		return data.filter(obj => this.isBookmarked(obj.id) === toggle);
	}

	/**
	 * Converts a time ago of the form '# identifier ago' to a number in seconds
	 *
	 * @param {String} timeago - A string of the form '# identifier ago'
	 * @return {Number} The time in seconds
	 */
	convertTimeAgoToSecs(timeago) {
		if (typeof timeago !== 'undefined' || timeago != undefined) {
			const splitTimeAgo = timeago.split(' ');
			let time = splitTimeAgo[0];
			const ago = splitTimeAgo[1];
			switch(ago) {
				case "secs":
					break;
				case "mins":
					time *= 60;
					break;
				case "hrs":
					time *= 60 * 60;
					break;
				case "days":
					time *= 60 * 60 * 24;
					break;
				case "months":
					time *= 60 * 60 * 24 * 30; // Average days
					break;
				case "years":
					time *= 60 * 60 * 24 * 365;
					break;
			}
			return time
		}

		return 0;
	}

	/**
	 * Quick sorts the data based on the timeago property. Arguably faster than using the built in sort function
	 * with a custom compare function.
	 *
	 * @param {List} data - Unsorted object data with a timeago property
	 * @return {List} Sorted data
	 */
	sortOnTime(data) {
		if (data.length <= 1) {
			return data;
		}

		var pivot = data[0];

		var left = []; 
		var right = [];

		for (var i = 1; i < data.length; i++) {
			this.convertTimeAgoToSecs(data[i].timeago) < this.convertTimeAgoToSecs(pivot.timeago) ? left.push(data[i]) : right.push(data[i]);
		}

		return this.sortOnTime(left).concat(pivot, this.sortOnTime(right));
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