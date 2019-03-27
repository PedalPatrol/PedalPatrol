import * as React from 'react';
import { List, Checkbox, Linking } from 'react-native-paper';
import BaseView from './view';

class HelpView extends BaseView {
  state = {
    expanded: true
  }

    _handlePress = () =>
    this.setState({
      expanded: !this.state.expanded
    });
    
    /*
    _handleLinkClick = () => {
      //on clicking we are going to open the URL using Linking
      Linking.openURL('http://aboutreact.com')
    };
    */

   /*onPress={() => {
    //on clicking we are going to open the URL using Linking
    Linking.openURL('http://aboutreact.com');
  }}*/

  render() {
    return (
      <List.Section title="Pedal Patrol Help Center">

        <List.Accordion
          title="Using Pedal Patrol"
          //left={props => <List.Icon {...props} icon="folder" />}
        >
          <List.Item title="Uploading your bike" />
          <List.Item title="Reporting your bike stolen" />
          <List.Item title="Reporting a found bike" />
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
          <List.Item title="First item" />
          <List.Item title="Second item" />
        </List.Accordion>

        <List.Accordion
          title="Contact Us"
          //left={props => <List.Icon {...props} icon="folder" />}
        >
        <List.Item
          title="Send us an email">
          onPress={() => {
            //stub
          }}
        </List.Item>
        </List.Accordion>

      </List.Section>
    );
  }
}

export default HelpView;