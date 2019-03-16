/**
 * @deprecated 
 * Class for observer list to facilitate observing
 */
class ObserverList {
	/**
	 * @deprecated 
	 * Creates an instance of an ObserverList, initializing the observers as empty.
	 *
	 * @constructor
	 * @author Sean
	 * @this {ObserverList}
	 */
	constructor() {
		this.observers = [];
	}

	/**
	 * @deprecated 
	 * Adds an observer to the observers list.
	 * 
	 * @param {Object} observer - An observer class
	 * @return {Number} The length of the new list
	 */
	add = (observer) => {
		return this.observers.push(observer);
	}

	/**
	 * @deprecated 
	 * Removes an object at a certain index or an observer 
	 * 
	 * @param {Object} observer - An observer to remove
	 */
	remove = (observer) => {
		let newObservers = [];
		for (let i=0; i < this.observers.length; i++) {
			if (this.observers[i] != observer) {
				newObservers.push(this.observers[i]);
			}
		}
		this.observers = {...newObservers};
		if (newObservers.length === 0) {
			this.observers = [];
		}

		// this.observers = this._deepCopy(this.observers.filter(obs => obs != observer));
	}

	/**
	 * @deprecated 
	 * Removes an observer at the specified index. Returns if the index is greater than the length
	 * of the array. 
	 * 
	 * @param {Number} index - An index to remove the observer at
	 * @return {Boolean} true: if the observer was removed (index is less than the number of observers); false: otherwise
	 */
	removeIndex = (index) => {
		this.observers.splice(index, 1);
		return index > this.count();
	}

	/**
	 * @deprecated 
	 * Returns the number of observers in the list.
	 * 
	 * @return {Number} The number of observers
	 */
	count = () => {
		return this.observers.length;
	}

	/**
	 * @deprecated 
	 * Checks if a class is an observer.
	 * 
	 * @param {Object} A class to check
	 * @return {Boolean} true: if the observer is exists in the list; false: otherwise
	 */
	exists = (objectClass) => {
		let i = 0;
		while (i < this.observers.length) {
			if (this.observers[i] == objectClass) {
				return true;
			}
			i++;
		}
		return false;
	}

	/**
	 * @deprecated 
	 * Get an observer at a certain index.
	 *
	 * @param {Number} index - An index in the observer list
	 * @return {Object} An observer class object
	 */
	get = (index) => {
		return this.observers[index];
	}

	/**
	 * @deprecated 
	 * Returns a deep copy of the array by reassigning the values. This is to make sure we can clear the data.
	 *
	 * @return {List} A list to copy
	 */
	_deepCopy = (array) => {
		return array.map(a => Object.assign({}, a));
	}
}

export default ObserverList;