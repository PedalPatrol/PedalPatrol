
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button,Alert} from 'react-native';
import BasePresenter from './presenter';
import  {MapM} from '../models/export-models';


class MapPresenter extends BasePresenter {
    constructor(view){
       super();
       this.view = view;
       MapM.subscribe(this);

    }
    //markers=this.createMarkerList();

/* test command
    getG(){
        console.log('im G');
        MapM.readMarkerData();
    }
    */
    createMarkerList(){
        markers = [];
       //markerList = MapM.get();

        markerList=[];
        for (var i = 0; i < markerList .length; i ++ ){
                markers.push(this.createMarker(markerList[i]));
             }
        return markers;
    };
    createMarker(markerElement){
        decode = Object.values(markerElement);
        singleMarker={
            coordinate:{
                    latitude:decode[3],
                    longitude: decode[4],
            },
            key : decode[2],
            title: decode[1],
            description: decode[2],
        }
        return singleMarker;
    };
    getData = () =>{
        return MapM.get();
    }

    /**
    	 * If the view or presenter is destroyed, unsubscribe the presenter from the model.
    	 */
    	onDestroy = () => {
    		MapM.unsubscribe(this);
    	};
    onUpdated = () => {
		// Do something with the new data or let the view auto update?
        this.forceRefresh();
	};

	forceRefresh = () => {
    	this.view.setState({
    	markers: this.getData()
    	});
    };
}
export default MapPresenter;
