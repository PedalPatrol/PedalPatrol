import {Subject} from 'rxjs';

/**
 * Base class for all models
 */
class Model {
	/**
	 * @deprecated
	 * Use _createEventStream instead. This function is only used because currently all classes call it
	 */
	_createObserverList() {
		this._createEventStream();
	}

	/**
	 * Creates an event stream (Subject/Observable) for presenters to subscribe to.
	 */
	_createEventStream() {
		this.eventStream = new Subject();
		this.observers = [];
	}

	/**
	 * Subscribes to the event stream.
	 *
	 * @param {Class} observer - A class that will observe the event stream. Must implement onUpdated
	 */
	subscribe(observer) {
		if (this.eventStream != null && this.eventStream != undefined) {
			const subscription = this.eventStream.subscribe(
				observer.onUpdated,
				(error) => {console.log(error)},
				() => {console.log('Completed')}
			);

			const newObserver = {observer, subscription};
			this.observers.push(newObserver);
		}
	}

	/**
	 * Unsubscribe from the event stream.
	 *
	 * @param {Class} observer - A class that is subscribed to be unsubscribed.
	 */
	unsubscribe(observer) {
		let newObservers = [];
		for (let i=0; i < this.observers.length; i++) {
			if (this.observers[i].observer == observer) {
				const {subscription} = this.observers[i];
				subscription.unsubscribe();
			} else {
				newObservers.push(this.observers[i]);
			}
		}
		this.observers = this._deepCopy(newObservers);
	}

	/**
	 * Notify all observers with a message.
	 *
	 * @param {Object} message - A message to send to the observers.
	 */
	_notifyAll(message) {
		this.eventStream.next(message);
	}

	/**
	 * Returns a deep copy of the array by reassigning the values. This is to make sure we can clear the data.
	 *
	 * @return {List} A list to copy
	 */
	_deepCopy = (array) => {
		return array.map(a => Object.assign({}, a));
	}

}

export default Model;