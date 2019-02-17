import ObserverList from '../../util/observerlist';

export default class Model {
	/**
	 * @private
	 * Private method to only be used by classes that extend Model.
	 * Creates an observer list for the child that classes can subscribe to.
	 */
	_createObserverList() {
		this.observerList = new ObserverList();
	}

	/**
	 * @private
	 * Private method to only be used by classes that extend Model.
	 * Notifies all subscribers/observers of the calling child. 
	 * This function forces the presenter to fetch any data from the model itself.
	 */
	_notifyAll() {
		let count = this.observerList.count();
		for (let i=0; i < count; i++) {
			this.observerList.get(i).onUpdated(); // Calls the update function
		}
	}

	/**
	 * @private
	 * Private method to only be used by classes that extend Model.
	 * Notifies all subscribers/observers of the calling child and sends a message.
	 *
	 * @param {Object} message - A message to send to the observers
	 */
	_notifyAll(message) {
		let count = this.observerList.count();
		for (let i=0; i < count; i++) {
			this.observerList.get(i).onUpdated(message); // Calls the update function
		}
	}

	/**
	 * @private
	 * Private method to only be used by classes that extend Model.
	 * Notifies a specific subscriber/observer of the calling child.
	 *
	 * @param {Object} observer - An observer to send a message to
	 * @param {Object} message - A message to send to the observer
	 * @return {Boolean} true: if the observer exists, a message will be sent; false: if the observer does not exist, no message sent
	 */
	_notify(observer, message) {
		if (this.observerList.exists(observer)) {
			observer.onUpdated(message);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Adds (subscribes) an observer to the calling child/subject to the subscription list.
	 *
	 * @param {Object} observer - An observing class
	 */
	subscribe(observer) {
		this.observerList.add(observer);
	}

	/**
	 * Removes (unsubscribes) an observer from the calling child/subject's subscription list.
	 *
	 * @param {Object} observer - An observing class
	 */
	unsubscribe(observer) {
		this.observerList.remove(observer);
	}

	/**
	 * Checks if an observer exists in the observer list.
	 * 
	 * @param {Object} objectClass - A class
	 * @return {Boolean} true: if the class is an observer; false: if the class is not an observer
	 */
	exists(objectClass) {
	 	return this.observerList.exists(objectClass);
	}
}