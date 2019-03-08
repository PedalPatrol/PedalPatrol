import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Class for the Profile view
 * @extends BaseView
 */
class ProfileView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Profile
        </Text>
      </View>
    );
  }
}

export default ProfileView;

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