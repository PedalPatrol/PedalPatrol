import Model from './model';

// class BikeModel {
// 	constructor() {

// 	}
// 	bikeList = [
// 				{
// 					id: 1,
// 					model: 'Model',
// 					owner: 'Owner',
// 					thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
// 				}
// 			]
// 	newItem = ''
// }
// var ee = require('event-emitter')
export default class BikeModel extends Model {
	constructor() {
		super();
		// Initial data
		this._data = { 
			data: [
					{
						id: 1,
						model: 'Model',
						owner: 'Owner',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
			]

		}
		// Data emitter for presenters to listen on
		// this._eventEmitter = ee({})
		this._createObserverList();
	}

	// Get method for presenters to get data
	get() {
		return {...this._data} // immutable
	}

	// Update method for presenters to update data
	update(newData) {
		this._data = {...this._data, ...newData}
		// this.notifyAll() // Send with no message?
		this._notifyAll(this._data); // Consider not having a message and forcing the presenter to 'get' the message itself
		// this._eventEmitter.emit('change')
	}

	// on(ev, fn) {
	// 	this._eventEmitter.on(ev, fn)
	// }
	  
	// off(ev, fn) {
	// 	this._eventEmitter.off(ev, fn)
	// }

}