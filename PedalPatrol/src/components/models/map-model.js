import Model from './model';
import Database from '../../util/database';

import { showLocation } from 'react-native-map-link';

export default class MapModel extends Model {
	constructor() {
		super();
		
		this._data = [];
		this._createObserverList();
		/*
		 * Since data in MapModel should be the same as the from the HomeModel, we don't have to read from the database in the MapModel
		 * and we can just wait for data to be received.
		 */
	}

	get = () => {
		return (this._data);
	}

	/**
	 * Updates the map model data by inserting the data as markers
	 */
	update = (newData) => {
		this._insertDataOnRead(newData);
	}
	
	// _databaseRead() {
	// 	Database.readBikeDataOn((snapshot) => {
	// 		this._insertDataOnRead(snapshot.val());
	// 		this._notifyAll(this._data); // Don't supply data to force a refresh by the presenter
	// 	});
	// }
	/*required data sample
	[{coordinate:{latitude:44.237424,longitude:-76.5131},
	title:"bike1",
	description:"help"}]
	*/


	_insertDataOnRead = (newdata) => {
		//let temp = [{coordinate:{latitude:44.237424,longitude:-76.5131},title:"bike1",description:"help"}];
		let temp = [];
		// console.log(Object.values(newdata));
		let newdatalist = Object.values(newdata.data);
		for (let i = 0; i < newdatalist.length; i ++ ){
			if ( newdatalist[i].hasOwnProperty("longitude") && newdatalist[i].hasOwnProperty("latitude") && newdatalist[i].hasOwnProperty("stolen") && newdatalist[i].stolen) {
				temp.push(this.createMarker(newdatalist[i]));
			}
		}

		this._data = temp;
	}
	
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

	openMaps = () => {
		showLocation({
		   	latitude: 44.257424,
			longitude: -76.5231,
		    // sourceLatitude: -8.0870631,  // optionally specify starting location for directions
		    // sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
		    // title: 'Current Location',  // optional
		    googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
		    // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
		    dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
		    dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
		    cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
		    appsWhiteList: ['google-maps', 'apple-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
		    // app: 'apple-maps'  // optionally specify specific app to use
		})
	}

}

