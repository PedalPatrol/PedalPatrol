import Model from './model';

export default class BikeModel extends Model {
	constructor() {
		super();
		// Initial data
		this._data = { 
			data: [
					{
						id: 1,
						name: 'BikeName1',
						model: 'Model1',
						brand: 'Schwin',
						owner: 'Owner1',
						description: 'Testing',
						colour: ['Red', 'Blue', 'Green'],
						serial_number: 72613671,
						notable_features: 'lime green grips, scratch on side',
						wheel_size: 52,
						frame_size: 123,
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
			]

		}

		// ABOVE IS TEMPORARY
		
		this._createObserverList();
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
			newData.data.id = this.getIDFromDatabase();
		}

		this._insertData(newData);
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

	/**
	 * Gets a new ID for the bike from the database. Cannot conflict with other bike IDs
	 *
	 * @return {Number} A bike ID
	 */
	getIDFromDatabase() {
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