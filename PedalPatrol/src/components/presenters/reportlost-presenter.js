import BasePresenter from './presenter';
import { BikeM } from '../models/export-models';

/**
 * Class for the Reportlost presenter and view
 * @extends BasePresenter
 */
class ReportLostPresenter extends BasePresenter {
	/**
	 * Creates an instance of ReportlostPresenter
	 *
	 * @constructor
	 * @param {Object} view - An instance of a view class
	 */
	constructor(view) {
		super();
		this.view = view;
		BikeM.subscribe(this);
	}

	/**
	 * Updates the bike model with new data.
	 *
	 * @param {Object} newData - New data to update the model's data with.
	 * @param {Function} callback - A function that will execute a callback when accessing is complete
	 */
	update = (newData,callback) => {
		let editedBike = BikeM._getBikeByID(newData.data.bikeid);
		const newBike = {data: {}};
		const skipKeys = ['datetime', 'dataID', 'timeago'];

		Object.keys(editedBike).forEach((key) => {
			if (!skipKeys.includes(key)) {
				newBike.data[key] = editedBike[key];	
			}
		})

		newBike.data.stolen = true;
		newBike.data.found = false;
		newBike.data.description = newData.data.text;
		newBike.data.latitude = newData.data.latitude;
		newBike.data.longitude =  newData.data.longitude;

		BikeM.setCallback(callback);
		BikeM.update(newBike);
	};


	/**
	 * Called when the model is updated with new data. Refreshes the state of the view.
	 * Method is supplied with the data to add.
	 * Better way to refresh the state?
	 *
	 * @param {Object} newData - New data to add.
	 */
	onUpdated = (newData) => {
		// Do something with the new data or let the view auto update?
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
		let data = BikeM.get().data;
		return data.filter((el) => {
		    return !el.stolen;
		});
	};

	/**
	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
	 */
	onDestroy = () => {
		BikeM.unsubscribe(this);
	};

}

export default ReportLostPresenter;