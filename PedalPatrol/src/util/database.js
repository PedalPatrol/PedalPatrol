import firebase from 'firebase';
import config from '../config/config.json';

export default class FirebaseDatabase {
	constructor() {
		if (!firebase.apps.length) {
			firebase.initializeApp(config.databaseConfig);
		}
		this.setupDatabaseRef();
	}

	setupDatabaseRef() {
		this.ref = firebase.database().ref('PProject/');
	}

	/**
	 * Accesses Firebase data to sign in with email and password.
	 *
	 * @param
	 */
	signIn(username, password, onError) {
		firebase.auth().signInWithEmailAndPassword(username, password).catch(onError);
	}


	/** 
	 * Write to the database in table 'Bike' using the id as the child. This allows us to add custom IDs for identification.
	 */
	writeBikeData(bikeData, onSuccess, onError) {
		bikeData.datetime = this.getDateTime(); 
		console.log(bikeData.datetime);
		this.ref.child('Bike/').push(bikeData).then(onSuccess).catch(onError);
	}

	readBikeDataOnce(callback) {
		this.ref.child('Bike/').once('value', callback);
	}

	getNewBikeID() {
		return this.ref.child('Bike').push().key;
	}

	readBikeDataOn(callback) {
		this.ref.child('Bike/').on('value', callback);
	}

	getDateTime() {
		var today = new Date();
		return today.getTime();
		// var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
		// var time = today.getHours() + ":" + today.getMinutes();
		// var dateTime = time+' - '+date;
		// return dateTime;
	}
}