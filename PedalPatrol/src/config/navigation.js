import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import { StackNavigator, createStackNavigator, createBottomTabNavigator, createSwitchNavigator, withNavigation } from 'react-navigation';
import { Icon } from 'react-native-elements';

import HomeView from '../components/views/home-view';
import MapView from '../components/views/map-view';
import BikeView from '../components/views/bike-view';
import AddBikeView from '../components/views/addbike-view';
import BikeDetailsView from '../components/views/bikedetails-view';
import SignUpView from '../components/views/signup-view';
import LoginView from '../components/views/login-view';
import AuthLoadingView from '../components/views/authloading-view';
import ProfileView from '../components/views/profile-view';
import AlertView from '../components/views/alert-view';

let screen = Dimensions.get('window');

/**
 * Bottom tab navigator, home, map and bike
 */
const Tabs = createBottomTabNavigator({
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
  	initialRouteName: 'Map',
});

/**
 * Bike details stack
 */
const BikeDetailsStack = createStackNavigator({
	Home: {
		screen: HomeView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			header: null
		}),
	},
	BikeDetails: {
		screen: BikeDetailsView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	}
});

/**
 * Stack navigator for bike tab, allows edit bike page to come on top when clicked
 */
const AddBikeStack = createStackNavigator({
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
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	},
});

/**
 * Stack navigator for profile page. We need to define a stack navigator for views in the drawer if we want a header.
 */
const ProfileStack = createStackNavigator({
	Profile: {
		screen: ProfileView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			headerTitle: 'Profile',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	}
});

/**
 * Stack navigator for alerts page. We need to define a stack navigator for views in the drawer if we want a header.
 */
const AlertStack = createStackNavigator({
	Alerts: {
		screen: AlertView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			headerTitle: 'Alerts',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	}
});

/**
 * Stack navigator for the login page to allow for the signup page to be opened from the login page
 */
const LoginStack = createStackNavigator({
	Login: {
		screen: LoginView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			header: null
		}),
	},
	Signup: {
		screen: SignUpView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			title: 'Sign up',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	}
},
{
	initialRouteName: 'Login'
});

/**
 * Authorization stack. Includes auth loading (splash screen), login stack and application stack.
 */
const AuthInitialStack = createSwitchNavigator({
	AuthLoading: {
		screen: AuthLoadingView,
		navigationOptions: ({navigation}) => ({
			header: null,
		}),
	},
	AuthStack: LoginStack,
	App: Tabs
},
{
	initialRouteName: 'AuthLoading'
});

/**
 * All possible stack navigators
 */
export const createRootNavigator = () => {
	return createStackNavigator(
		{
			Auth: {
				screen: AuthInitialStack,
				navigationOptions: ({navigation}) => ({
					gesturesEnabled: false,
				})
			},
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
			},
			BikeDetailsStack: {
				screen: BikeDetailsStack,
				navigationOptions: ({navigation}) => ({
					gesturesEnabled: false,
				})
			},
			ProfileStack: {
				screen: ProfileStack,
				navigationOptions: ({navigation}) => ({
					gesturesEnabled: false,
				})
			},
			AlertStack: {
				screen: AlertStack,
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