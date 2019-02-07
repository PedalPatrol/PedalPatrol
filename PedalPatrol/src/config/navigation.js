import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import { StackNavigator, createStackNavigator, createBottomTabNavigator, withNavigation } from 'react-navigation';
import { Icon } from 'react-native-elements';

import HomeView from '../components/views/home-view';
import MapView from '../components/views/map-view';
import BikeView from '../components/views/bike-view';
import EditBikeView from '../components/views/helpers/editbike';

let screen = Dimensions.get('window');

export const Tabs = createBottomTabNavigator({
  	'Home': {
		screen: HomeView,
		navigationOptions: {
	  		tabBarLabel: 'Home',
	  		tabBarIcon: ({ tintColor }) => <Icon name="home" type="entypo" size={28} color={tintColor} />
		},
  	},
  	'Map': {
		screen: MapView,
		navigationOptions: {
	  		tabBarLabel: 'Map',
	  		tabBarIcon: ({ tintColor }) => <Icon name="md-map" type="ionicon" size={28} color={tintColor} />
		},
  	},
  	'Bike': {
		screen: BikeView,
		navigationOptions: {
	  		tabBarLabel: 'Bike',
	  		tabBarIcon: ({ tintColor }) => <Icon name="md-bicycle" type="ionicon" size={28} color={tintColor} />
		},
  	},
},
{
	navigationOptions: {
		// generic handler for all tabs
	  	// can be overriden by individual screens
	  	tabBarOnPress: ({ navigation, defaultHandler }) => {
			defaultHandler();
	  	},
  	},
  	lazy: false,
});

export const BikeStack = createStackNavigator({
	BikeStack: {
		screen: BikeView,
		navigationOptions: ({navigation}) => ({
			header: null,
		}),
	},
	EditBike: {
		screen: EditBikeView,
		navigationOptions: ({navigation}) => ({
			header: null,
			tabBarVisible: false,
			gesturesEnabled: false
		}),
	},
});

export const createRootNavigator = () => {
	return createStackNavigator(
		{
			Tabs: {
				screen: Tabs,
				navigationOptions: ({navigation}) => ({
					gesturesEnabled: false,
				})
			},
			BikeStack: {
				screen: BikeStack,
				navigationOptions: ({navigation}) => ({
					gesturesEnabled: false,
				})
			}
		},
		{
			headerMode: "none",
			mode: "modal"
		}
	);
};