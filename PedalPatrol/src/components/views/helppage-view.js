import * as React from 'react';
import { List, Checkbox} from 'react-native-paper';
import {Linking} from 'react-native';
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

<PaperProvider theme={theme}>

      <List.Section title="Pedal Patrol Help Center">

        <List.Accordion
          title="Using Pedal Patrol"
          description="How to use Pedal Patrol features">

          <List.Accordion title="Uploading your bike" left={props => <List.Icon {...props} icon="addfile"/> }>
          <List.Item title="stub"/>
          </List.Accordion>

          <List.Accordion title="Reporting your bike stolen" left={props => <List.Icon {...props} icon="report" />}>
          <List.Item title="stub"/>
          </List.Accordion>

          <List.Accordion title="Reporting a found bike"left={props => <List.Icon {...props} icon="message-text" />}>
          <List.Item title="stub"/>
          </List.Accordion>

          
          <List.Item
          title="User manual" 
          onPress={() => {
            this._handleLinkClick('LINK TO USER MANUAL')
         }}/>

        </List.Accordion>


        <List.Accordion
          title="Managing your account"
          //left={props => <List.Icon {...props} icon="folder" />}
        >
          <List.Item title="Login and password" />
          <List.Item title="Username, email and phone" />
          <List.Item title="Notifications" />
        </List.Accordion>

        <List.Accordion
          title="Privacy Policy"
          
          //left={props => <List.Icon {...props} icon="folder" />}
        >

        </List.Accordion>

        <List.Accordion
          title="Contact Us"
          //left={props => <List.Icon {...props} icon="folder" />}
        >
        <List.Item
          title="Report a problem" onPress={() => {
            this._handleLinkClick('mailto:pedalpatrolapp@gmail.com?subject=Problem with Pedal Patrol')
         }}/>
        </List.Accordion>

      </List.Section>


      </PaperProvider>
  );
  }

}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
    background: '#34bb83',
    backdrop:'#455555'
  }
};

export default HelpView;