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
	/**
	 * Creates an instance of SignupModel.
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
	 * Return the data from the model.
	 *
	 * @return {Object} The data stored in the model
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
		Database.signUp(this._data.data[0].username, this._data.data[0].password).then(
			(userData) => {
			if (userData) {
				console.log('-----------------------------------------------------------------------')
				console.log(userData.user.uid);
				console.log("signup user id is: "+userData.user.uid)
				Database.sendEmail(userData.user);
				Database.setAccount(userData.user);
				Database.signOut(this.onSuccessSignOut, this.onErrorCallback);
			}
		}).catch(this.onErrorCallback);
	}

	/**
	 * Signout the user
	 */
	onSuccessSignOut = () => {
		// console.log('Signed Out');
		this._notifyAll(true);
	}

	/**
	 * Error callback to call if there is an error.
	 *
	 * @param {string} error - The message of the error that occurred. default: null
	 */
	onErrorCallback = (error=null) => {
		if (error) {
			console.log(error);
		}

		// Handle Errors here.
		errorMessage = false;
		this._notifyAll(errorMessage);
	}
}

export default SignupModel;