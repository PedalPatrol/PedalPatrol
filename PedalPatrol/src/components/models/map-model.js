import Model from './model';
import Database from '../../util/database';

export default class MapModel extends Model {
	constructor() {
		super();
		// Initial data
		// this._data = {
		// 	data: [
		// 			{
		// 				id: 1,
		// 				dataID: 0,
		// 				name: 'BikeName1',
		// 				model: 'Model1',
		// 				brand: 'Schwin',
		// 				owner: 'Owner1',
		// 				description: 'Testing',
		// 				colour: ['Red', 'Blue', 'Green'],
		// 				serial_number: 72613671,
		// 				notable_features: 'lime green grips, scratch on side',
		// 				wheel_size: 52,
		// 				frame_size: 123,
		// 				thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
		// 			}
		// 	]

		// }

		// ABOVE IS TEMPORARY
		this._data = [];
		this._createObserverList();
		this._databaseRead();
	}
    get=()=>{

        return (this._data);
      	}
	_databaseRead() {
		Database.readBikeDataOn((snapshot) => {
			this._insertDataOnRead(snapshot.val());
			this._notifyAll(this._data); // Don't supply data to force a refresh by the presenter
		});
	}
	/*required data sample
	[{coordinate:{latitude:44.237424,longitude:-76.5131},
	title:"bike1",
	description:"help"}]
	*/


	_insertDataOnRead = (newdata) => {
	    //let temp = [{coordinate:{latitude:44.237424,longitude:-76.5131},title:"bike1",description:"help"}];
	    let temp = [];
	    // console.log(Object.values(newdata));
	    newdatalist = Object.values(newdata);
	     for (var i = 0; i < newdatalist.length; i ++ ){
	        if ( newdatalist[i].hasOwnProperty("longitude")&&newdatalist[i].hasOwnProperty("latitude")&&newdatalist[i].hasOwnProperty("stolen")&& newdatalist[i].stolen){
              temp.push(this.createMarker(newdatalist[i]));
              }
         }

        this._data = temp;
	}
    createMarker(markerElement){
            singleMarker={
                coordinate:{
                        latitude:markerElement.latitude,
                        longitude: markerElement.longitude,
                },
                key : markerElement.id,
                title: markerElement.model,
                description: markerElement.description,
            }
            return singleMarker;
        };

	}

