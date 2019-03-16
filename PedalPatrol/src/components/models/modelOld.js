import ObserverList from '../../util/observerlist';

/**
 * @deprecated Use Model.js and associated functions instead.
 * Base class for all models
 */
class ModelOld {
	/**
	 * @deprecated 
	 * Private method to only be used by classes that extend Model.
	 * Creates an observer list for the child that classes can subscribe to.
	 */
	_createObserverList = () => {
		this.observerList = {...(new ObserverList())};
	}

	/**
	 * @deprecated 
	 * Private method to only be used by classes that extend Model.
	 * Notifies all subscribers/observers of the calling child. 
	 * This function forces the presenter to fetch any data from the model itself.
	 */
	_notifyAll = () => {
		let count = this.observerList.count();
		for (let i=0; i < count; i++) {
			this.observerList.get(i).onUpdated(); // Calls the update function
		}
	}

	/**
	 * @deprecated 
	 * Private method to only be used by classes that extend Model.
	 * Notifies all subscribers/observers of the calling child and sends a message.
	 *
	 * @param {Object} message - A message to send to the observers
	 */
	_notifyAll = (message) => {
		let count = this.observerList.count();
		for (let i=0; i < count; i++) {
			console.log(this.observerList);
			// console.log(message);
			// console.log(this.observerList.get(i));
			// console.log(this.observerList.getObservers())
			this.observerList.get(this.observerList, i).onUpdated(message); // Calls the update function
		}
	}

	/**
	 * @deprecated 
	 * Private method to only be used by classes that extend Model.
	 * Notifies a specific subscriber/observer of the calling child.
	 *
	 * @param {Object} observer - An observer to send a message to
	 * @param {Object} message - A message to send to the observer
	 * @return {Boolean} true: if the observer exists, a message will be sent; false: if the observer does not exist, no message sent
	 */
	_notify = (observer, message) => {
		if (this.observerList.exists(observer)) {
			observer.onUpdated(message);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @deprecated 
	 * Adds (subscribes) an observer to the calling child/subject to the subscription list.
	 *
	 * @param {Object} observer - An observing class
	 */
	subscribe = (observer) => {
		this.observerList.add(observer);
	}

	/**
	 * @deprecated 
	 * Removes (unsubscribes) an observer from the calling child/subject's subscription list.
	 *
	 * @param {Object} observer - An observing class
	 */
	unsubscribe = (observer) => {
		this.observerList.remove(observer);
	}

	/**
	 * @deprecated 
	 * Checks if an observer exists in the observer list.
	 * 
	 * @param {Object} objectClass - A class
	 * @return {Boolean} true: if the class is an observer; false: if the class is not an observer
	 */
	exists = (objectClass) => {
	 	return this.observerList.exists(objectClass);
	}
}

export default ModelOld;