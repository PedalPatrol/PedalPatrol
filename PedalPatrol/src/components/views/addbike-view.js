import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PixelRatio, TouchableOpacity, Image, SafeAreaView, Alert, ScrollView, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import HandleBack from './helpers/handleback';
import { HeaderBackButton } from 'react-navigation';
import { TextInput } from 'react-native-paper';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const colours = require('../../assets/colours/colours.json');

const addbikeimage = require('../../assets/images/addbikewithcameraicon.png'); // Unused currently

export default class AddBikeView extends Component {
	state = {
		avatarSource: null,
		videoSource: null,
    	editing: false,

    	data: dataList.data,

    	selectedItems: []
	};

	/**
	 * Set the navigation options, change the header to handle a back button.
	 *
	 * @return {Object} Navigation option
	 */
	static navigationOptions = ({navigation}) => {
  		return {
			headerLeft: (<HeaderBackButton onPress={()=>{navigation.state.params.onBack()}}/>)
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
		this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
	}


	/**
	 * Component mounted
	 */
	componentDidMount = () => {
		this.props.navigation.setParams({
			onBack: this.onBack
		});
	}

	/**
	 * Toggle the editing mode.
	 */
	toggleEditing = () => {
		this.setState({ editing: !editing });
	}

	/**
	 * Set the editing value to the passed in value.
	 *
	 * @param {Boolean} edit - true: user is editing; false: user is not editing
	 */
	setEditing = (edit) => {
		this.setState({ editing: edit });
	}

	/**
	 * Open the image picker. Set the editing option to true.
	 */
	selectPhotoTapped() {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true,
			},
		};

		this.setEditing(true);

		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled photo picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				let source = { uri: response.uri };

				// You can also display the image using data:
				// let source = { uri: 'data:image/jpeg;base64,' + response.data };

				this.setState({
					avatarSource: source,
				});
			}
		});
	}

	/**
	 * When the back button is clicked, check if the user was editing.
	 */
	onBack = () => {
		if (this.state.editing) {
			Alert.alert(
				"You're still editing!",
				"Are you sure you want to go back with your edits not saved?",
			  	[
					{ text: "Keep Editing", onPress: () => {}, style: "cancel" },
					{ text: "Go Back", onPress: () => this.props.navigation.navigate('Tabs') },
			  	],
			  	{ cancelable: false },
			);

		} else {
			this.props.navigation.navigate('Tabs'); // If not editing then go back
		}
	};

	/**
	 * Render a text input item.
	 * 
	 * @param {Object} item - A list item, index - The index of the item in the data list
	 */
	_renderItem = ({item, index}) => (
		<TextInput
			style={styles.textInput}
			label={item.name}
			multiline={item.multiline}
			value={this.state.data[index].text}
			onChangeText={(text) => {
					let { data } = this.state;
					data[index].text = text;
					this.setState({ data })
				} 
			}/>
	);


	/**
	 * Extract the key from the item and index
	 */
	_keyExtractor = (item, index) => item.name;

	/**
	 * Add the new selected items to the state and update
	 *
	 * @param {List} selectedItems - List of selected items
	 */
	onSelectedItemsChange = (selectedItems) => {
    	this.setState({ selectedItems });
  	} 

	render() {
		const { navigation } = this.props;

		return (
				<HandleBack onBack={this.onBack}>
						<SafeAreaView style={{ flex:0, backgroundColor: '#F5FCFF' }} />
						<View style={styles.container}>
							<ScrollView contentContainerStyle={styles.contentContainer}>
							
								{/* Picture frame */}
								<TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
									<View
										style={[
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
								</TouchableOpacity>

								{/* List of text inputs */}
								<FlatList
									style={styles.flatList}
									data={dataList.data}
									extraData={this.state}
									keyExtractor={this._keyExtractor}
									renderItem={this._renderItem}/>
							
								<SectionedMultiSelect
									style={styles.textInput}
									items={colours.data}
									showRemoveAll
									colors={{ primary: this.state.selectedItems.length ? 'forestgreen' : 'crimson',}}
									uniqueKey='name'
									selectText='Colours'
									modalWithSafeAreaView={true}
									showDropDowns={true}
									onSelectedItemsChange={this.onSelectedItemsChange}
									selectedItems={this.state.selectedItems}
									/>
							</ScrollView>
						</View>
						<SafeAreaView style={{ flex:0, backgroundColor: '#F5FCFF' }} />
				</HandleBack>
		);
	}
}

// List of text inputs for adding bike. Items in list appear in this order
const dataList = {
	data: [
		{
			name: 'Serial Number',
			multiline: false,
			text: ''
		},
		{
			name: 'Brand',
			multiline: false,
			text: ''
		},
		{
			name: 'Model',
			multiline: false,
			text: ''
		},
		{
			name: 'Notable Features',
			multiline: true,
			text: ''
		},
		{
			name: 'Wheel Size',
			multiline: false,
			text: ''
		},
		{
			name: 'Frame Size',
			multiline: false,
			text: ''
		}
	]
}

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
	scrollContainer: {
		paddingVertical: 20,
  	},
  	textInput: {
  		marginRight: 10,
		marginLeft: 10,
		marginBottom: 10,
		backgroundColor: '#F5FCFF',
  	},
  	flatList: {
  		marginTop: 220
  	}
});