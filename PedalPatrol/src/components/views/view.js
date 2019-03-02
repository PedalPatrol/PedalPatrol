import React, { Component } from 'react';

/**
 * Base class for all the views
 * @extends React.Component
 */
class BaseView extends Component {
	/**
	 * Render objects to the screen.
	 */
	render() {
		throw new Error('Method must be implemented!');
	}


	/**
	 * Refreshes the state of the presenter.
	 */
	refreshState = () => {
		throw new Error('Method must be implemented');
	}


	/**
	 * Component will unmount after this method is called, do any clean up here.
	 *
	 * @param {Class} A presenter class instance
	 */
	viewUnmounting = (presenter) => {
		presenter.onDestroy();
	}
}

export default BaseView;