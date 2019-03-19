import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';

import TimeUtil from '../../../util/timeutility';

const TYPE_STOLEN = 'stolen';
const TYPE_FOUND = 'found';

/**
 * Class to help the displaying of notification items on the home view page
 */
class NotificationBikeItemHelper extends Component {

	componentWillMount = () => {
		this.setState({
			type: this.props.type
		});
	}

	/**
	 * Navigate to a page with a title.
	 * This method is used over the commented out line below because successive touches of a bike item
	 * would not add the data because data is only received in process in the componentWillMount function.
	 * So adding the 'key' property to navigate makes it see that the new page is unique.
	 *
	 * @param {string} screen - The route to navigate to. See navigation.js stacks and screens
	 */
	navigate = (screen) => {
		// <TouchableOpacity onPress={() => this.props.navigation.navigate('BikeDetails', {data: this.props.data})}>
		this.props.navigation.navigate({
			routeName: screen,
			params: {
				data: this.props.data, 
			},
			key: screen + TimeUtil.getDateTime()
		});
	}

	render() {
		return(
			<TouchableOpacity onPress={() => this.navigate('BikeDetails')}>
				<View style={styles.rowContainer}>
				  	{/* Everything is put as columns from the top row */}
					<View style={styles.topRow}>
						
						{/* First column is model, image, datetime and address */}
						<View style={{flex: 1, alignItems:'flex-start'}}>
							<View style={styles.nameImageCol}>
								
								{/* Model */}
								<Text style={styles.model} numberOfLines={1} ellipsizeMode ={'tail'}>
									{this.props.data.model}
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
								<Text style={styles.datetime} numberOfLines={1} ellipsizeMode ={'tail'}>
									{this.props.data.datetime}
								</Text>
								<Text style={styles.address} numberOfLines={1} ellipsizeMode ={'tail'}>
									{this.props.data.address}
								</Text>

							</View>
						</View>

						{/* Second column is hoursago, notable features, description and icons */}
						<View style={{flex: 1}}>
							<View style={{flex: 1, flexDirection:'column', alignItems:'flex-end'}}>
								
								{/* Time ago */}
								<Text style={styles.time} numberOfLines={1} ellipsizeMode ={'tail'}>
									{this.props.data.timeago}
								</Text>

								{/* Notable features and description */}
								<View style={{flex: 5, flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start'}}>
									<Text style={styles.other} numberOfLines={2} ellipsizeMode ={'tail'}>
										Notable Features: {this.props.data.notable_features}
									</Text>	
									<Text style={styles.other} numberOfLines={5} ellipsizeMode ={'tail'}>
										Description: {this.props.data.description}
									</Text>
								</View>

								{/* Bottom icons only show if stolen bikes are shown */}
								{ this.state.type === TYPE_STOLEN &&
									
									<View style={{flex: 1, flexDirection:'row', alignItems:'center', justiftContent:'space-between'}}>
										{/* Toggle for the bookmark button*/}
										<TouchableOpacity style={styles.icon} onPress={() => {this.props.setBookmark(this.props.data.id)}} accessibilityLabel="Bookmark">
											{ this.props.bookmarked ? 
												(<Icon name="bookmark" type="MaterialIcons" size={24} color="#01a699" />)
												:
												(<Icon name="bookmark-border" type="MaterialIcons" size={24} color="#01a699" />)
											}
										</TouchableOpacity>
										{/* Map pin */}
										<TouchableOpacity style={styles.icon} accessibilityLabel="Pin" onPress={() => this.navigate('Map')}>
											<Icon name="pin-drop" type="MaterialIcons" size={24} color="#01a699" />
										</TouchableOpacity>
										{/* Comment button */}
										<TouchableOpacity style={styles.icon} accessibilityLabel="Comment">
											<Icon name="comment" type="MaterialIcons" size={24} color="#01a699" />
										</TouchableOpacity>
									</View>
								}

							</View>
						</View>

					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

export default NotificationBikeItemHelper;

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
		paddingRight: 5,
		marginTop: 5,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#777',
		flex:1,
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
		flex:1, 
		flexDirection:'column', 
		width:undefined,
	},
	timeOtherCol: {
		flex:1, 
		flexDirection:'column', 
	},
	icon: {
		marginLeft: 20,
		marginRight: 15,
		marginTop: 5,
		alignItems: 'flex-start'
	}
});
