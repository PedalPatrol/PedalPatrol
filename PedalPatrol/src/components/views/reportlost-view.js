import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, ScrollView, Alert } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { TextInput } from 'react-native-paper';
import { HeaderBackButton } from 'react-navigation';

import LoginButton from './helpers/loginbutton';
import ReportLostPresenter from '../presenters/reportlost-presenter';
import BaseView from './view';

/**
 * Class for the reportlost view
 * @extends BaseView
 */
class ReportLostView extends BaseView {
	/**
	 * Creates an instance of the report lost view
	 *
	 * @constructor
	 * @param {Object} props - Component properties
	 */
	constructor(props) {
		super(props);
		this.reportlostP = new ReportLostPresenter(this);
		this.state = {
			text: '',
			bikeid: '',
			bikeMenu: [],
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
	 * Component is about to mount, initialize the data before rendering.
	 */
	componentWillMount = () => {
		this.props.navigation.setParams({
			_onBack: this._onBack,
		});

		this.setState({
			bikeMenu: this.reportlostP.getData()
		});
		const { navigation } = this.props;
		const data = navigation.getParam('data', 'NO-DATA');
		if (data && data !== "NO-DATA") { 
			const latitude = data.data.latitude ? data.data.latitude : 'NO-DATA';
			const longitude = data.data.longitude ? data.data.longitude : 'NO-DATA';

			this.setState({
				latitude: latitude,
				longitude: longitude
			});
		}
	};

	componentWillUnmount = () => {
		this.viewUnmounting(this.reportlostP);
	}

	_onBack = () => {
		this.props.navigation.navigate('Bike');
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
	 * handle the event after clicking submit.
	 */
	_handleClick() {
		// console.log('bikeid is'+ this.state.bikeid);
		if (this.state.bikeid=='') {
			Alert.alert("Please select the bike!")
		} else {
			this.sendUpdate();
		}
	}


	/**
	 * Get needed data from the view and send it to presenter.
	 */
	sendUpdate = () => {
		// Extract data from components
		let new_data = {
			data:	{
				text:this.state.text,
				bikeid: this.state.bikeid,
				latitude: this.state.latitude,
				longitude: this.state.longitude,
			}
		}
		const data = new_data;

		this.reportlostP.update(data,this.alertCallback);
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
					{ text: "Ok", onPress: () => this.props.navigation.navigate('Tabs'), style: "ok" },
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
				<View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white'}]}>
					<Text style={[styles.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
						{`${rowData.name} `}
					</Text>
				</View>
			</TouchableHighlight>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.row1}>
					<View style={styles.cell}>
						<ModalDropdown ref="dropdown_2"
							style={styles.dropdown_2}
							textStyle={styles.dropdown_2_text}
							dropdownStyle={styles.dropdown_2_dropdown}
							options={this.state.bikeMenu}
							defaultValue = "Please select your bike"
							renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
							renderRow={this._dropdown_2_renderRow.bind(this)}
							onSelect={(idx,value) => this._dropdown_2_onSelect(idx,value)}/>
					</View>
				</View>
				<TextInput style = {styles.row2}
					label = "Describe the Condition"
					placeholder = "Add Descriptions"
					multiline={true}
					blurOnSubmit
					onChangeText={(text) => this.setState({text})}>
				</TextInput>
				<View>
					<LoginButton text="SUBMIT" onPress={this._handleClick.bind(this)}/>
				</View>
			</View>
		);
	}

}

export default ReportLostView;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	row1: {
		flex: 2,
	},
	row2: {
		flex: 5,
	},
	cell: {
		flex: 1,
		borderWidth: StyleSheet.hairlineWidth,
	},
	textButton: {
		color: 'deepskyblue',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'deepskyblue',
		margin: 2,
	},
	dropdown_2: {
		alignSelf: 'center',
		width: 300,
		marginTop: 32,
		borderWidth: 0,
		borderRadius: 3,
		backgroundColor: 'cornflowerblue',
	},
	dropdown_2_text: {
		marginVertical: 10,
		marginHorizontal: 6,
		fontSize: 18,
		color: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	dropdown_2_dropdown: {
		width: 300,
		height: 300,
		borderColor: 'cornflowerblue',
		borderWidth: 2,
		borderRadius: 3,
	},
	dropdown_2_row: {
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
	},
	dropdown_2_row_text: {
		marginHorizontal: 4,
		fontSize: 16,
		color: 'navy',
		textAlignVertical: 'center',
	},
});