import React, { Component } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import HTML from 'react-native-render-html';

export default class PrivacyPolicy extends Component {
    render () {
        return (
            <ScrollView style={{ flex: 1 }}>
                <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} />
            </ScrollView>
        );
    }
}