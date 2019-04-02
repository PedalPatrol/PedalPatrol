import * as React from 'react';
import { List, Checkbox, Text} from 'react-native-paper';
import {View, Linking, StyleSheet, Image, ScrollView, TouchableOpactiy} from 'react-native';
import {Icon} from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation';

import {styles, colours, help_styles } from './stylesheets/help-styles';

import BaseView from './view';

/**
 * Class for the help view to display any help information for the user such as the user manual, privacy policy, and contact information.
 */
class HelpView extends BaseView {
	state = {
		expanded: true
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
			title: navigation.getParam('title', 'Help') // Default title is Alerts
		};
	}
	
	/**
	 * Triggers when a component or this component is mounted.
	 */
	componentWillMount = () => {
		// There's a problem with clicking the back button too quickly so need to find a better place to put this
		this.props.navigation.setParams({
			_onBack: this._onBack
		});
	};

	/**
	 * When the back button is clicked, check if the user was editing.
	 */
	_onBack = () => {
		this.props.navigation.navigate('Tabs');
	}
	
	
	/**
	 * Handle the user clicking a link.
	 *
	 * @param {string} url - The link to click 
	 */
	_handleLinkClick = (url) => {
		Linking.openURL(url);
	};

	/**
	 * Renders text in a react-native text component.
	 *
	 * @param {string} text - The text to render
	 * @return {Component} A react native component
	 */
	renderText(text){
		return(
			<Text> 
				{text} 
			</Text>
		)
	}

	/**
	 * Renders text in a react-native text component with an item style.
	 *
	 * @param {string} text - The text to render
	 * @return {Component} A react native component
	 */
	renderItemText(text){
		return(<Text style={help_styles.itemStyle} numberOfLines={10}> 
			{text} 
		</Text>)
	}

	/**
	 * Render an icon with a specific name and type.
	 * 
	 * @param {string} iconName - The name of the icon to be rendered
	 * @param {string} iconType - The library to get the icon from
	 * @return {Component} A react native component
	 */
	renderIcon(iconName,iconType){
		return(
			<View style={{width:50}}>
				<Icon name={iconName} type={iconType} size={20} color={'#34bb83'}/>
			</View>
			)
	}

	/**
	 * Renders text as a link.
	 *
	 * @param {string} text - The text to render
	 * @return {Component} A react native component
	 */
	renderLink = (text) => (
		<Text style={{color: 'blue'}}>{text}</Text>
	)

	/**
	 * Renders the component.
	 */
	render() {
		return ( 


<ScrollView>

      <List.Section>

        <List.Accordion
          title="Main Pages"
        >
            <List.Accordion  title={this.renderText("Lost Bikes")} left={props => this.renderIcon("home","entypo")} >
              {this.renderItemText("A feed of bikes that have been reported as stolen with the most recent appearing at the top. Click the bike card for more details. Search bikes by model and pin bike reports you’re interested to the top of your feed.")}
            </List.Accordion>

            <List.Accordion  title={this.renderText("Map")} left={props => this.renderIcon("md-map","ionicon")} >
              {this.renderItemText("A map to show the location of reported bike thefts marked as a pin. Click the pins to see quick summaries of the bikes, and click the summaries for more details. Change your notification radius, search by location, filter bikes based on time, report your own stolen bikes.")}
            </List.Accordion>

            <List.Accordion  title={this.renderText("My Bikes")} left={props => this.renderIcon("md-bicycle","ionicon")} >
              {this.renderItemText("A page to keep track of all of your registered bikes. This information will be available to users if it is reported stolen, and will be necessary for them to identify your unique bike. Click the plus button to add more bikes, or delete them at the bottom of its bike details page.")}
            </List.Accordion>

        </List.Accordion>



        <List.Accordion
          title="Key Features"
        >
            <List.Accordion  title={this.renderText("Register a bike")} left={props => this.renderIcon("add","MaterialIcons")} >
              {this.renderItemText("My Bikes page\nClick the plus button\nAdd Bike Photos and Details\nClick Save")}
            </List.Accordion>

            <List.Accordion  title={this.renderText("Create a lost bike report")} left={props => this.renderIcon("pin-drop","MaterialIcons")}>
              {this.renderItemText("Map page\nClick the Pin button\nPlace pin on map\nClick check mark\nSelect a registered bike from the dropdown menu\nWrite a report description\nClick submit")}
            </List.Accordion>

            <List.Accordion  title={this.renderText("Message owners of found bikes")} left={props => this.renderIcon("comment","MaterialIcons")}>
            {this.renderItemText("Lost Bikes\nClick the message button the bottom right of the appropriate bike card\nWrite a description about how the bike was found\nSelect the location on the map in which the bike was found\nClick Submit")}
            </List.Accordion>

            <List.Accordion  title={this.renderText("Set notification radius")} left={props => this.renderIcon("circle-o-notch","font-awesome")}>
            {this.renderItemText("Map page\nClick the circle icon\nPress and hold to place radius circle in desired area\nResize radius with plus and minus buttons\nClick the checkmark to save")}
            </List.Accordion>

        </List.Accordion>

				<List.Item
					title={this.renderLink("Privacy Policy")}
					expanded={false}
					onPress={() => {this.props.navigation.navigate('PrivacyPolicy')}}>
				</List.Item>

				<List.Accordion
					title="Contact Us" >

					<Text 
						style={help_styles.itemStyle}
						onPress={() => {this._handleLinkClick('mailto:pedalpatrolapp@gmail.com?subject=Problem with Pedal Patrol')}}> 
						Report a problem
					</Text>
				</List.Accordion>

			</List.Section>

			</ScrollView>
	);
	}
}

export default HelpView;