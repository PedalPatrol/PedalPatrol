import BasePresenter from './presenter';
import { HomeM } from '../models/export-models'; 

const NO_DATA = 'NO-DATA';

/**
 * Class for the BikeDetails presenter and view
 * @extends BasePresenter
 */
class BikeDetailsPresenter extends BasePresenter {
	/**
	 * Creates an instance of BikeDetailsPresenter
	 *
	 * @constructor
	 * @param {Object} view - An instance of a view class
	 */
	constructor(view) {
		super();
		this.view = view;
		HomeM.subscribe(this);
	}

	/**
	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
	 */
	onDestroy = () => {
		HomeM.unsubscribe(this);
	};

	/**
	 * Updates the bike model with new data.
	 *
	 * @param {Object} newData - New data to update the model's data with.
	 */
	update = (newData) => {
		// HomeM.update(newData);
	}

	/**
	 * Called when the model is updated with new data. Refreshes the state of the view.
	 * Method is supplied with the data to add.
	 * Better way to refresh the state?
	 *
	 * @param {Object} newData - New data to add.
	 */
	onUpdated = (newData) => {
		// Do something with the new data or let the view auto update?
		console.log(newData)
		this.view.refreshState();
	};


	/**
	 * Called when the model is updated with new data. Refreshes the state of the view.
	 * Better way to refresh the state?
	 */
	onUpdated = () => {
	 	this.view.refreshState();
	};

	/**
	 * Gets the data from the model and returns it to the caller.
	 *
	 * @return {Object} Data from the model.
	 */
	getData = () => {
		// return HomeM.get().data;
	};


	translateData = (data) => {
		let formedData = [];
		console.log(data);

		Object.keys(data).forEach((key,index) => {
			if (this.getIgnoredDetails().includes(key.toString())) {
				return; // Acts as continue in 'forEach'
			}

			let keyStr = (key.toString()).replace('_', ' ');
    		keyStr = this.convertCase(keyStr);
    		const translated = {
    			title: keyStr + ": ",
    			text: data[key],
    			id: index.toString()
    		};
    		formedData.push(translated);
		});

		return formedData;
	}

	convertCase = (str) => {
		return str.toLowerCase().replace(/(^| )(\w)/g, s => s.toUpperCase());
  	}

  	getIgnoredDetails = () => {
  		return ['id', 'owner', 'thumbnail', 'dataID'];
  	}

}

export default BikeDetailsPresenter