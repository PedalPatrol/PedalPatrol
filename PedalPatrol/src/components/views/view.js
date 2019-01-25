import React, { Component } from 'react';

class BaseView extends Component {
	/**
	 * Set up the view.
	 *
	 * @param {Object} props - The component's properties
	 */
	setup(props) {
		throw new Error('Method must be implemented');
	};

	/**
	 * Render objects to the screen.
	 */
	render() {
		throw new Error('Method must be implemented!');
	};

	/**
	 * Triggers when a component or this component is mounted.
	 */
	componentWillMount = () => {
		throw new Error('Method must be implemented');
	}

	/**
	 * Triggers when a component or this component is unmounted.
	 */
	componentWillUnmount = () => {
		throw new Error('Method must be implemented');
	}
}

export default BaseView;