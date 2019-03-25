import BasePresenter from './presenter';
import { AlertM, ProfileM } from '../models/export-models';

/**
 * Class for the Home presenter and view
 * @extends BasePresenter
 */
class AlertPresenter extends BasePresenter {
	/**
	 * Creates an instance of AlertPresenter
	 *
	 * @constructor
	 * @param {Object} view - An instance of a view class
	 */
	constructor(view) {
		super()
		
		this.view = view;
		AlertM.subscribe(this);
		ProfileM.subscribe(this);
	}

	/**
	 * Updates the bike model with new data.
	 *
	 * @param {Object} newData - New data to update the model's data with.
	 */
	update = (newData) => {
		AlertM.update(newData); 
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
	 * Gets the data from the model and returns it to the caller.
	 *
	 * @return {Object} Data from the model.
	 */
	getData = () => {
		return AlertM.get().data;
	};

	getProfileImage = (callback) => {
		ProfileM.getProfilePicture(callback);
	}

	/**
	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
	 */
	onDestroy = () => {
		AlertM.unsubscribe(this);
		ProfileM.unsubscribe(this);
	};

	// Maybe differentiate between cancel and clear	
	/**
	 * Handle the search cancel.
	 */
	handleSearchCancel = () => {
		this.view.setState({
			data: this.getData()
		});
	};

	/**
	 * Handle the search clear
	 */
	handleSearchClear = () => {
		this.view.setState({
			data: this.getData()
		});
	};

	/**
	 * Filter the items in the list based on the text passed in. Called every time a letter is typed.
	 *
	 * @param {string} text - A word(s) to filter on
	 */
	handleSearchFilter = (text) => {
		const newData = this.getData().filter(item => {
			const itemData = `${item.model.toUpperCase()}}`;
			const textData = text.toUpperCase();
			return itemData.indexOf(textData) > -1;
		});
		this.view.setState({
			data: newData
		});
	};

	/**
	 * Forces a refresh for the view by recalcuating the timeago property, resorting bookmarked data and setting the state again.
	 */
	forceRefresh = () => {
		AlertM.recalculateTimeAgo();
		AlertM.moveTimeDataToFront();
		this.view.setState({
			data: this.getData()
		});
	};
}

export default AlertPresenter;