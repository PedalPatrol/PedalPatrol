//model
// attributes: password, username
// function : getUsername/password setUsername/password
// function2 : login: connect to database and exchange data
//login () if login success, create a new user object; else fail.

import Model from './model';
import Database from '../../util/database';
import PersistStorage from '../../util/persistentstorage';
import AuthState from '../../util/authenticationstate';
import ImageUtil from '../../util/imageutil';
import NotificationMethod from '../../util/notification';

/**
 * Class for the login model to be used by the LoginPresenter and SignupPresenter
 * @extends Model
 */
class LoginModel extends Model {
	/**
	 * Creates an instance of LoginModelCreates an observerlist.
	 *
	 * @constructor
	 */
	constructor(){
		super();
		this._data = {
			data: [
					{
						username:"",
						password:""
					}
				]
		}
		this._createObserverList();
	}

	/**
	 * Returns the data from the model.
	 *
	 * @return {Object} A deconstructed copy of the data object
	 */
	get() {
		return {...this._data}
	}

	/**
	 * async method for presenters to know if the username and password is existed in the database
	 * @param {Object} newData - data including username and password.
	 */
	async update(newData) {
		// this._data = {...this._data, ...newData} // Overwrite - Use this if the data is appended to previous data in the presenter
		this._data.data.splice(0,1,newData.data); // Appends to the list - Use this if only a single piece of data is passed in

		let errorMessage = true;
		// console.log('errorbeforecheck: '+errorMessage)
		// await firebase.auth().signInWithEmailAndPassword(this._data.data[0].username, this._data.data[0].password).catch(function(error) {
		// 	// Handle Errors here.
		// 	errorMessage = 'false';
		// 	console.log('erroraftercheck: '+errorMessage);
		// });

		await Database.signIn(this._data.data[0].username, this._data.data[0].password, (error) => {
			// Handle Errors here.
			errorMessage = false;
			console.log(error);
		});
        const fcm = NotificationMethod.checkPermission();
        //do something to overwrite database device token;
        if (fcm){

        }



		if (errorMessage) {
			this._authenticationSuccess();
		}

		//var message = errorMessage;
		// console.log('ddd:'+errorMessage)
		// this.notifyAll(null) // Send with no message?
		//console.log('errorbeforenotify: '+ errorMessage)
		this._notifyAll(errorMessage); // Consider not having a message and forcing the presenter to 'get' the message itself
		// this._eventEmitter.emit('change')
	}

	/**
	 * Function to call on a successful authentication of the user signing in to the database.
	 */
	_authenticationSuccess() {
		Database.getCurrentUser((userID) => {
			AuthState.setCurrentUserID(userID);
			PersistStorage.storeData('userToken', userID, (error) => {console.log(error)});
			this._checkProfileImageExists(userID);
			this.triggerOnReads();
		});
	}

	/**
	 * Check if a profile image exists.
	 *
	 * @param {string} userID - The current user's id
	 */
	_checkProfileImageExists(userID) {
		PersistStorage.retrieveData(userID, (image) => {
			if (image == null || image == undefined) {
				PersistStorage.storeData(userID, ImageUtil.getDefaultImage(ImageUtil.getTypes().PROFILE), (error) => {console.log(error)});
			}
		}, (error) => {
			console.log(error);
		});
	}

	/**
	 * Trigger the on reads for models by adding a new item to the Bike list
	 */
	triggerOnReads() {
		const newData = {tempID: 0}
		Database.triggerTemporaryItem(newData, (error) => {
			console.log(error);
		});
	}
}

export default LoginModel;