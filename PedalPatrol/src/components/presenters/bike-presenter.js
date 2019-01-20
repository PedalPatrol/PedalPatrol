import BasePreseneter from './presenter';
import BikeM from '../models/export-models';

export default class BikePresenter extends BasePreseneter {
	constructor(view) {
		super()
		this.stores = [BikeM]
	}

	update = (newData) => {
		BikeM.update(newData)
	};

	getData = () => {
		return BikeM.get().data
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

