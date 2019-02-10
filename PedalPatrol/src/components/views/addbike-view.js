import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, PixelRatio, TouchableOpacity, Image, SafeAreaView, Header, Left } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import HandleBack from './helpers/handleback';

export default class AddBikeView extends Component {
	state = {
		avatarSource: null,
		videoSource: null,
    	editing: false,
	};

	constructor(props) {
		super(props);
		this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
	}

	toggleEditing = () => {
		this.setState({ editing: !editing });
	}
	setEditing = (val) => {
		this.setState({ editing: val });
	}

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

	onBack = () => {
		if (this.state.editing) {
			Alert.alert(
				"You're still editing!",
				"Are you sure you want to go home with your edits not saved?",
			  	[
					{ text: "Keep Editing", onPress: () => {}, style: "cancel" },
					{ text: "Go Home", onPress: () => this.props.navigation.goBack() },
			  	],
			  	{ cancelable: false },
			);
			return true;
		}

		return false;
	};

	render() {
		const { navigation } = this.props;

		return (
				<HandleBack onBack={this.onBack}>
					<View style={styles.container}>
						<SafeAreaView style={{ flex:0, backgroundColor: '#F5FCFF' }} />
						
						
						<TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
							<View
								style={[
									styles.avatar,
									styles.avatarContainer,
									{ marginBottom: 20 },
								]}>
								{this.state.avatarSource === null ? (
									<Text>Select a Photo</Text>
								) : (
									<Image style={styles.avatar} source={this.state.avatarSource} />
								)}
							</View>
						</TouchableOpacity>
					</View>
				</HandleBack>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	avatarContainer: {
		borderColor: '#9B9B9B',
		borderWidth: 1 / PixelRatio.get(),
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatar: {
		width: 150,
		height: 150,
	},
});