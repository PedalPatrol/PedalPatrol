import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';

export default class SliderEntry extends Component {

	static propTypes = {
		data: PropTypes.object.isRequired,
		even: PropTypes.bool,
		parallax: PropTypes.bool,
		parallaxProps: PropTypes.object
	};

	get image () {
		const { data: { illustration }, parallax, parallaxProps, even } = this.props;

		return parallax ? (
			<ParallaxImage
				source={{ uri: illustration }}
				containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
				style={styles.image}
				parallaxFactor={0.35}
				showSpinner={true}
				spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
				{...parallaxProps}
			/>
		) : (
			<Image
				source={typeof illustration === 'object' ? illustration : { uri: illustration }}
				style={styles.image}
			/>
		);
	}

	render () {
		const { data: data, id, selectPhoto } = this.props;

		return (
			<TouchableOpacity
				disabled={this.props.loading}
				activeOpacity={1}
				style={styles.slideInnerContainer}
				onPress={() => { selectPhoto(id) }}>
				<View style={styles.imageContainer}>
					{ this.image }
				</View>
			</TouchableOpacity>
		);
	}
}
