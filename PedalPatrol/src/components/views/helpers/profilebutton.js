import React, { Component } from 'react';
import { Platform, Image, StyleSheet, View, TouchableHighlight, TouchableOpacity, SafeAreaView } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';

export default class ProfileButton extends Component {
    render() {
          return (
            <View>
              {/* Profile */}
              <View style={{flex:1}}>
                  <TouchableOpacity>
                      <Image style={styles.profile} resizeMode="cover" source={{uri: this.props.profilePicture}} />
                  </TouchableOpacity>
              </View>
              </View>
          );  
    };
};

const styles = StyleSheet.create({
    profile: {
          flex:1,
          width: 40,
          height: 40,
          borderRadius: 20,
          left:10,
      }
});