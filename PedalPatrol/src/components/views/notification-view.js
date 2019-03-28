import SettingsList from 'react-native-settings-list';
import React, {Component} from 'react';
import { View, Text, TextInput, PixelRatio, Alert, Picker } from 'react-native';

import { styles, text, colours, notifications_styles } from './stylesheets/notifications-styles';

/**
 * Class for the Notification view
 * @extends BasePresenter
 */
class NotificationView extends Component {
	constructor() {
		super();
		this.onValueChange = this.onValueChange.bind(this);
		this.state = { switchValue: true, num:0 };
	}

	/**
	 * Updates the num in the state.
	 *
	 * @param {Number} num - A number
	 */
	updateNum = (num) => {
		this.setState({ num: num })
	}

	/**
	 * Render the element if condition is satisfied
	 * @param {Boolean} condition - judge if condition is satisfied
	 * @param {Boolean} element - element will be rendered.
	 */
	renderIf(condition,element){
		return condition ? element : null;
	}

	/**
	 * toggle the status of item
	 * @ param {Boolean} value - status of the item
	 */
	onValueChange(value) {
		this.setState({switchValue: value});
		console.log('frequency is ' + this.state.value1 + 'index is' + this.state.index1)
	}

	render() {
		return (
			<View style={styles.container}>
				<SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
					<SettingsList.Item
						hasNavArrow={false}
						title='Status'
						titleStyle={notifications_styles.status}
						itemWidth={50}
						borderHide={'Both'}/>
					<SettingsList.Item
						hasSwitch={true}
						switchState={this.state.switchValue}
						switchOnValueChange={this.onValueChange}
						hasNavArrow={false}
						title='Notifications On'/>

				{this.renderIf(this.state.switchValue,
					(
						<SettingsList.Item
							hasNavArrow={false}
							title='Distance'
							titleInfo = '1km'/>

					)
				)}
				</SettingsList>
			</View>
		);
	}
}

export default NotificationView;