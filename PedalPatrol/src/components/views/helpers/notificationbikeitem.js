import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

export default class NotificationBikeItemHelper extends Component {

	render() {
		return(
			<TouchableOpacity >
				<View style={styles.rowContainer}>
					
					{/* Thumbnail */}
					<Image source={{uri: this.props.thumbnail}}
						   style={styles.thumbnail}
						   resizeMode="contain" />
					
					{/* Add more lines and format based on text that is needed */}
					<View style={styles.rowText}>
						
						<Text style={styles.name} numberOfLines={3} ellipsizeMode ={'tail'}>
							{this.props.name}
						</Text>
						<Text style={styles.model} numberOfLines={2} ellipsizeMode ={'tail'}>
							{this.props.model}
						</Text>
						<View style={{flexDirection: 'row'}}>
							<Text style={styles.owner} numberOfLines={1} ellipsizeMode ={'tail'}>
								{this.props.owner}
							</Text>
							<Text style={styles.description} numberOfLines={1} ellipsizeMode ={'tail'}>
								{this.props.description}
							</Text>
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
		height: 100,
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
	name: {
		paddingLeft: 10,
		paddingTop: 5,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#777'
	},
	model: {
		paddingLeft: 10,
		paddingTop: 5,
		fontSize: 14,
		fontWeight: 'bold',
		color: '#777'
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
		flex:1
	},
	thumbnail: {
		flex: 1,
		height: undefined,
		width: undefined
	},
	rowText: {
		flex: 4,
		flexDirection: 'column'
	}
});
