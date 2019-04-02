import React, { Component } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import HTML from 'react-native-render-html';

import PrivacyPolicyHTML from '../../../assets/static/pedal-patrol-privacy-policy';

/**
 * Class for displaying the privacy policy as html.
 */
class PrivacyPolicy extends Component {
	/**
	 * Renders the privacy policy as HTML.
	 */
	render () {
		return (
			<ScrollView style={{ flex: 1 }}>
				<HTML html={PrivacyPolicyHTML.PrivacyPolicyHTML} imagesMaxWidth={Dimensions.get('window').width} containerStyle={{marginLeft: 15, marginRight: 15}} />
			</ScrollView>
		);
	}
}

export default PrivacyPolicy;