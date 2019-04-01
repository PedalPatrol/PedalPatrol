import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import { StackNavigator, createStackNavigator, createBottomTabNavigator, createSwitchNavigator, withNavigation } from 'react-navigation';
import { Icon } from 'react-native-elements';

import { colours } from '../components/views/stylesheets/base-styles';

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
import NotificationView from '../components/views/notification-view';
import SettingsView from '../components/views/settings-view';
import ReportLostView from '../components/views/reportlost-view';
import ReportFoundView from '../components/views/reportfound-view';
import HelpView from '../components/views/help-view';
import PrivacyPolicy from '../components/views/helpers/privacypolicy';

let screen = Dimensions.get('window');

/*
 * Bottom tab navigator, home, map and bike
 */
const Tabs = createBottomTabNavigator({
	Home: {
		screen: HomeView,
		navigationOptions: {
			tabBarLabel: 'Lost Bikes',
			tabBarIcon: ({ tintColor }) => <Icon name="home" type="entypo" size={28} color={tintColor} />
		},
	},
	Map: {
		screen: MapView,
		navigationOptions: {
			tabBarLabel: 'Map',
			tabBarIcon: ({ tintColor }) => <Icon name="md-map" type="ionicon" size={28} color={tintColor} />
		},
	},
	Bike: {
		screen: BikeView,
		navigationOptions: {
			tabBarLabel: 'My Bikes',
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
		tabBarVisible: true
	},
	lazy: false,
	initialRouteName: 'Map',
	initialLayout: {
		height: screen.height,
		width: screen.width
	},
	backBehavior: 'none',
	tabBarOptions: {
		activeTintColor: colours.ppGreen
	}
});

/*
 * Bike details stack
 */
const BikeDetailsStack = createStackNavigator({
	HomeStack: {
		screen: HomeView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			header: null
		}),
	},
	ReportFound: {
		screen: ReportFoundView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			title: 'ReportFound',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
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
},
{
	initialRouteName: 'HomeStack'
});

/*
 *  Stack navigator for map tab, allows moving between map and report lost page
 */
const MapReportLostStack = createStackNavigator({
	MapStack: {
		screen: Tabs,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			header: null
		}),
	},
	ReportLost: {
		screen: ReportLostView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			title: 'ReportLost',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	},
},
{
	initialRouteName: 'MapStack'
});

/*
 * Stack navigator for bike tab, allows edit bike page to come on top when clicked
 */
const AddBikeStack = createStackNavigator({
	BikeStack: {
		screen: BikeView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
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
},
{
	initialRouteName: 'BikeStack'
});

/*
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

/*
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

const HelpStack = createStackNavigator({
	Help: {
		screen: HelpView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			headerTitle: 'Help Center',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	},
	PrivacyPolicy: {
		screen: PrivacyPolicy,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			headerTitle: 'Privacy Policy',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	}
});

const SettingsStack = createStackNavigator({
	Settings: {
		screen: SettingsView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			title:'Settings',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	},
	Notifications: {
		screen: NotificationView,
		navigationOptions: ({navigation}) => ({
			tabBarVisible: false,
			gesturesEnabled: false,
			title: 'Notification',
			headerTitleStyle: { textAlign: 'center', alignSelf: 'center' }
		}),
	}
},
{
	initialRouteName: 'Settings'
});

/*
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

/*
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

/*
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
			},
			SettingsStack:{
				screen: SettingsStack,
				navigationOptions: ({navigation}) => ({
					gesturesEnabled: false,
				})
			},
			HelpStack: {
				screen: HelpStack,
				navigationOptions: ({navigation}) => ({
					gesturesEnabled: false,
				})
			},
			MapReportLostStack: {
				screen: MapReportLostStack,
				navigationOptions: ({navigation}) => ({
					gesturesEnabled: false,
				})
			},

		},
		{
			headerMode: "none",
			mode: "modal"
		}
	);
};