import * as React from 'react';
import { List, Checkbox, Text} from 'react-native-paper';
import {View, Linking, StyleSheet, Image, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import BaseView from './view';
import { HeaderBackButton } from 'react-navigation';


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
  
  _handleLinkClick = (url) => {
    Linking.openURL(url);
  };

  renderText(text){
    return(<Text> 
      {text} 
    </Text>)
  }

  renderItemText(text){
    return(<Text style={styles.itemStyle} numberOfLines={10}> 
      {text} 
    </Text>)
  }

  renderIcon(iconName,iconType){
    return(
      <View style={{width:50}}>
        <Icon name={iconName} type={iconType} size={20} color={'#34bb83'}/>
      </View>
      )
  }

  render() {
    return ( 


<ScrollView>

      <List.Section>

        <List.Accordion
          title="Main Pages"
        >
            <List.Accordion  title={this.renderText("Lost Bikes")} left={props => this.renderIcon("home","entypo")} >
              <List.Item titleStyle={{color:'red'}}  title="stub" style={styles.ppGrey}/>
            </List.Accordion>

            <List.Accordion  title={this.renderText("Map")} left={props => this.renderIcon("md-map","ionicon")} >
              <List.Item title="stub" style={styles.ppGrey}/>
            </List.Accordion>

            <List.Accordion  title={this.renderText("My Bikes")} left={props => this.renderIcon("md-bicycle","ionicon")} >
              <List.Item title="stub" style={styles.ppGrey}/>
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


        <List.Accordion
          title="Privacy Policy" 
        >
        <List.Item
          title="Report a problem" style={styles.ppGrey}
          onPress={() => {
            this._handleLinkClick('google.ca')
         }}/>
        </List.Accordion>



        <List.Accordion
          title="Contact Us" >

        <Text 
        style={styles.itemStyle}
        onPress={() => {this._handleLinkClick('mailto:pedalpatrolapp@gmail.com?subject=Problem with Pedal Patrol')}}> 

        Report a problem
            
        </Text>

        </List.Accordion>

      </List.Section>

      </ScrollView>
  );
  }
}

const styles = StyleSheet.create({

  ppGrey: {
    backgroundColor: '#F7F7F7',
  },
  itemStyle:{
    fontSize: 14,
    flexWrap:"wrap",
    backgroundColor: '#F7F7F7',
    padding: 5
  }

});


export default HelpView;