import BasePreseneter from './presenter';
import myStore from '../models/model';

export default class BikePresenter extends BasePreseneter {
	constructor() {
		super()
		this.stores = [myStore]
	}

	update = (newData) => {
		myStore.update(newData)
	};

	getData = () => {
		return myStore.get().data
	};
	// onChangeNewItem = event =>
 //    	this.setModel({
 //      	newItem: event.target.value
 //    });
 
 //  	onAddNewItem = () =>
 //    	this.setModel({
 //      	newItem: {
	// 				id: 2,
	// 				model: 'Model',
	// 				owner: 'Owner',
	// 				thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
	// 			},
 //      	bikeList: this.model.bikeList.concat([ this.model.newItem ])
 //    });
}

