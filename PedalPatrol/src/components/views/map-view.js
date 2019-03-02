import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Class for the Map view
 * @extends BaseView
 */
class MapView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Map
        </Text>
      </View>
    );
  }
}

export default MapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});