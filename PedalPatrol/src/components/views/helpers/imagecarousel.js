import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import PropTypes from 'prop-types';

import { sliderWidth, itemWidth } from './imagehelpers/styles/SliderEntry.style';
import SliderEntry from './imagehelpers/components/SliderEntry';
import stylesC, { colors } from './imagehelpers/styles/index.style';

const SLIDER_1_FIRST_ITEM = 0;

/**
 * Class to display the image carousel and the page dots underneath.
 */
class ImageCarousel extends Component {
	state = {
		slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
	}

	static propTypes = {
		loading: PropTypes.bool,
		selected: PropTypes.func.isRequired,
		photos: PropTypes.array.isRequired	
	}

	/**
	 * Render an image.
	 *
	 * @param {Object, Number} item - A list item, index - The index of the item
	 */
	_renderImage = ({item, index}) => {
		return (
			<SliderEntry
			  data={item}
			  id={index}
			  parallax={false}
			  loading={this.props.loading ? this.props.loading : false}
			  selectPhoto={this.props.selected}
			/>
		);
	}


	render() {
		const { slider1ActiveSlide } = this.state;

		return (
			<View style={stylesC.exampleContainer}>
				<Carousel
				  ref={c => this._slider1Ref = c}
				  data={this.props.photos}
				  renderItem={this._renderImage}
				  sliderWidth={sliderWidth}
				  itemWidth={itemWidth}
				  hasParallaxImages={true}
				  firstItem={SLIDER_1_FIRST_ITEM}
				  inactiveSlideScale={0.94}
				  inactiveSlideOpacity={0.7}
				  // inactiveSlideShift={20}
				  removeClippedSubviews={false} 
				  containerCustomStyle={stylesC.slider}
				  contentContainerCustomStyle={stylesC.sliderContentContainer}
				  loop={false}
				  loopClonesPerSide={0}
				  autoplay={false}
				  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
				/>
				<Pagination
				  dotsLength={this.props.photos.length}
				  activeDotIndex={slider1ActiveSlide}
				  containerStyle={stylesC.paginationContainer}
				  dotColor={colors.green}
				  dotStyle={stylesC.paginationDot}
				  inactiveDotColor={colors.black}
				  inactiveDotOpacity={0.4}
				  inactiveDotScale={0.6}
				  carouselRef={this._slider1Ref}
				  tappableDots={!!this._slider1Ref}
				/>
			</View>
		);
	}
}

export default ImageCarousel;