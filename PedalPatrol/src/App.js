/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createRootNavigator } from './config/navigation';

import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBUzSFTc_c5k3hwTX6ySfbfxLu0xASzpDY",
    authDomain: "test-f4788.firebaseapp.com",
    databaseURL: "https://test-f4788.firebaseio.com",
    projectId: "test-f4788",
    storageBucket: "test-f4788.appspot.com",
    messagingSenderId: "131545184736"
};
firebase.initializeApp(config);

export default class App extends Component {
  render() {
    const Navigator = createAppContainer(createRootNavigator());
   return <Navigator />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
