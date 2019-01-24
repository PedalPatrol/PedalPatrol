// https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate

export default class BasePresenter {

	constructor() {
		this.state = {}
	}

	onChange = (view) => {
		view.setState(view.state) // dumb easy: triggers render
	};


	/**
	 * Sends an update to the model with new data.
	 *
	 * @param {Object} newData - New data to update the model with
	 */
	update = (newData) => {
		throw new Error("Method must be implemented");
	};


	/**
	 * This method is called when the model's data has changed and the observers are being notified.
	 *
	 * @param {Object} newData - New data to update the model with
	 */
	onUpdated = (newData) => {
		// Do something with the new data or let the view auto update?
		throw new Error("Method must be implemented");
	};


	/**
	 * Gets the data from the model.
	 */
	getData = () => {
		throw new Error("Method must be implemented");
	};
}
