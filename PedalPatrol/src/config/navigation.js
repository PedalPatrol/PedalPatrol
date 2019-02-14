import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import { StackNavigator, createStackNavigator, createBottomTabNavigator, withNavigation } from 'react-navigation';
import { Icon } from 'react-native-elements';

import HomeView from '../components/views/home-view';
import MapView from '../components/views/map-view';
import BikeView from '../components/views/bike-view';
import AddBikeView from '../components/views/addbike-view';

let screen = Dimensions.get('window');

/**
 * Bottom tab navigator
 */
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

/**
 * Stack navigator for bike tab, allows edit bike page to come on top when clicked
 */
export const AddBikeStack = createStackNavigator({
	BikeStack: {
		screen: BikeView,
		navigationOptions: ({navigation}) => ({
			header: null,
		}),
	},
	AddBike: {
		screen: AddBikeView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			title: 'Add Bike',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	},
});

/**
 * All possible stack navigators
 */
export const createRootNavigator = () => {
	return createStackNavigator(
		{
			Tabs: {
				screen: Tabs,
				navigationOptions: ({navigation}) => ({
					gesturesEnabled: false,
				})
			},
			AddBikeStack: {
				screen: AddBikeStack,
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