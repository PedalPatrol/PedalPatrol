import BasePresenter from './presenter';
import PersistStorage from '../../util/persistentstorage';
import Database from '../../util/database';
import { HomeM } from '../models/export-models';

/**
 * Class for the auth loading presenter to check if the authentication state is valid. 
 * Uses the persist storage as the model.
 */
class AuthLoadingPresenter extends BasePresenter {

	constructor() {
		super();
		this._dataLoaded = false;
		this._callback = null;
		HomeM.subscribe(this);
	}

	/**
	 * Asynchronously check the authentication state of the user to see if they are logged in.
	 *
	 * @param {Function} onSuccess - A success callback
	 * @param {Function} onFailure - A failure callback
	 */
	async checkAuthenticationState(onSuccess, onFailure) {
		await PersistStorage.retrieveData('userToken', (userToken) => {
			if (this._dataLoaded) { // In-case this is reached after data is received
				this.onRetrievalSuccess(userToken, onSuccess, onFailure);
			} else { // If data is received after authentication completes
				this.setCallback(() => {
					this.onRetrievalSuccess(userToken, onSuccess, onFailure);
				});
			}
		}, (error) => {
			onFailure();
			console.log(error);
		});
	}

	/**
	 * Sets the callback to be called when data is received.
	 *
	 * @param {Function} callback - A function to call when data is received
	 */
	setCallback(callback) {
		this._callback = callback;
	}

	/**
	 * Check if the userToken is valid and if it is, then call the onSuccess callback, otherwise call the onFailure callback.
	 *
	 * @param {string} userToken - A user token
	 * @param {Function} onSuccess - A success callback
	 * @param {Function} onFailure - A failure callback
	 */
	onRetrievalSuccess(userToken, onSuccess, onFailure) {
		// console.log(userToken);
		userToken ? onSuccess() : onFailure();
		// PersistStorage.removeData('userToken', (error) => console.log(error)); // Remove from storage
	}

	/**
	 * Called when a response is received from the Home model after it has received data.
	 *
	 * @param {Object} data - The data received from the model
	 */
	onUpdated = (data) => {
		HomeM.unsubscribe(this);
		this._dataLoaded = true; // In-case authentication occurs after data is received
		if (this._callback != null) {
			this._callback();
		}
	}

}

export default AuthLoadingPresenter;