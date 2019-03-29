import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, ScrollView, Alert, Button} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import { TextInput } from 'react-native-paper';
import { HeaderBackButton } from 'react-navigation';

import { styles, colours, reportfound_styles } from './stylesheets/reportfound-styles';

import ReportFoundPresenter from '../presenters/reportfound-presenter';
import BaseView from './view';

/**
 * Class for the reportfound view
 * @extends BaseView
 */
class ReportFoundView extends BaseView {
	/**
	 * Creates an instance of the report found view
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
  		super(props);
		this.reportfoundP = new ReportFoundPresenter(this);
		this.state = {
			text:'',
			bikeMenu:[],
			region:{
				latitude:44.237424,
				longitude:-76.5131,
				latitudeDelta:0.0922,
				longitudeDelta:0.0421,
	  		},
		  thisMarker: [],
		};
	}

	/**
	 * Set the navigation options, change the header to handle a back button.
	 *
	 * @return {Object} Navigation option
	 */
	static navigationOptions = ({navigation, transitioning}) => {
		const { params = {} } = navigation.state;
		const back = params._onBack ? params._onBack : () => 'default';
		return {
			headerLeft: (<HeaderBackButton disabled={transitioning} onPress={()=>{back()}}/>),
		};
	}

	/**
	 * The back function to go to the previous page.
	 */
	_onBack = () => {
		this.props.navigation.navigate(this.state.from);
	}
	
	/**
	 * Sets a marker in the state. Only one marker is stored at a time.
	 *
	 * @param {Object} e - A place marker event
	 */
	setMarker(e){
		let coor = e.nativeEvent.coordinate;
		this.setState({
			thisMarker:[{key: 0, coordinate:coor}],
		});
	}

	/**
	 * Component is about to mount, initialize the data before rendering.
	 */
	componentWillMount = () => {
		this.props.navigation.setParams({
			_onBack: this._onBack,
		});
		
		const { navigation } = this.props;
		const data = navigation.getParam('rawData', 'NO-DATA');

		const fromPage = navigation.getParam('from', 'Home');
		this.setState({
			editeddata: data,
			from: fromPage
		});
	};

	/**
	 * Component mounted
	 */
	componentDidMount = () => {
		this._setUserLocation();
	};

	/**
	 * Component is about to unmount.
	 */
	componentWillUnmount = () => {
		this.viewUnmounting(this.reportfoundP);
	}
	
	/**
	 * Region has changed so set the state to the new region.
	 *
	 * @param {Object} region - A new region. Properties: latitude, longitude, latitudeDelta, longitudeDelta
	 */
	onRegionChange = (region) =>{
		this.setState({region:region});
	}

	/**
	 * Set the location of user.
 	 */
	_setUserLocation = () => {
		this._getCurrentLocation().then(position => {
			if (position) {
				const location = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				};
				this.setState({
					region: location
				});
			}
		});
	}

	/**
	 * Get user's current location.
	 */
	_getCurrentLocation = () => {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
		});
	};

	/**
	 * Handle the events after clicking submit button.
	 */
	_handleClick() {
		if (typeof(this.state.thisMarker[0])==='undefined') {
			Alert.alert("Please pin a location")
		} else {
			this.sendUpdate();
		}
	}

	/**
	 * Refreshes the state of the component so new data is fetched.
	 */
	refreshState = () => {
		this.setState({
			refresh: !this.state.refresh
		});
	}

	/**
	 * Get needed data from the view and send it to presenter.
	 */
	sendUpdate = () => {
		// console.log('latitude in reportfound: '+this.state.thisMarker[0].coordinate.latitude)
		// Extract data from components
		let new_data = {
			data:	{
				coordinate:this.state.thisMarker[0].coordinate,
				editeddata:this.state.editeddata,
				text:this.state.text,
			}
		}
		const data = new_data;
		this.reportfoundP.update(data, this.alertCallback);
	}

	/**
	 * Sets a callback on what to do if there is a success or error when a bike is uploaded.
	 *
	 * @param {Boolean} success - true: Uploading successful; false: Uploading failed
	 */
	alertCallback = (success) => {
		this.refreshState();
		if (success) {
			Alert.alert(
				"Report successfully uploaded!",
				"",
				[
					{ text: "Ok", onPress: () => this.props.navigation.navigate('Home'), style: "ok" },
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				"Fail to report.",
				"Please try again.",
				[
					{ text: "Ok", onPress: () => {}, style: "ok" },
				],
				{ cancelable: false },
			);
		}
	}

	/**
	 * Render the text of button.
	 * @param{Object} rowData - the row data of the bike menu
	 */
	_dropdown_2_renderButtonText(rowData) {
		const {name} = rowData;
		return `${name}`;
	}

	/**
	 * Events after selecting the item from the dropdown menu
	 * @param {int}idx - the id of the selected item in menu.
	 * @param {Object}value - the value of the selected item.
	 */
	_dropdown_2_onSelect = (idx,value) => {
		this.setState({bikeid: `${value.id}`});
	}

	/**
	 * Render each row in the menu
	 * @param {Object}rowData - each data in bikemenu
	 * @param {int}rowID - the id of item in the menu
	 * Highlight the selected item.
	 */
	 _dropdown_2_renderRow(rowData, rowID, highlighted) {
		let evenRow = rowID % 2;

		return (
			<TouchableHighlight underlayColor='cornflowerblue'>
				<View style={[reportfound_styles.dropdown_2_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
					<Text style={[reportfound_styles.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
						{`${rowData.name} `}
					</Text>
				</View>
		  </TouchableHighlight>
		);
	}


	render() {
		return (
			<View style={styles.container}>
				<Text style={reportfound_styles.serial_number}>
					{"Serial Number: " + this.state.editeddata.serial_number}
				</Text>
				<TextInput style={reportfound_styles.row1}
					label="Add a Description"
					value={this.state.text}
					multiline={true}
					blurOnSubmit
					onChangeText={(text) => this.setState({text})}>
			   	</TextInput>

				<View style = {reportfound_styles.cell}>
					<MapView style = {reportfound_styles.cell}
						region= {this.state.region}
						onPress = {e => this.setMarker(e)}
						onRegionChangeComplete={this.onRegionChange.bind(this)}>
						{this.state.thisMarker.map(marker=> (<Marker draggable {...marker}/>))}
					</MapView>
				</View>
				<View>
					<TouchableHighlight style={reportfound_styles.submitButton} onPress={this._handleClick.bind(this)}>
						<Button color={'#000'} title="SUBMIT"/>
					</TouchableHighlight>
				</View>
		  </View>
		);
	}
}

export default ReportFoundView;