import React, {Component, PropTypes} from 'react';
import { Text, View, StyleSheet, Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';

export default class Button extends Component {
  render() {
	if (Platform.OS === 'android') {
	  return(
		<TouchableNativeFeedback
		  onPress={this.props.onPress}>
		  {this._renderContent()}
		</TouchableNativeFeedback>
	  );
	} else if (Platform.OS === 'ios') {
	  return(
		<TouchableHighlight
		  onPress={this.props.onPress}>
		  {this._renderContent()}
		</TouchableHighlight>
	  );
	}
  }

  _renderContent() {
	return(
	  <View style={styles.content}>
		  <Text style={styles.text}>{this.props.text}</Text>
	  </View>
	);
  }

}

const styles = StyleSheet.create({
  text: {
	color: 'black',
	fontSize: 14,
	fontWeight:'bold',
	borderRadius:10,
	borderWidth: 1,
	borderColor: '#fff',
  },
  content: {
	height: 45,
	backgroundColor: 'white',
	alignItems:'center',
	justifyContent:'center',
	borderRadius: 3
  },
});