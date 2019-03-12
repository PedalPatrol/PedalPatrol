import firebase from 'firebase';
import 'firebase/storage'; // Necessary for jest tests
import config from '../config/config.json';

/**
 * Class for the firebase database connection and operations
 */
class FirebaseDatabase {
	constructor() {
		if (!firebase.apps.length) {
			firebase.initializeApp(config.databaseConfig);
		}
		this.setupDatabaseRef();
		this.setupStorageRef();
	}

	/**
	 * Set up the database reference to the PProject table
	 */
	setupDatabaseRef() {
		this.refDB = firebase.database().ref('PProject/');
	}

	/**
	 * Set up the storage reference
	 */
	setupStorageRef() {
		this.refStorage = firebase.storage().ref();
	}

	/**
	 * Returns the storage without a reference.
	 *
	 * @return {Object} The storage without reference
	 */
	getStorageWithoutRef() {
		return firebase.storage();
	}


	/**
	 * Accesses Firebase data to sign in with email and password.
	 * This function is called asynchronously. Use 'async' and 'await'.
	 *
	 * @param {string} email - A user's email
	 * @param {string} password - A user's password
	 * @param {Function} onError - A function callback to execute on error
	 */
	signIn(email, password, onError) {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(onError);
	}


	/** 
	 * Write to the database in table 'Bike' using the id as the child. Adds a date time and owner to the data
	 *
	 * @param {Object} bikeData - Bike data to add to the database
	 * @param {Function} onSuccess - A function callback to execute on the success of writing to the database
	 * @param {Function} onError - A function callback to execute on an error when writing to the database
	 */
	writeBikeData(bikeData, onSuccess, onError) {
		bikeData.milliseconds = this.getDateTime(); 
		bikeData.owner = this.getCurrentUser();

		this.refDB.child('Bike/').child(bikeData.id).set(bikeData, onSuccess).catch(onError);
	}

	/**
	 * Overwrites data in the database by reading the data, merging it with the new values and writing back to the same ID.
	 *
	 * @param {Object} newBikeData - New data to write
	 * @param {Function} onSuccess - A function callback to run when writing is successful
	 * @param {Function} onErorr - A function callback to run when writing fails
	 */
	editBikeData(newBikeData, onSuccess, onError) {
		const bikeID = newBikeData.id;

		this.refDB.child('Bike/').once('value', (snapshot) => {
			let bikeData = snapshot.val();
			let originalBikeData = bikeData[bikeID];
			let updatedObj = this.merge(originalBikeData, newBikeData);
			this.refDB.child('Bike/').child(bikeID).set(updatedObj, onSuccess).catch(onError);
		}).catch((error) => {
			onError(error);
			console.log(error);
		});
	}

	/**
	 * Merges the data of two objects. Keeps everything in originalObj, adds any key in newObj and overwrites duplicates in originalObj.
	 *
	 * @param {Object} originalObj - Original data to replace
	 * @param {Object} newObj - New data to add
	 *
	 * @return {Object} Merged data
	 */
	merge(originalObj, newObj) {
		// Merge them together by just overwriting existing keys and adding new ones
		// key: the name of the object key
		// index: the ordinal position of the key within the object 
		Object.keys(newObj).forEach((key,index) => {
			originalObj[key] = newObj[key];
		});
		return originalObj; // Need to return original because it has datetime and owner
	}

	/**
	 * Read data from the bike table only once.
	 *
	 * @param {Function} callback - A function callback that is with the value(s) read
	 */
	readBikeDataOnce(callback) {
		this.refDB.child('Bike/').once('value', callback);
	}

	/**
	 * Read data from the bike table every time there is a change in the database.
	 *
	 * @param {Function} callback - A function callback that is with the value(s) read
	 */
	readBikeDataOn(callback) {
		this.listenOn('Bike/', 'value', callback);
		// this.refDB.child('Bike/').on('value', callback);
	}

	/**
	 * General function for listening to the database for events.
	 * Be as specific as possible when specifying the child (don't just listen on root).
	 * See https://firebase.google.com/docs/reference/js/firebase.database.Reference#on
	 * for event names.
	 *
	 * @param {string} child - A child to listen on
	 * @param {string} event - An event to listen for
	 * @param {Function} callback - A function callback to trigger when data is recieved
	 */
	listenOn(child, event, callback) {
		this.refDB.child(child).on(event, callback);
	}

	/**
	 * Removes a bike id from the database.
	 *
	 * @param {string} key - A bike id to remove
	 * @param {Function} callback - A function callback to trigger when the bike is removed
	 */
	removeBikeItem(key, callback) {
		this.removeItem('Bike/', key, callback);
	}

	/**
	 * Removes an item from the database given by 'removeChild' in the 'table'.
	 *
	 * @param {string} table - A table to remove from
	 * @param {string} removeChild - A child id to remove
	 * @param {Function} callback - A function callback to trigger when item is removed
	 */
	removeItem(table, removeChild, callback) {
		this.refDB.child(table).child(removeChild).remove().then(() => {
			callback(true);
		}).catch(() => {
			callback(false);
		});
	}

	/**
	 * Returns a new unique key generated by the database.
	 *
	 * @return {string} A newly generated unique key
	 */
	getNewBikeID() {
		return this.refDB.child('Bike').push().key;
	}

	/**
	 * Generates the current time and returns it in milliseconds.
	 * 
	 * @return {Number} Returns the current time in milliseconds
	 */
	getDateTime() {
		return (new Date()).getTime();
	}

	/**
	 * Makes the database go offline.
	 */
	goOffline() {
		firebase.database().goOffline();
	}

	/**
	 * Makes the database go online.
	 */
	goOnline() {
		firebase.database().goOnline();
	}

	/**
	 * Removes an item from the database by a supplied key.
	 *
	 * @param {string} key - An id in the database
	 */
	// removeBikeItem(key) {
	// 	this.refDB.child('Bike').child(key).remove();
	// }

	/**
	 * Returns the currently logged in user's id.
	 *
	 * @return {string} user id of the currently logged in user
	 */
	getCurrentUser() {
		if (firebase.auth().currentUser !== null) {
			console.log("user id: " + firebase.auth().currentUser.uid);
			return firebase.auth().currentUser.uid;
		} else {
			return null;
		}
	}

	/**
	 * Remove a bike image folder from the database storage.
	 *
	 * @param {string} id - A bike id
	 * @param {Function} callback - A function to call on completion or on failure
	 */
	removeBikeImages(thumbnails, callback) {
		let result = true;
		const storageWithoutRef = this.getStorageWithoutRef(); // We need to use the refFromURL so we can only use the storage without a reference
		// Firebase does not support deleting directories so we must loop through the thumbnails and delete each file
		for (let i=0; i < thumbnails.length; i++) {
			storageWithoutRef.refFromURL(thumbnails[i]).delete().then(() => { 
				result = result && true; 
			}).catch((error) => { 
				result = result && false; 
			});	
		}
		callback(result);
	}

	/**
	 * Asynchronously write an image to firebase storage.
	 *
	 * @param {string} id - The id of the bike to write to
	 * @param {Object} file - The file object to write
	 * @param {string} filename - The name of the file
	 * @param {Function} onSuccess - The callback to call on a successful upload
	 * @param {Function} onError - The callback to call on a failed upload
	 */
	async writeImage(id, file, filename, onSuccess, onError) {
		// Create a blob because the firebase 'put' function requires a blob
		// I found out later that when we get an image from the user, we can actually get it as data
		// and since the firebase 'put' function also accepts the data format, we can use that instead
		// which would save the XMLHttpRequest to create a blob.
		// TODO : Optimization - Use data format for images instead of creating a blob which would eliminate
		// the following Promise
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = () => {
				resolve(xhr.response);
			};
			xhr.onerror = (e) => {
				console.log(e);
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', file.uri, true);
			xhr.send(null);
		});

		const task = this.refStorage.child('BikeImages/' + id + '/' + filename).put(blob);
		task.on('state_changed', (snapshot) => {
			// Observe state change events such as progress, pause, and resume
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: // or 'paused'
					// console.log('Upload is paused');
					break;
				case firebase.storage.TaskState.RUNNING: // or 'running'
					// console.log('Upload is running');
					break;
			}
		}, onError, () => {
			task.snapshot.ref.getDownloadURL().then((downloadURL) => {
				// console.log('File available at', downloadURL);
				blob.close(); // Make sure to close the blob
				onSuccess(downloadURL);
				return null;
			});
		});
	}
}

const Database = new FirebaseDatabase();
export default Database;