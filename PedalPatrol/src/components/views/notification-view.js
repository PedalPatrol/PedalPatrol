import SettingsList from 'react-native-settings-list';
import React, {Component} from 'react';
import { View, Text, TextInput, StyleSheet, PixelRatio, Alert, Picker } from 'react-native';


/**
 * Class for the Notification view
 * @extends BasePresenter
 */
class NotificationView extends Component {
	constructor(){
		super();
		this.onValueChange = this.onValueChange.bind(this);
		this.state = {switchValue: true, num:0 };
	}

	updateNum = (num) => {
		this.setState({ num: num })
	}

	/**
	 * Render the element if condition is satisfied
	 * @param {Boolean} condition - judge if condition is satisfied
	 * @param {Boolean} element - element will be rendered.
	 */
	renderIf(condition,element){
		if(condition) {
			return element;
		} else {
			return null;
		}
	}

	/**
	 * toggle the status of item
	 * @ param {Boolean} value - status of the item
	 */
	onValueChange(value) {
		this.setState({switchValue: value});
		console.log('frequency is ' + this.state.value1 + 'index is' + this .state.index1)
	}

	render() {
		var bgColor = '#DCE3F4';

		return (
			<View>
				<SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
					<SettingsList.Item
						hasNavArrow={false}
						title='Status'
						titleStyle={{color:'#009688', marginBottom:10, fontWeight:'500'}}
						itemWidth={50}
						borderHide={'Both'}/>
					<SettingsList.Item
						hasSwitch={true}
						switchState={this.state.switchValue}
						switchOnValueChange={this.onValueChange}
						hasNavArrow={false}
						title='Notifications On'/>

				{this.renderIf ((this.state.switchValue),
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
