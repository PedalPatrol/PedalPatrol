import firebase from 'firebase';
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
		this.refDB.child('Bike/').on('value', callback);
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
	removeBikeItem(key) {
		this.refDB.child('Bike').child(key).remove();
	}

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
	 * Asynchronously write an image to firebase storage.
	 *
	 * @param {string} id - The id of the bike to write to
	 * @param {Object} file - The file object to write
	 * @param {string} filename - The name of the file
	 * @param {Function} onSuccess - The callback to call on a successful upload
	 * @param {Function} onError - The callback to call on a failed upload
	 */
	async writeImage(id, file, filename, onSuccess, onError) {
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
				blob.close();
				onSuccess(downloadURL);
				return null;
			});
		});
	}
}

export default FirebaseDatabase;