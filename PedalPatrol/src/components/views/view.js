import React, { Component } from 'react';

class BaseView extends Component {
	setup(props) {
		throw new Error('Method must be implemented');
	};

	render() {
		throw new Error('Method must be implemented!');
	};

	componentWillMount = () => {
		throw new Error('Method must be implemented');
	}

	componentWillUnmount = () => {
		throw new Error('Method must be implemented');
	}
}

export default BaseView;