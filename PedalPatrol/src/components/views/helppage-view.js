import * as React from 'react';
import { List, Checkbox} from 'react-native-paper';
import {Linking, StyleSheet, Image, ScrollView} from 'react-native';
import BaseView from './view';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
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

  render() {
    return ( 


<ScrollView>

<PaperProvider theme={theme}>

      <List.Section title="Pedal Patrol Help Center">

        <List.Accordion
          title="Using Pedal Patrol"
          description="How to use Pedal Patrol features">

          <List.Accordion title="Uploading your bike" left={props => <List.Icon {...props} icon=""/>} >

          <List.Item title="stub" style={styles.ppGrey}>
            <Image
            style={{width: 50, height: 50}}
            source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
          />
          </List.Item>

          </List.Accordion>

          <List.Accordion title="Reporting your bike stolen"  left={props => <List.Icon {...props} icon="" />} >
          <List.Item title="stub" style={styles.ppGrey}/>
          </List.Accordion>

          <List.Accordion title="Reporting a found bike" left={props => <List.Icon {...props} icon="" />} >
          <List.Item title="stub" style={styles.ppGrey}/>
          </List.Accordion>

          
          <List.Item
          title="User manual" 
          style={{backgroundColor:'E6ECF0'}} left={props => <List.Icon {...props} icon="" />} 
          onPress={() => {
            this._handleLinkClick('LINK TO USER MANUAL')
         }}/>

        </List.Accordion>


        <List.Accordion
          title="Managing your account"
        >
            <List.Accordion title="Login and Password" left={props => <List.Icon {...props} icon=""/>} >

              <Image
              style={{width: 50, height: 50}}
              source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
              />

            </List.Accordion>

            <List.Accordion title="Username, email and phone" left={props => <List.Icon {...props} icon="" />} >
              <List.Item title="stub" style={styles.ppGrey}/>
            </List.Accordion>

            <List.Accordion title="Notifications" left={props => <List.Icon {...props} icon="" />} >
              <List.Item title="stub" style={styles.ppGrey}/> 
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
          title="Contact Us" 
        >
        <List.Item
          title="Report a problem" style={styles.ppGrey}
          onPress={() => {
            this._handleLinkClick('mailto:pedalpatrolapp@gmail.com?subject=Problem with Pedal Patrol')
         }}/>
        </List.Accordion>

      </List.Section>

      </PaperProvider>

      </ScrollView>

  );
  }
}


const theme = {
  ...DefaultTheme,
  roundness: 2,

  colors: {
    primary: '#34bb83',
    accent: '#ff0000'
  },

  font:{
    fontWeight: 'thin'
  }
};

const styles = StyleSheet.create({

  ppGrey: {
    backgroundColor: '#F7F7F7',
  },

});


export default HelpView;