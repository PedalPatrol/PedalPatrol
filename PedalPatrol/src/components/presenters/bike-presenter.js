import BasePresenter from './presenter';
import { BikeM, AlertM, ProfileM } from '../models/export-models';

/**
 * Class for the Bike presenter and view
 * @extends BasePresenter
 */
class BikePresenter extends BasePresenter {
	/**
	 * Creates an instance of BikePresenter
	 *
	 * @constructor
	 * @param {Object} view - An instance of a view class
	 */
	constructor(view) {
		super();
		this.view = view;
		BikeM.subscribe(this);
		AlertM.subscribe(this);
		ProfileM.subscribe(this);
	}

	/**
	 * Updates the bike model with new data.
	 *
	 * @param {Object} newData - New data to update the model's data with.
	 */
	update = (newData) => {
		BikeM.update(newData); 
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
		if (newData == null) {
			this.forceRefresh(); // Force a refresh here because we got the data from the database
		} else {
			this.view.refreshState();
		}
	};

	/**
	 * Gets the data from the model and returns it to the caller.
	 *
	 * @return {Object} Data from the model.
	 */
	getData = () => {
		return BikeM.get().data;
	};

	/**
	 * Get the number of notifications from the Alerts model.
	 *
	 * @return {Number} The number of notifications
	 */
	getNotificationCount = () => {
		return AlertM.getNotificationsCount();
	}

	/**
	 * Gets the profile image from the ProfileModel.
	 * 
	 * @param {Function} callback - A function to be called with the profileData
	 */
	getProfileImage = (callback) => {
		ProfileM.getProfileData(callback);
	}

	/**
	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
	 */
	onDestroy = () => {
		BikeM.unsubscribe(this);
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
		// console.log(this.getData());
		const newData = this.getData().filter(item => {
			const itemData = `${item.name.toUpperCase()}}`;
			const textData = text.toUpperCase();
			return itemData.indexOf(textData) > -1;
		});
		this.view.setState({
			data: newData
		});
	}; 

	/**
	 * Forces a refresh of the view by fetching the data again.
	 */
	forceRefresh = () => {
		this.view.setState({
			data: this.getData(),
		});
		this.getProfileImage((result) => this.view.setState({profilePicture: result}));
	};
}

export default BikePresenter;