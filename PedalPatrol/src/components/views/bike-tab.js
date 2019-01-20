import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import BikeView from './bike-view';

export default class BikeTab extends Component {
  render() {
    return (
      <View style={styles.container}>
        <BikeView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#F5FCFF',
  },
});