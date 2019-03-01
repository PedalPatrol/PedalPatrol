import firebase from 'firebase';
import config from '../config/config.json';

export default class FirebaseDatabase {
	constructor() {
		if (!firebase.apps.length) {
			firebase.initializeApp(config.databaseConfig);
		}
		this.setupDatabaseRef();
	}

	/**
	 * Set up the database reference to the PProject table
	 */
	setupDatabaseRef() {
		this.ref = firebase.database().ref('PProject/');
	}

	/**
	 * Accesses Firebase data to sign in with email and password.
	 * This function is called asynchronously. Use 'async' and 'await'.
	 *
	 * @param {String} email - A user's email
	 * @param {String} password - A user's password
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
		bikeData.datetime = this.getDateTime(); 
		bikeData.owner = this.getCurrentUser();
		// console.log(bikeData.datetime);
		this.ref.child('Bike/').child(bikeData.id).set(bikeData, onSuccess).catch(onError);
	}

	editBikeData(newBikeData, onSuccess, onError) {
		const bikeID = newBikeData.id;

		this.ref.child('Bike/').once('value', (snapshot) => {
			let bikeData = snapshot.val();
			let originalBikeData = bikeData[bikeID];
			let updatedObj = this.merge(originalBikeData, newBikeData);
			this.ref.child('Bike/').child(bikeID).set(updatedObj, onSuccess).catch(onError);
		}).catch((error) => {
			onError(error);
			console.log(error);
		});

		// this.ref.child('Bike/').child(bikeData.id).set(bikeData).then(onSuccess).catch(onError);
	}

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
		this.ref.child('Bike/').once('value', callback);
	}

	readBikeDataOn(callback) {
		this.ref.child('Bike/').on('value', callback);
	}

	getNewBikeID() {
		return this.ref.child('Bike').push().key;
	}

	getDateTime() {
		return (new Date()).getTime();
	}

	goOffline() {
		firebase.database().goOffline();
	}

	removeBikeItem(key) {
		this.ref.child('Bike').child(key).remove();
	}

	getCurrentUser() {
		if (firebase.auth().currentUser !== null) {
			console.log("user id: " + firebase.auth().currentUser.uid);
			return firebase.auth().currentUser.uid;
		} else {
			return null;
		}
	}
}