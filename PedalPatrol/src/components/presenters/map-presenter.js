import BasePresenter from './presenter';
import { HomeM, MapM, ProfileM, AlertM } from '../models/export-models';

/**
 * Class for the Map Presenter.
 * @extends BasePresenter
 */
class MapPresenter extends BasePresenter {
	/**
	 * Creates an instance of the MapPresenter.
	 * @constructor
	 */
	constructor(view){
		super();

		this.view = view;
		HomeM.subscribe(this);
		MapM.subscribe(this);
	}
	
	/**
	 * @private
	 * We're cheating here because the map presenter subscribes too late to receive data from the home model
	 * so we just force a notifyAll and move on. This only happens when the component mounts
	 */
	forceRequestData() {
		HomeM.forceNotifyAll();
	}

	/**
	 * Returns the data from the MapModel.
	 *
	 * @return {Object} The data from the map model.
	 */
	getData = () => {
		return MapM.get();
	}

	/**
	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
	 */
	onDestroy = () => {
		HomeM.unsubscribe(this);
		MapM.unsubscribe(this);
	};

	/**
	 * onUpdated only called from HomeModel because MapModel doesn't call it.
	 * Since data in MapModel should be the same as the from the HomeModel, we don't have to read from the database in the MapModel
	 * and we can just wait for data to be received.
	 */
	onUpdated = (data) => {
		MapM.update(data);
		this.forceRefresh(); // We always want to force a refresh for the model because data only comes from the HomeModel
	}

    updateCircle(newdata){
        MapM.sendCircle(newdata);
    }

	/**
	 * Force the view/presenter to refresh the view's data
	 */
	forceRefresh = () => {
		this.view.setState({
			markers: this.getData()
		});
	};

	/**
	 * Get the profile picture from the profile model
	 *
	 * @param {Function} callback - A callback function that will be called with the resulting data
	 */
	getProfileImage = (callback) => {
		ProfileM.getProfileData(callback);
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
	 * Gets the user's current location from the model.
	 *
	 * @return {Object} The longitude and latitude of the user's current location
	 */
	getUserLocation = () => {
		return MapM.getCurrentLocation();
	}

	filterMarkers = (markers, selectedFilter) => {
		if (!selectedFilter || selectedFilter.length === 0 || selectedFilter.name === 'None') {
			return markers;
		}
		
		let newMarkers = markers;
		const filter = (selectedFilter.name).replace("< ", "");
		newMarkers = newMarkers.filter((el) => {
			const timeago = el.data.timeago;
			const timeAgoNums = parseInt((timeago).replace(/[^0-9]/g, ''));
			switch (filter) {
				case "1 min ago":
					return timeago.includes('s');
					break;
				case "1 hour ago":
					return timeago.includes('min') || timeago.includes('mins') || timeago.includes('s');
					break;
				case "12 hours ago":
					return timeAgoNums < 12 && (timeago.includes('h') || timeago.includes('min') || timeago.includes('mins') || timeago.includes('s'));
					break;
				case "1 day ago":
					return timeago.includes('h') || timeago.includes('min') || timeago.includes('mins') || timeago.includes('s');;
					break;
				case "7 days ago":
					return timeAgoNums < 7 && (timeago.includes('d') || timeago.includes('h') || timeago.includes('min') || timeago.includes('mins') || timeago.includes('s'));
					break;
				case "1 month ago":
					return (timeago.includes('d') || timeago.includes('h') || timeago.includes('min') || timeago.includes('mins') || timeago.includes('s'));
					break;
				case "1 year ago":
					return timeAgoNums < 365 && (timeago.includes('mo') || timeago.includes('d') || timeago.includes('h') || timeago.includes('min') || timeago.includes('mins') || timeago.includes('s'));
					break;
			}
		});
		
		return newMarkers;
	}
}
export default MapPresenter;
