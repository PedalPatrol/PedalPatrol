import Model from './model';
import Database from '../../util/database';
import AuthState from '../../util/authenticationstate';
import { showLocation } from 'react-native-map-link';

/**
 * Class for the Map model which controls the map view and the markers.
 * @extends Model
 */
class MapModel extends Model {
	/**
	 * Creates an instance of the MapModel
	 * @constructor
	 */
	constructor() {
		super();
		
		this._data = [];
		this._createObserverList();
		this._callback = this._defaultCallback;
		/*
		 * Since data in MapModel should be the same as the from the HomeModel, we don't have to read from the database in the MapModel
		 * and we can just wait for data to be received.
		 */
	}

    	/**
    	 * Default callback
    	 */
    	_defaultCallback(message) {
    		//console.log(message);
    	}

    	/**
    	 * Set the model's callback to a new callback. This callback can be used anywhere and is usually passed in from a presenter.
    	 *
    	 * @param {Function} callback - A callback to run when certain code is executed
    	 */
    	setCallback(callback) {
    		this._callback = callback;
    	}

	/**
	 * Returns the data from the model.
	 *
	 * @return {Object} The data stored in the model. Has property 'data' which is a list of objects
	 */
	get = () => {
		return (this._data);
	}

	/**
	 * Updates the map model data by inserting the data as markers
	 */
	update = (newData) => {
		this._insertDataOnRead(newData);
	}

	sendCircle(circleData){
	    const newData = {data:{}};
	    //const uid = AuthState.getCurrentUserID();
	    const uid = 'txcMzIEfFZX06iSNIAnIEI1Fcls1';
	    newData.data.id = uid;
	    newData.data.circle_lat = circleData.data.circleLatitude;
	    newData.data.circle_long = circleData.data.circleLongitude;
	    newData.data.circle_r = circleData.data.radius;
	    console.log(newData.data);
	    const prepareUpdate = newData.data;
	    Database.editProfileData(prepareUpdate, (data) => {
            this._callback(typeof data !== 'undefined' && data !== undefined);
            },(error) => {
            this._callback(false);
            });
	}

	/**
	 * Inserts an object with a list of objects into the map model as new data.
	 *
	 * @param {Object} newData - An object with the property 'data' which contains a list of objects
	 */
	_insertDataOnRead = (newdata) => {
		//let temp = [{coordinate:{latitude:44.237424,longitude:-76.5131},title:"bike1",description:"help"}];
		let temp = [];
		// console.log(Object.values(newdata));
		let newdatalist = Object.values(newdata.data);
		for (let i = 0; i < newdatalist.length; i ++ ){
			if (newdatalist[i].hasOwnProperty("longitude") &&
				newdatalist[i].hasOwnProperty("latitude")  &&
				(typeof newdatalist[i].longitude === "number") && 
				(typeof newdatalist[i].latitude === "number")  && 
				newdatalist[i].hasOwnProperty("stolen") && 
				newdatalist[i].stolen) {
				
				temp.push(this.createMarker(newdatalist[i]));
			}
		}

		this._data = temp;
	}
	
	/**
	 * Creates a marker from provided data.
	 *
	 * @param {Object} markerElement - An object element
	 * @return {Object} A formed marker
	 */
	createMarker(markerElement){
		let singleMarker={
			coordinate:{
				latitude: markerElement.latitude,
				longitude: markerElement.longitude,
			},
			key : markerElement.id,
			data: markerElement
		}
		return singleMarker;
	}

	/**
	 * Returns the user's current location.
	 *
	 * @return {Object} The current user's location, with longitude and latitude
	 */
	getCurrentLocation = () => {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
		});
	};

	/**
	 * Opens the prompt to get the user to pick a third-party app to get directions from.
	 * Default source location is the user's current location.
	 *
	 * @param {Object} destination - The destination longitude and latitude for directions.
	 */
	showMaps = (destination) => {
		this.getCurrentLocation().then(source => {
			if (source) {
				showLocation({
					latitude: destination.latitude,
					longitude: destination.longitude,
					sourceLatitude: source.coords.latitude,  // optionally specify starting location for directions
					sourceLongitude: source.coords.longitude,  // not optional if sourceLatitude is specified
					// title: 'Current Location',  // optional
					googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
					// googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
					dialogTitle: 'Open in Maps', // optional (default: 'Open in Maps')
					dialogMessage: 'What app would you like to use?', // optional (default: 'What app would you like to use?')
					cancelText: 'Cancel', // optional (default: 'Cancel')
				 	// appsWhiteList: ['google-maps', 'apple-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
					// app: 'apple-maps'  // optionally specify specific app to use
				})
			}
		});
	}
}

export default MapModel;