import React, {Component} from 'react';
import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';

import { createRootNavigator } from './config/navigation';
import NavigatorService from './config/navigationservice';
import SideDrawer from './components/views/helpers/sidedrawer';


export default class App extends Component {
	render() {
		const Navigator = createAppContainer(createRootNavigator());
		return <SideDrawer renderMainContent={() => {
			return (
				<Navigator 
					ref={(navigatorRef) => {
						NavigatorService.setTopLevelNavigator(navigatorRef);
					}} 
				/>
			)}
		}/>
	}
}
