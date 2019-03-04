import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PixelRatio, TouchableOpacity, Image, SafeAreaView, Alert, ScrollView, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { HeaderBackButton } from 'react-navigation';

import BaseView from './view';
import HandleBack from './helpers/handleback';
import BikeDetailsPresenter from '../presenters/bikedetails-presenter';

class BikeDetailsView extends BaseView {
	state = {
		data: []
	}

	/**
	 * Set the navigation options, change the header to handle a back button.
	 *
	 * @return {Object} Navigation option
	 */
	static navigationOptions = ({navigation, transitioning}) => {
		return {
			headerLeft: (<HeaderBackButton disabled={transitioning} onPress={()=>{navigation.state.params._onBack()}}/>),
			title: navigation.getParam('title', 'Bike Details')
		}
	}

	/**
	 * Creates an instance of the add bike view
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.BikeDetP = new BikeDetailsPresenter(this);
	}

	/**
	 * Component is about to mount, initialize the data.
	 * This function is called before componentDidMount
	 */
	componentWillMount = () => {
		this.props.navigation.setParams({
			_onBack: this._onBack,
		});

		const { navigation } = this.props;
		const data = navigation.getParam('data', 'NO-DATA');

		this.setState({
			data: this.BikeDetP.translateData(data),
			avatarSource: null
		});
	}

	/**
	 * Component mounted
	 */
	componentDidMount = () => {
		const { navigation } = this.props;
		// const data = navigation.getParam('data', 'NO-DATA');

		// item = this.sectionedMultiSelect._findItem(data.colour);
		// this.sectionedMultiSelect._toggleItem(item, false);
	}

	/**
	 * Component will unmount after this method is called, do any clean up here
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.BikeDetP);
	}

	/**
	 * When the back button is clicked, check if the user was editing.
	 */
	_onBack = () => {
		this.props.navigation.navigate('Tabs');
	}

	/**
	 * Refreshes the state of the component so new data is fetched.
	 */
	refreshState = () => {
		this.setState({ 
			refresh: !this.state.refresh
		});
	}

	_renderItem = ({item}) => (
		<View style={styles.textrow}>
			<Text style={styles.titleText}>
				{item.title}
			</Text>
			<Text style={styles.dataText} numberOfLines={4}>
				{item.text}
			</Text>
		</View>
	);

	/**
	 * Extract the key from the item and index
	 */
	_keyExtractor = (item, index) => item.id;

	/**
	 * Renders items to the screen
	 *
	 * @return {Component} 
	 */
	render() {
		return (
				<HandleBack onBack={this._onBack}>
					<SafeAreaView style={{ flex:0, backgroundColor: '#F5FCFF' }} />
						<View style={styles.container}>
							<ScrollView contentContainerStyle={styles.contentContainer}>

							<View style={[
									styles.avatar,
									styles.avatarContainer,
									{ marginBottom: 20 },
								]}>
								{this.state.avatarSource === null ? (
									<Icon name="photo-camera" type="MaterialIcons" size={100} color="#01a699" />
								) : (
									<Image style={styles.avatar} resizeMode="contain" source={this.state.avatarSource} />
								)}
							</View>


							{/* List of text inputs */}
							<FlatList
								style={styles.flatList}
								data={this.state.data}
								extraData={this.state}
								keyExtractor={this._keyExtractor}
								renderItem={this._renderItem}/>

							</ScrollView>
						</View>
					<SafeAreaView style={{ flex:0, backgroundColor: '#F5FCFF' }} />
				</HandleBack>
		);
	}

}

export default BikeDetailsView;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	avatarContainer: {
		borderColor: '#9B9B9B',
		borderWidth: 1 / PixelRatio.get(),
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		height: 200,
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
	avatar: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		height: 200
	},
	flatList: {
		marginTop: 220
	},
	textrow: {
		flexDirection: 'row'
	},
	titleText: {
		fontWeight: 'bold'
	},
	dataText: {

	}
});