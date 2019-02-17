export default class ObserverList {
	/**
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
	 * Adds an observer to the observers list.
	 * 
	 * @param {Object} observer - An observer class
	 * @return {Number} The length of the new list
	 */
	add(observer) {
		return this.observers.push(observer);
	}

	/**
	 * Removes an object at a certain index or an observer 
	 * 
	 * @param {Object} observer - An observer to remove
	 */
	remove(observer) {
		this.observers = this.observers.filter(obs => obs != observer);
	}

	/**
	 * Removes an observer at the specified index. Returns if the index is greater than the length
	 * of the array. 
	 * 
	 * @param {Number} index - An index to remove the observer at
	 * @return {Boolean} true: if the observer was removed (index is less than the number of observers); false: otherwise
	 */
	removeIndex(index) {
		this.observers.splice(index, 1);
		return index > this.count();
	}

	/**
	 * Returns the number of observers in the list.
	 * 
	 * @return {Number} The number of observers
	 */
	count() {
		return this.observers.length;
	}

	/**
	 * Checks if a class is an observer.
	 * 
	 * @param {Object} A class to check
	 * @return {Boolean} true: if the observer is exists in the list; false: otherwise
	 */
	exists(objectClass) {
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
	 * Get an observer at a certain index.
	 *
	 * @param {Number} index - An index in the observer list
	 * @return {Object} An observer class object
	 */
	get(index) {
		return this.observers[index];
	}
}