import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, TouchableOpacity, Dimensions, NativeModules, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import {default as RNMapView} from 'react-native-maps';
import { Marker, Callout, Polygon, Circle } from 'react-native-maps';

import { styles, colours, map_styles } from './stylesheets/map-styles';

import MapPresenter from '../presenters/map-presenter';
import BaseView from './view';
import TimeUtil from '../../util/timeutility';

const {StatusBarManager} = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

/**
 * Class for the Map view
 * @extends BaseView
 */
class MapView extends BaseView {

	/**
	* Create an instance of LoginView
	*
	* @constructor
	* @param {Object} props - Component properties
	*/
	constructor(props){
	   super(props);
	   this.MapP = new MapPresenter(this);
	   this.resetState();
	}

	/**
	 * Resets the state with default variables
	 */
	resetState = () => {
		this.state = {
			refresh: true,
			circleRadius : 500,
			x: {
				latitude: 44.257424,
				longitude: -76.5231,
			},
			region: {
				latitude: 44.237424,
				longitude: -76.5131,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			},
			showCircle: false,
			showMarker: false,
			showButton: false,
			markerCreated:[],
			markers: [],
			markerRefs: {},
			tempMarkers: [],
			tempMarkerRefs: [],
			foundMarker: null,
			foundCalloutOpened: false
		};
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
	 * Triggers when the component is mounted.
	 */
	componentDidMount = () => {
		this._setUserLocation();
		this.MapP.forceRequestData();
		
		this.setState({
			markers : this.MapP.getData()
		});		
	};

	/**
	 * Component will receive new properties via the props attribute
	 */
	componentWillReceiveProps = () => {
		const { navigation } = this.props;
		const data = navigation.getParam('data', 'NO-DATA');
		const found = navigation.getParam('found', false);
		
		if (found) {
			const foundMarker = this._createNewMarker(data);
			this.setState({foundCalloutOpened: true});
			this.state.tempMarkers = [foundMarker]; // We just overwrite because best to only keep track of one
		} else if (data !== 'NO-DATA') {
			// Only set the location if the marker wasn't clicked from the Alerts page
			this._setLocationToMarkerItem(this.state.markerRefs, data, true);
		}
	}

	/**
	 * Component is about to unmount, do any cleanup here.
	 * Call viewUnmounting in base class so it can do any cleanup for the view before calling the presenter destroy method
	 */ 
	componentWillUnmount = () => {
		this.viewUnmounting(this.MapP);
	}

	/**
	 * Component's state has updated
	 */
	componentDidUpdate = () => {
		if (this.state.tempMarkers.length !== 0 && this.state.foundCalloutOpened) {
			this.setState({foundCalloutOpened: false})
			this._setLocationToMarkerItem(this.state.tempMarkerRefs, this.state.tempMarkers[0].data, true);
		}
	}

	/**
	 * Creates a new marker from the data.
	 *
	 * @param {Object} data - The data from the marker to be created
	 * @return {Object} A new marker object with data, key and coordinate properties
	 */
	_createNewMarker = (data) => {
		const newMarker = {
				data: data,
				key: data.id,
				coordinate: {
					latitude: data.latitude,
					longitude: data.longitude,
				}
		}

		return newMarker;
	}

	/**
	 * Sets the location of the map to the marker's position and open its callout.
	 *
	 * @param {List} refs - A list of marker references
	 * @param {Object} item - The marker's data
	 * @param {Boolean} shouldReshowCallout - If the callout should be triggered twice on a delay. default=false
	 */
	_setLocationToMarkerItem = (refs, item, shouldReshowCallout=false) => {
		if (item.hasOwnProperty('longitude') && item.hasOwnProperty('latitude')) {
			const location = {
				latitude: item.latitude,
				longitude: item.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			};
			this.onRegionChange(location);
			refs[item.id].showCallout();

			// Sometimes the callouts don't popup immediately so we have to call it again after 50 milliseconds
			if (shouldReshowCallout) {
				setTimeout(() => {refs[item.id].showCallout();}, 50);
			}
		}
	}

	/**
	 * Sets the user's location to their current location.
	 */
	_setUserLocation = () => {
		this.MapP.getUserLocation().then(position => {
			if (position) {
				const location = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				};
				this.setState({
					x: location,
					user: location,
					region: location
				});
			}
		});
	}

	/**
	 * Render "save/delete" button after clicking "create lost report" button
	 */
	renderSDButton(){
		if (this.state.showButton){
			return(
			<View style={map_styles.saveDeleteButton}>
				<View style={map_styles.Buttons}>
				<Button
					onPress={()=>{this.sendNewMarker()}}
					title="save"/></View>
				   <View style={map_styles.Buttons}>
				<Button
					onPress={()=>{
						this.deleteItem()
					}}
					title="delete"/></View>
			</View>
			)
		}
	}

	/**
	 *  Save data of created marker or circle after clicking save button
	 */
	saveItem(){
		if (this.state.showCircle){
			this.saveCircle();
		}
		if (this.state.showMarker){
			this.sendNewMarker();
		}
	}

	/**
	 * Delete created marker or circle after clicking delete button
	 */
	deleteItem(){
		this.setState()
		if (this.state.showCircle){
			this.setState({x:{latitude: 44.257424,longitude: -76.5231, },
							circleRadius: 500, showCircle:false,showButton:false,
												   })
		}
		if (this.state.showMarker){
			this.setState({showButton:false,showMarker:false,markerCreated:[]})
		}

	}

	/**
	 * Render buttons that can adjust circle's radius
	 */
	renderForCircle(){
		if (this.state.showCircle){
			return(
			<View style={map_styles.circleRadiusButton}>
				<View style={map_styles.Buttons}>
				<Button
					onPress={()=>{this.setState({circleRadius: this.state.circleRadius+200})}}
					title="more"/></View>
				   <View style={map_styles.Buttons}>
				<Button
					onPress={()=>{if (this.state.circleRadius>200){this.setState({circleRadius: this.state.circleRadius-200})}}}
					title="less"/></View>
			</View>
			)
		}
	}

	/**
	 * Render a circle to set notification receiving area
	 */
	renderCircle(){
		if (this.state.showCircle){
			return (
				<Circle
					center = {{latitude:this.state.x.latitude,longitude:this.state.x.longitude}}
					radius = {this.state.circleRadius}
					strokeColor = "#4F6D7A"
					strokeWidth = { 2 }
					fillColor = 'rgba(200,0,0,0.5)'/>
			)
		}
	}

	/**
	 * Save data of circle to notification settings
	 */
	saveCircle(){
		//nothing
		newData = {
			data: {
				circleLatitude: this.state.x.latitude,
				circleLongitude: this.state.x.longitude,
				radius: this.state.circleRadius,
			}
		}
		// console.log(newData);
	}

	/**
	 * Save data of created marker to report lost page
	 */
	sendNewMarker() {
		newData={
			data:
				{
					latitude: this.state.markerCreated[0].coordinate.latitude,
					longitude: this.state.markerCreated[0].coordinate.longitude,
				}
		}
		this.navigate('ReportLost', newData);
	}

	/**
	 *  Long press the map to change the coordinate of circle
	 *
	 * @param {Event} The event of long press on the map
	 */
	setCircleLat(e) {
		let cor = e.nativeEvent.coordinate;
		if (this.state.showCircle){
			this.setState({
				x: {
					latitude: cor.latitude,
					longitude: cor.longitude,
				}

			})
		}
	}

	/**
	 * handle click event after clicking "create marker" button
	 */
	_onPressButton=()=> {
		this.setState({
			showButton: true,
			showMarker: true,
			showCircle: false,
			markerCreated:  [this.newMarker(this.state.region.latitude,this.state.region.longitude)],
		});
	  }

	/**
	 * helper function of _onPressButton
	 *
	 * @param {Integer} latitude and longitude of a marker
	 */
	newMarker = (lat,long) => {
		const key = this.state.markers.length-1
		return({key, coordinate: {latitude: lat,longitude: long}});
	};

	/**
	 *  Change region state as moving the map
	 *
	 * @param {region} A presenter class instance
	 */
	onRegionChange = (region) => {
	  this.setState({region: region });
	};

	_getColourString = (colours) => {
		let colourString = '';
		if (colours != null && colours != undefined) {
			colourString = 'Colour';
			colourString = colourString + ((colours.length > 1) ? "s: " : ": ") + colours.join(', ');
		}
		return colourString
	}

	_renderCallout = (item) => (
		<Callout onPress={() => {this.navigate('BikeDetails', item.data)}}>
			<ScrollView>
				<ScrollView horizontal>
					<View style={map_styles.calloutColumn}>
						<View style={map_styles.calloutRow}>
							<Text style={map_styles.modelText} numberOfLines={1} ellipsizeMode ={'tail'}>
								{item.data.model == undefined || item.data.model === '' ? 'Model Unknown' : item.data.model}
							</Text>
							<Text numberOfLines={1} ellipsizeMode ={'tail'}>
							{'   '}
							</Text>
							<View style={map_styles.timeago}>
								<Text style={[map_styles.mapText, map_styles.timeagoText]} numberOfLines={1} ellipsizeMode ={'tail'}>
									{item.data.timeago}
								</Text>
							</View>
						</View>
						{
							item.data.brand != undefined && item.data.brand !== '' && 
							<Text style={map_styles.mapText}>
								{item.data.brand != '' ? "Brand: " + item.data.brand : ''}
							</Text>
						}
						{
							item.data.colour != undefined && item.data.colour.length !== 0 &&
							<Text style={map_styles.mapText}>
								{this._getColourString(item.data.colour)}
							</Text>
						}
					</View>
				</ScrollView>
			</ScrollView>
		</Callout>
	);

	/**
	 * Navigate to a page with a title.
	 * This method is used over the commented out line below because successive touches of a bike item
	 * would not add the data because data is only received in process in the componentWillMount function.
	 * So adding the 'key' property to navigate makes it see that the new page is unique.
	 *
	 * @param {string} screen - The route to navigate to. See navigation.js stacks and screens
	 */
	navigate = (screen, data) => {
		this.props.navigation.navigate({
			routeName: screen,
			params: {
				data: data,
				from: 'Map'
			},
			key: screen + TimeUtil.getDateTime()
		});
	}

	/**
	 * Extract data from the component's view and send an update to the presenter to do any logic before sending it to the model
	 */
	render() {
		const { height: windowHeight } = Dimensions.get('window');
		const varTop = windowHeight - 125;
		const hitSlop = {
			top: 15,
			bottom: 15,
			left: 15,
			right: 15,
		}
		let bbStyle = (vheight) => {
			let style = {
				position: 'absolute',
				top: vheight-20,
				left: 10,
				right: 10,
				backgroundColor: 'transparent',
				alignItems: 'flex-end',
			};
			return style;
		}
		

		return (
				<View style={{ flex: 1 }}>
					<View style={bbStyle(varTop)}>
						<TouchableOpacity
							hitSlop = {hitSlop}
							style={map_styles.mapButton}
							onPress={ () => this._setUserLocation() }>
					 		<Icon name="location-arrow" type="font-awesome" size={20} color={"#4285F4"} />
						</TouchableOpacity>
					</View>

		 			<RNMapView style ={{flex:1}}
						region={this.state.region}
						style={map_styles.map}
						showsUserLocation={true}
						showsMyLocationButton={true}
						rotateEnabled={true}
						onRegionChangeComplete={this.onRegionChange.bind(this)}
						onLongPress = {e => this.setCircleLat(e)}>
					  	{this.state.markers.map(marker => (
							<Marker 
								{...marker} 
								ref={(ref) => this.state.markerRefs[marker.key] = ref}
								pinColor={marker.data.stolen ? colours.ppPinRed : colours.ppPinGreen}>
								{this._renderCallout(marker)}
							</Marker>
						))}
						{this.state.tempMarkers.map(marker => (
							<Marker 
								{...marker} 
								ref={(ref) => this.state.tempMarkerRefs[marker.key] = ref}
								pinColor={marker.data.stolen ? colours.ppPinRed : colours.ppPinGreen}>
								{this._renderCallout(marker)}
							</Marker>
						))}
						{this.state.markerCreated.map(marker => (<Marker draggable{...marker} />))}
						{this.renderCircle(this)}
					</RNMapView>
					
					<View style={map_styles.reportButton}>
						<Button onPress={this._onPressButton}
							title="create lost report"/>
						<Button onPress={()=>{this.setState({showCircle: true,showButton:true,showMarker:false,markerCreated:[]})}}
							title="create receiving area"/>
					</View>

					{this.renderSDButton(this)}
					{this.renderForCircle(this)}
				</View>
		);
	}
}

export default MapView;