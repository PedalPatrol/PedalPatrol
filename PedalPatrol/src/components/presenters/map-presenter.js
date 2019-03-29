import BasePresenter from './presenter';
import { HomeM, MapM } from '../models/export-models';

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

	/**
	 * Force the view/presenter to refresh the view's data
	 */
	forceRefresh = () => {
		this.view.setState({
			markers: this.getData()
		});
	};

	/**
	 * Gets the user's current location from the model.
	 *
	 * @return {Object} The longitude and latitude of the user's current location
	 */
	getUserLocation = () => {
		return MapM.getCurrentLocation();
	}
}
export default MapPresenter;
