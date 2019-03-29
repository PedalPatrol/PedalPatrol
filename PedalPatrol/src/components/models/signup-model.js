//model
// attributes: password, username
// function : getUsername/password setUsername/password


import Model from './model';
import Database from '../../util/database';

/**
 * Class for the signup model to be used by the SignupPresenter
 * @extends Model
 */
class SignupModel extends Model {
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

		//var errorMessage = 'successfully';
		await Database.signUp(this._data.data[0].username, this._data.data[0].password, (error) => {
			// Handle Errors here.
			errorMessage = error.message;
			console.log('erroraftercheck: '+errorMessage);
		}).then();
		
		// create account in database
		//acount detail page???
		

		
		//var user = Database.currentUser();
		
		await Database.sendEmail();
		this._notifyAll(errorMessage); // Consider not having a message and forcing the presenter to 'get' the message itself
		// this._eventEmitter.emit('change')
		
		
	}


	 //onError() => {}
	 //onComplete () => {}
}

export default SignupModel;