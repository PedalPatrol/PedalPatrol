import React, { Component } from 'react';
import { Platform, Image, StyleSheet, View, TouchableHighlight, TouchableOpacity, SafeAreaView } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';

export default class SearchBarHelper extends Component {

	render() {
		return (   
			<View>
				<SafeAreaView style={{ flex:0, backgroundColor: '#F5FCFF' }} />
				<View style={styles.searchContainer}>
					{/* Profile */}
					<View style={{flex:1}}>
						<TouchableOpacity>
							<Image style={styles.profile} resizeMode="cover" source={{uri: this.props.profilePicture}} />
						</TouchableOpacity>
					</View>

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
					
					{/* Filter button */}
					<View style={{flex:1}}>
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
		alignItems:'center',
		justifyContent:'space-between',
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
		left:10
	}
});