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
var ee = require('event-emitter')
export default class BikeModel {
  constructor() {
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
    this._eventEmitter = ee({})
  }
  get() {
    return {...this._data} // immutable
  }
  update(newData) {
    this._data = {...this._data, ...newData}
    this._eventEmitter.emit('change')
  }
  on(ev, fn) {
    this._eventEmitter.on(ev, fn)
  }
  off(ev, fn) {
    this._eventEmitter.off(ev, fn)
  }
}