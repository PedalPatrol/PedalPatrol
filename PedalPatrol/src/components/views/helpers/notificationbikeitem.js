import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View, TouchableHighlight } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

export default class NotificationBikeItemHelper extends Component {

	render() {
		return(
			<TouchableOpacity>
			
				<View style={styles.rowContainer}>
				  
					<View style={styles.topRow}>
						<View style={{flex: 1, alignItems:'flex-start'}}>
							<View style={styles.nameImageCol}>
								<Text style={styles.model} numberOfLines={1} ellipsizeMode ={'tail'}>
									{this.props.model}
								</Text>
								
								<View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}} flex>
									{/* Thumbnail */}
									<View style={{flex: 1, flexDirection:'row', justifyContent:'flex-start'}} left>
											<Image source={{uri: this.props.thumbnail}}
												   style={styles.thumbnail}
												   resizeMode="contain" />
									</View>
								</View>
								
								<Text style={styles.datetime} numberOfLines={1} ellipsizeMode ={'tail'}>
									{this.props.datetime}
								</Text>
								<Text style={styles.address} numberOfLines={1} ellipsizeMode ={'tail'}>
									{this.props.address}
								</Text>
							</View>
						</View>
						<View style={{flex: 1}}>

							<View style={{flex: 1, flexDirection:'column', alignItems:'flex-end'}}>
								<Text style={styles.time} numberOfLines={1} ellipsizeMode ={'tail'}>
									{this.props.timeago}
								</Text>

								<View style={{flex: 5, flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start'}}>
									<Text style={styles.other} numberOfLines={2} ellipsizeMode ={'tail'}>
										Notable Features: {this.props.notable_features}
									</Text>	
									<Text style={styles.other} numberOfLines={5} ellipsizeMode ={'tail'}>
										Description: {this.props.description}
									</Text>
								</View>

								<View style={{flex: 1, flexDirection:'row', alignItems:'center', justiftContent:'space-between'}} left>
									<TouchableHighlight style={styles.icon} accessibilityLabel="Bookmark">
										<Icon name="bookmark-border" type="MaterialIcons" size={24} color="#01a699" />
									</TouchableHighlight>
									<TouchableHighlight style={styles.icon} accessibilityLabel="Comment">
										<Icon name="pin-drop" type="MaterialIcons" size={24} color="#01a699" />
									</TouchableHighlight>
									<TouchableHighlight style={styles.icon} accessibilityLabel="Pin">
										<Icon name="comment" type="MaterialIcons" size={24} color="#01a699" />
									</TouchableHighlight>
								</View>

							</View>

						</View>
					</View>
					
				</View>
			</TouchableOpacity>
		);
	}
}

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
