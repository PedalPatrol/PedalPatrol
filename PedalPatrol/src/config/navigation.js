import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import { StackNavigator, createStackNavigator, createBottomTabNavigator, withNavigation } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Home from '../components/views/home-view';
import Map from '../components/views/map-view';
import Bike from '../components/views/bike-tab';
import EditBike from '../components/views/helpers/editbike'

import ConnectComponent from '../util/connect-component';
import BikePresenter from '../components/presenters/bike-presenter';

import BikeV from '../components';

let screen = Dimensions.get('window');

export const Tabs = createBottomTabNavigator({
  'Home': {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <Icon name="home" type="entypo" size={28} color={tintColor} />
    },
  },
  'Map': {
    screen: Map,
    navigationOptions: {
      tabBarLabel: 'Map',
      tabBarIcon: ({ tintColor }) => <Icon name="md-map" type="ionicon" size={28} color={tintColor} />
    },
  },
  'Bike': {
    screen: Bike,
    navigationOptions: {
      tabBarLabel: 'Bike',
      tabBarIcon: ({ tintColor }) => <Icon name="md-bicycle" type="ionicon" size={28} color={tintColor} />
    },
  },
});

export const BikeStack = createStackNavigator({
    BikeStack: {
        screen: Bike,
        navigationOptions: ({navigation}) => ({
            header: null,
        }),
    },
    EditBike: {
        screen: EditBike,
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