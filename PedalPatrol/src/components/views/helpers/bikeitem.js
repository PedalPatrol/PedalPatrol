import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
import { Icon } from 'react-native-elements';

import ImageUtil from '../../../util/imageutil';

/**
 * Class to help the displaying of bike items on the bike view page
 */
class BikeItemHelper extends Component {

	/**
	 * Navigate to the Add bike page with the edit bike title.
	 * This method is used over the commented out line below because successive touches of a bike item
	 * would not add the data because data is only received in process in the componentWillMount function.
	 * So adding the 'key' property to navigate makes it see that the new page is unique.
	 */
	navigate = () => {
		// <TouchableOpacity onPress={() => this.props.navigation.navigate('AddBike', {data: this.props.data, title: 'Edit Bike'})}>
		this.props.navigation.navigate({
			routeName: 'AddBike',
			params: {
				data: this.props.data, 
				title: 'Edit Bike'
			},
			key: 'AddBike' + ImageUtil.getDateTime()
		});
	}

	render() {
		return(
			<TouchableOpacity onPress={() => this.navigate()}>
				<View style={styles.rowContainer}>
					<View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                        {/* Thumbnail */}
                        <View style={{flex: 1, flexDirection:'row', justifyContent:'flex-start'}}>
                                <Image source={{uri: this.props.data.thumbnail[0]}}
                                       style={styles.thumbnail}
                                       resizeMode="contain" />
                        </View>
                      
                        {/* Add more lines and format based on text that is needed */}
                        <View style={styles.rowText}>

                            <Text style={styles.name} numberOfLines={1} ellipsizeMode ={'tail'}>
                                {this.props.data.name}
                            </Text>
                            <Text style={styles.other} numberOfLines={1} ellipsizeMode ={'tail'}>
                                Model: {this.props.data.model}
                            </Text>
                            <Text style={styles.other} numberOfLines={1} ellipsizeMode ={'tail'}>
                                Colour: {this.props.data.colour.join(', ')}
                            </Text>
                            <Text style={styles.other} numberOfLines={1} ellipsizeMode ={'tail'}>
                                Serial Number: {this.props.data.serial_number}
                            </Text>
                            <Text style={styles.other} numberOfLines={2} ellipsizeMode ={'tail'}>
                                Notable Features: {this.props.data.notable_features}
                            </Text>

                        </View>
                    </View>
				</View>
			</TouchableOpacity>
		);
	}
}

export default BikeItemHelper;

const styles = StyleSheet.create({
	rowContainer: {
		flexDirection: 'row',
		backgroundColor: '#FFF',
		height: 140,
		padding: 10,
		marginRight: 10,
		marginLeft: 10,
		marginTop: 10,
		borderRadius: 4,
		shadowOffset:{  width: 1,  height: 1,  },
		shadowColor: '#CCC',
		shadowOpacity: 1.0,
		shadowRadius: 1,
	},
	name: {
		paddingLeft: 10,
		paddingTop: 5,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#777',
	},
	other: {
		paddingLeft: 10,
		marginTop: 5,
		fontSize: 12,
		color: '#777'
	},
	thumbnail: {
		flex: 1,
		height: undefined,
		width: undefined
	},
	rowText: {
		flex: 1,
		flexDirection: 'column',
        alignItems: 'flex-start'
	},
    topRow: { 
        flexDirection: 'row',
    },
    nameImageCol: {
        flex:1, 
        flexDirection:'column', 
        width:140,
    },
});
