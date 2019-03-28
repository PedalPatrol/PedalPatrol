import BasePresenter from './presenter';
import { HomeM, AlertM, ProfileM } from '../models/export-models';

/**
 * Class for the Home presenter and view
 * @extends BasePresenter
 */
class HomePresenter extends BasePresenter {
	/**
	 * Creates an instance of HomePresenter
	 *
	 * @constructor
	 * @param {Object} view - An instance of a view class
	 */
	constructor(view) {
		super();
		this.view = view;
		HomeM.subscribe(this);
		AlertM.subscribe(this);
		ProfileM.subscribe(this);
	}

	/**
	 * Updates the bike model with new data.
	 *
	 * @param {Object} newData - New data to update the model's data with.
	 */
	update = (newData) => {
		HomeM.update(newData); 
	};

	/**
	 * @private
	 * TEST CASE USE ONLY
	 * Function for tests only to inject data.
	 */
	testUpdateInjection(data) {
		HomeM.testUpdateInjection(data);
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
		return HomeM.get().data;
	};

	/**
	 * Get the profile picture from the profile model
	 *
	 * @param {Function} callback - A callback function that will be called with the resulting data
	 */
	getProfileImage = (callback) => {
		ProfileM.getProfilePicture(callback);
	}

	/**
	 * Get the number of notifications from the Alerts model.
	 *
	 * @return {Number} The number of notifications
	 */
	getNotificationCount = () => {
		return AlertM.getNotificationsCount();
	}

	/**
	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
	 */
	onDestroy = () => {
		HomeM.unsubscribe(this);
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
	 * Sets the bookmark for the notification ID
	 *
	 * @param {Number} id - A bike notification ID
	 */
	setBookmark = (id) => {
		if (HomeM.isBookmarked(id)) {
			HomeM.unsetBookmark(id);
		} else {
			HomeM.setBookmark(id);
		}
		this.view.refreshState();
	};

	/**
	 * Returns the bookmarked state for a bike ID
	 *
	 * @param {Number} id - A bike notification ID
	 * @return {Boolean} true: if ID is bookmarked by user; false: otherwise
	 */
	getBookmarked = (id) => {
		return HomeM.isBookmarked(id);
	};

	/**
	 * Forces a refresh for the view by recalcuating the timeago property, resorting bookmarked data and setting the state again.
	 */
	forceRefresh = () => {
		HomeM.recalculateTimeAgo();
		HomeM.moveBookmarkedDataToFront();
		this.view.setState({
			data: this.getData(),
		});
		this.getProfileImage((result) => this.view.setState({profilePicture: result}));
	};
}

export default HomePresenter;