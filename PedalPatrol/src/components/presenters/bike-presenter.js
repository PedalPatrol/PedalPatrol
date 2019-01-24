import BasePreseneter from './presenter';
import BikeM from '../models/export-models';

export default class BikePresenter extends BasePreseneter {
	constructor(view) {
		super()
		this.stores = [BikeM]
		BikeM.subscribe(this);
		this.view = view;
	}


	update = (newData) => {
		BikeM.update(newData); 
	};

	onUpdated = (newData) => {
		// Do something with the new data or let the view auto update?
		this.onChange(this.view);
	};

	getData = () => {
		return BikeM.get().data;
	};

	onDestroy = () => {
		BikeM.unsubscribe(this);
	}
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

