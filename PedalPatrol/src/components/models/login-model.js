//model
// attributes: password, username
// function : getUsername/password setUsername/password
// function2 : login: connect to database and exchange data
//login () if login success, create a new user object; else fail.
import Model from './model';
// import firebase from 'firebase';
import Database from '../../util/export-database';


export default class LoginModel extends Model {
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

		var errorMessage = 'true';
		// console.log('errorbeforecheck: '+errorMessage)
		// await firebase.auth().signInWithEmailAndPassword(this._data.data[0].username, this._data.data[0].password).catch(function(error) {
		// 	// Handle Errors here.
		// 	errorMessage = 'false';
		// 	console.log('erroraftercheck: '+errorMessage);
		// });

		await Database.signIn(this._data.data[0].username, this._data.data[0].password, (error) => {
			// Handle Errors here.
			errorMessage = 'false';
			// console.log('erroraftercheck: '+errorMessage);
		});

		//var message = errorMessage;
		// console.log('ddd:'+errorMessage)
		// this.notifyAll() // Send with no message?
		//console.log('errorbeforenotify: '+ errorMessage)
		this._notifyAll(errorMessage); // Consider not having a message and forcing the presenter to 'get' the message itself
		// this._eventEmitter.emit('change')
	}


	 //onError() => {}
	 //onComplete () => {}
}