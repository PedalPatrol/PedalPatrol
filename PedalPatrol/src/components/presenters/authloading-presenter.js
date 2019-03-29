import AsyncLock from 'async-lock';

import BasePresenter from './presenter';
import { AuthLoadingM, HomeM } from '../models/export-models';

const lock = new AsyncLock({timeout: 10000});

/**
 * Class for the auth loading presenter to check if the authentication state is valid. 
 * Uses the persist storage as the model.
 */
class AuthLoadingPresenter extends BasePresenter {
	/**
	 * Creates an instance of AuthLoadingPresenter. Subscribes to models to await data 
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this._dataLoaded = false;
		this._dataCount = 0;
		this._callback = null;

		// This is just used to see how many models we have
		// We could declare the import using 'as Models' but doing Object.keys(Models).length is O(n) so this is faster
		// Only add models that we expect data from
		this._numModels = [HomeM].length;
		// AlertM.subscribe(this);
		HomeM.subscribe(this);

		// This model is really only used to logout, so we don't expect an onUpdated call from it
		// We use callbacks since logout is an async call
		AuthLoadingM.subscribe(this); // We don't expect data from it so don't need to add it to '_numModels'
	}

	/**
	 * Asynchronously check the authentication state of the user to see if they are logged in.
	 *
	 * @param {Function} onSuccess - A success callback
	 * @param {Function} onFailure - A failure callback
	 */
	async checkAuthState(onSuccess, onFailure) {

		await AuthLoadingM.checkAuthenticationState((userID) => {
			if (this._dataLoaded) { // In-case this is reached after data is received
				this.onRetrievalSuccess(userID, onSuccess, onFailure);
			} else { // If data is received after authentication completes
				this.setCallback(() => {
					this.onRetrievalSuccess(userID, onSuccess, onFailure);
				});
			}
		})
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
	}

	/**
	 * Called when a response is received from the Home and the Alert models after it has received data.
	 * Acquires a lock to make sure that both don't enter at the same time.
	 *
	 * @param {Object} data - The data received from the model
	 */
	onUpdated = (data) => {
		// Acquire the lock on some key
		lock.acquire('key', (done) => {
			this._dataCount++; // Increment on the amount of data we receive (The reason for the lock)
			// console.log(this._dataCount);
			// Check if the amount of data received is the same as the number of models we expect data from
			if (this._dataCount === this._numModels) {
				this.onDestroy(); // Unsubscribe from the models
				this._dataLoaded = true; // In-case authentication occurs after data is received
				if (this._callback != null) {
					this._callback();
				}
			}

			done(); // Need to say we are finished with the lock
		}, (err, ret) => {
			// Lock is released
			// console.log(err);
		});
	}

	/**
	 * Unsubscribe from models
	 */
	onDestroy = () => {
		// AlertM.unsubscribe(this);
		AuthLoadingM.unsubscribe(this);
		HomeM.unsubscribe(this);
	}

	/**
	 * Try to logout. Function is called on every entry to the authloading view so only execute logout if logout is requested.
	 *
	 * @param {Boolean} shouldLogout - true: if a logout is requested; false: otherwise
	 * @param {Function} onSuccess - A function to call on a successful logout
	 * @param {Function} onFailure - A function to call on failure to logout
	 */
	tryLogout = (shouldLogout, onSuccess, onFailure) => {
		// console.log(shouldLogout);
		if (shouldLogout) {
			AuthLoadingM.logout(onSuccess, onFailure);
		}
	}

}

export default AuthLoadingPresenter;