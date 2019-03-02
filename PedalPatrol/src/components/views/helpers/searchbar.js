import React, { Component } from 'react';
import { Platform, Image, StyleSheet, View, TouchableHighlight, TouchableOpacity, SafeAreaView, ViewStyle } from 'react-native';
import { Icon } from 'react-native-elements';
import { Searchbar } from 'react-native-paper';
import ProfileButton from './profilebutton';
import FilterHelper from './filter';

/**
 * Class to add a search bar header to a page
 */
class SearchBarHelper extends Component {
	state = {
		value: ''
	}


	render() {
		return (   
			<View>
				<SafeAreaView style={{ flex:0, backgroundColor: '#F5FCFF' }} />
				<View style={styles.searchContainer}>
                    {/* Profile */}
                    <ProfileButton profilePicture={this.props.profilePicture} />
          
					{/* Search Bar */}
					<View style={{flex:6}}>
						<Searchbar        
							placeholder="Search"        
							style={styles.searchBar}
							value={this.state.value}
							onChangeText={(text) => { this.props.handleSearchFilter(text); this.setState({ value: text })}}
						/>
					</View>
					
						{/* Filter button - Using sectioned multi select */}
						{/* <View style={{flex:1, bottom:25}}> */}
							{/* <FilterHelper onSelectedItemsChange={this.props.onSelectedItemsChange} selectedItems={this.props.selectedItems}/> */}
						{/* </View> */}

						{/* Filter button - Using button - Needs dropdown */}
						<View style={{flex:1, top:5}}>
							<TouchableOpacity onPress={() => this.props.openFilter()} accessibilityLabel="New">
								<Icon name="filter-list" type="MaterialIcons" size={30} color="#01a699" />
							</TouchableOpacity>
						</View>
					
				</View>
			</View>
		);  
	};
};

export default SearchBarHelper;

const styles = StyleSheet.create({
	searchContainer: { // View that contains search bar
		backgroundColor: '#F5FCFF',
		flexDirection:'row',
		paddingTop: 5,
	},
	searchBar: {
		backgroundColor:'transparent', 
		borderWidth: 1,
		borderRadius: 50,
		height: 35,
		left: 20,
		top: 5,
		marginRight: 20
	},
	profile: {
		flex:1,
		width: 40,
		height: 40,
		borderRadius: 20,
		
	}
});