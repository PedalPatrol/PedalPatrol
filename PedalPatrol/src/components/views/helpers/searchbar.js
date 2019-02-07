import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';

export default class SearchBarHelper extends Component {

	render() {
		return (   
			<View style={styles.searchContainer}> 
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
				<View style={{flex:1}}>
					<TouchableHighlight onPress={() => this.props.openFilter()} accessibilityLabel="New">
						<Icon name="filter-list" type="MaterialIcons" size={30} color="#01a699" />
					</TouchableHighlight>
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
		paddingTop: 5,
	},
	searchBar: {
		backgroundColor:'transparent', 
		borderTopWidth: 0, 
		borderBottomWidth: 0,
	}
});