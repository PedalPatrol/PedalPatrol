import Model from './model';

export default class HomeModel extends Model {
	constructor() {
		super();
		// Initial data
		this._data = { 
			data: [
					{
						id: 1,
						name: 'BikeName1',
						model: 'Model1',
						owner: 'Owner1',
						description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
						colour: 'Red',
						serial_number: 72613671,
						notable_features: 'lime green grips, scratch on side',
						timeago: '1 hrs ago',
						datetime: '3:30 PM - 16 Jan. 19',
						address: '162 Barrie St. Kingston, ON',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
			]

		}

		this._activeBookmarks = [];

		// ABOVE IS TEMPORARY
		
		this._createObserverList();

		this.moveBookmarkedDataToFront();
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
	 * Moves the bookmarked data to the front of the list.
	 */
	moveBookmarkedDataToFront() {
		const temp = this._data.data;

		const nonBookmarkedData = this.getBookmarkedData(temp, false);
		const bookmarkedData	= this.getBookmarkedData(temp, true);

		const sortedBookmarkedData 		= this.sortOnTime(bookmarkedData);
		const sortedNonBookmarkedData 	= this.sortOnTime(nonBookmarkedData);

		const totalTempData = sortedBookmarkedData.concat(sortedNonBookmarkedData);

		this._data.data = totalTempData;
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

		return time;
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