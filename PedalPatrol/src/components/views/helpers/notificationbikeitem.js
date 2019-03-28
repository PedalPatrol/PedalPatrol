import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

import { colours } from '../stylesheets/base-styles';

import TimeUtil from '../../../util/timeutility';

const TYPE_STOLEN_HOME = 'Home';
const TYPE_FOUND_ALERTS = 'Alerts';

/**
 * Class to help the displaying of notification items on the home view page.
 * @extends Component
 */
class NotificationBikeItem extends Component {

	static propTypes = {
		from: PropTypes.oneOf([TYPE_STOLEN_HOME, TYPE_FOUND_ALERTS]).isRequired,
		data: PropTypes.shape({
			model: PropTypes.string,
			thumbnail: PropTypes.array.isRequired,
			datetime: PropTypes.string.isRequired,
			address: PropTypes.string,
			timeago: PropTypes.string.isRequired,
			notable_features: PropTypes.string,
			description: PropTypes.string,
			id: PropTypes.string.isRequired,
			bookmarked: PropTypes.string.bool,
		}).isRequired
	}

	/**
	 * Component is about to mount. Has not mounted yet
	 */
	componentWillMount = () => {
		this.setState({
			from: this.props.from,
		});
	}

	/**
	 * Navigate to a page with a title.
	 * This method is used over the commented out line below because successive touches of a bike item
	 * would not add the data because data is only received in process in the componentWillMount function.
	 * So adding the 'key' property to navigate makes it see that the new page is unique.
	 *
	 * @param {string} screen - The route to navigate to. See navigation.js stacks and screens
	 * @param {Boolean} shouldRenavigate - If the component should call the navigation function again or not because parameters don't pass correctly
	 */
	navigate = (screen, shouldRenavigate=false) => {
		// <TouchableOpacity onPress={() => this.props.navigation.navigate('BikeDetails', {data: this.props.data})}>
		this.props.navigation.navigate({
			routeName: screen,
			params: {
				rawData: this.props.data, // Report found takes in rawData but other pages in
				data: this.props.data,
				from: this.props.from,
				found: this.props.from === 'Alerts'
			},
			key: screen + TimeUtil.getDateTime()
		});

		/*
		 * The purpose of this is to trigger a re-navigate because for some reason, the Map tab does not receive the parameters
		 * set in the first navigate. It only works on subsequent navigations so we just have a small delay and trigger the navigate
		 * again. This is a hacky way to do it. A better solution would be to use Redux to save the state.
		 * React Navigation has a terrible architecture which really doesn't allow for different things like this to happen.
		 */
		if (shouldRenavigate) {
			setTimeout(() => {this.navigate(screen, false)}, 50);
		}
	}
 
	render() {
		return(
			<TouchableOpacity onPress={() => this.navigate('BikeDetails', false)}>
				<View style={styles.rowContainer}>
				  	{/* Everything is put as columns from the top row */}
					<View style={styles.topRow}>
						
						{/* First column is model, image, datetime and address */}
						<View style={{flex: 1, alignItems:'flex-start'}}>
							<View style={styles.nameImageCol}>
								
								{/* Model */}
								<Text style={styles.model} numberOfLines={1} ellipsizeMode={'tail'}>
									{this.props.data.model === '' ? 'Model Unknown' : this.props.data.model}
								</Text>
								
								<View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
									{/* Thumbnail */}
									<View style={{flex: 1, flexDirection:'row', justifyContent:'flex-start'}}>
											<Image source={{uri: this.props.data.thumbnail[0]}}
												   style={styles.thumbnail}
												   resizeMode="contain" />
									</View>
								</View>
								
								{/* Datetime & Address (bottom left) */}
								<Text style={styles.datetime} numberOfLines={1} ellipsizeMode={'tail'}>
									{this.props.data.datetime}
								</Text>
								<Text style={styles.address} numberOfLines={1} ellipsizeMode={'tail'}>
									{this.props.data.address}
								</Text>

							</View>
						</View>

						{/* Second column is hoursago, notable features, description and icons */}
						<View style={{flex: 1}}>
							<View style={{flex: 1, flexDirection:'column', alignItems:'flex-end'}}>
								
								{/* Time ago */}
								<Text style={styles.time} numberOfLines={1} ellipsizeMode={'tail'}>
									{this.props.data.timeago}
								</Text>

								{/* Notable features and description */}
								<View style={{flex: 5, flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start'}}>
									<Text style={styles.other} numberOfLines={2} ellipsizeMode={'tail'}>
										Notable Features: {this.props.data.notable_features}
									</Text>	
									<Text style={styles.other} numberOfLines={5} ellipsizeMode={'tail'}>
										Description: {this.props.data.description}
									</Text>
								</View>

								{/* Bottom icons only show if stolen bikes are shown */}
									
									<View style={{flex: 1, flexDirection:'row', alignItems:'center', justiftContent:'space-between'}}>
										{/* Bookmark button */}
										{ 
											this.state.from === TYPE_STOLEN_HOME &&
											
											<TouchableOpacity style={styles.icon} onPress={() => {this.props.setBookmark(this.props.data.id)}} accessibilityLabel="Bookmark">
												{ this.props.bookmarked ? 
													(<Icon name="bookmark" type="MaterialIcons" size={24} color={colours.ppGreen} />)
													:
													(<Icon name="bookmark-border" type="MaterialIcons" size={24} color={colours.ppGreen} />)
												}
											</TouchableOpacity>
										}
										{/* Map pin */}
										<TouchableOpacity style={styles.icon} accessibilityLabel="Pin" onPress={() => this.navigate('Map', true)}>
											<Icon name="pin-drop" type="MaterialIcons" size={24} color={colours.ppGreen} />
										</TouchableOpacity>

										{/* Report Found */}
										{
											this.state.from === TYPE_STOLEN_HOME &&
											<TouchableOpacity style={styles.icon} accessibilityLabel="Report Found" onPress={() => this.navigate('ReportFound')}>
												<Icon name="comment" type="MaterialIcons" size={24} color={colours.ppGreen} />
											</TouchableOpacity>
										}
									</View>

							</View>
						</View>

					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

export default NotificationBikeItem;

const styles = StyleSheet.create({
	rowContainer: {
		flexDirection: 'row',
		backgroundColor: '#FFF',
		height: 200,
		padding: 10,
		marginRight: 10,
		marginLeft: 10,
		marginTop: 10,
		borderRadius: 4,
		shadowOffset:{  width: 1,  height: 1,  },
		shadowColor: '#CCC',
		shadowOpacity: 1.0,
		shadowRadius: 1
	},
	datetime: {
		paddingLeft: 5,
		paddingTop: 5,
		fontSize: 12,
		color: '#777'
	},
	address: {
		paddingLeft: 5,
		paddingTop: 5,
		fontSize: 12,
		color: '#777'
	},
	time: {
		paddingTop: 7,
		paddingLeft: 10,
		paddingRight: 10,
		marginRight: 15,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFF',
		flex: 1,
		borderRadius: 15, 
		backgroundColor: colours.ppGreen, 
		overflow: 'hidden'
	},
	other: {
		paddingLeft: 10,
		marginTop: 5,
		fontSize: 12,
		color: '#777'
	},
	model: {
		paddingLeft: 5,
		paddingTop: 5,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#777',
	},
	owner: {
		paddingLeft: 10,
		marginTop: 5,
		fontSize: 14,
		color: '#777',
		flex:1
	},
	description: {
		paddingLeft: 10,
		marginTop: 5,
		fontSize: 14,
		color: '#777',
		
	},
	thumbnail: {
		flex: 1,
		height: undefined,
		width: undefined
	},
	rowText: {
		flex: 1,
		flexDirection: 'column',
	},
	topRow: {
		flex: 1,
		justifyContent: 'space-between', 
		flexDirection: 'row',
	},
	nameImageCol: {
		flex: 1, 
		flexDirection: 'column', 
		width: undefined,
	},
	timeOtherCol: {
		flex: 1, 
		flexDirection: 'column', 
	},
	icon: {
		marginLeft: 20,
		marginRight: 15,
		marginTop: 5,
		alignItems: 'flex-start'
	}
});
