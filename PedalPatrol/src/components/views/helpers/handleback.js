import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { BackHandler } from "react-native";

/**
 * Class to handle the back button on Android
 * @extends Component
 */
class HandleBack extends Component {
	/**
	 * Creates an instance of the HandleBack component.
	 * @constructor
	 */
	constructor(props) {
		super(props);
			this.didFocus = props.navigation.addListener("didFocus", payload =>
				BackHandler.addEventListener("hardwareBackPress", this.onBack),
			);
		}

	/**
	 * Component mounted.
	 */
	componentDidMount() {
		this.willBlur = this.props.navigation.addListener("willBlur", payload =>
			BackHandler.removeEventListener("hardwareBackPress", this.onBack),
		);
	}

	/**
	 * Trigger the onBack function.
	 */
	onBack = () => {
		return this.props.onBack();
	};

	/**
	 * Component is about to unmount.
	 */
	componentWillUnmount() {
		this.didFocus.remove();
		this.willBlur.remove();
		BackHandler.removeEventListener("hardwareBackPress", this.onBack);
	}

	render() {
		return this.props.children;
	}
}

export default withNavigation(HandleBack);