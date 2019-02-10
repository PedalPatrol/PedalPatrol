import React, { Component } from 'react';
import { Platform, Image, StyleSheet, View, TouchableHighlight, TouchableOpacity, SafeAreaView, DropDownMenu } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import ProfileButton from './profilebutton';
import FilterHelper from './filter';

export default class SearchBarHelper extends Component {
	render() {
		return (   
			<View>
				<SafeAreaView style={{ flex:0, backgroundColor: '#F5FCFF' }} />
				<View style={styles.searchContainer}>
                    {/* Profile */}
                    <ProfileButton profilePicture={this.props.profilePicture} />
          
					{/* Search Bar */}
					<View style={{flex:6}}>
						<SearchBar        
							placeholder="Type Here..."        
							lightTheme
							round
							containerStyle={styles.searchBar}
							onChangeText={(text) => this.props.handleSearchFilter(text)}
							onCancel={this.props.handleSearchCancel}
							onClear={this.props.handleSearchClear}
							autoCorrect={false}             
						/>
					</View>
					
						{/* Filter button - Using sectioned multi select */}
						{/* <View style={{flex:1, bottom:25}}> */}
							{/* <FilterHelper onSelectedItemsChange={this.props.onSelectedItemsChange} selectedItems={this.props.selectedItems}/> */}
						{/* </View> */}

						{/* Filter button - Using button - Needs dropdown */}
						<View style={{flex:1, top:5}}>
							<TouchableHighlight onPress={() => this.props.openFilter()} accessibilityLabel="New">
								<Icon name="filter-list" type="MaterialIcons" size={30} color="#01a699" />
							</TouchableHighlight>
						</View>
					
				</View>
			</View>
		);  
	};

};

const styles = StyleSheet.create({
	searchContainer: { // View that contains search bar
		backgroundColor: '#F5FCFF',
		flexDirection:'row',
		paddingTop: 5,
	},
	searchBar: {
		backgroundColor:'transparent', 
		borderTopWidth: 0, 
		borderBottomWidth: 0,
		left:8
	},
	profile: {
		flex:1,
		width: 40,
		height: 40,
		borderRadius: 20,
		
	}
});