import React, { Component } from 'react';
import {SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';

import { colours } from '../stylesheets/base-styles';

/**
 * Class to render a safe area on the scren
 */
class SafeArea extends Component {

	static propTypes = {
		overrideColour: PropTypes.string
	}

	render() {
		return (
			<SafeAreaView 
				style={{ flex:0, backgroundColor: this.props.overrideColour ? this.props.overrideColour : colours.ppWhite }} 
				forceInset={{top: 'always'}} />
		);
	};
}

export default SafeArea;