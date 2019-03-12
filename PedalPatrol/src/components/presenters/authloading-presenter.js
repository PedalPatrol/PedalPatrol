import AsyncLock from 'async-lock';

import BasePresenter from './presenter';
import PersistStorage from '../../util/persistentstorage';
import Database from '../../util/database';
import { AlertM, HomeM } from '../models/export-models';

const lock = new AsyncLock({timeout: 10000});

/**
 * Class for the auth loading presenter to check if the authentication state is valid. 
 * Uses the persist storage as the model.
 */
class AuthLoadingPresenter extends BasePresenter {

	constructor() {
		super();
		this._dataLoaded = false;
		this._dataCount = 0;
		this._callback = null;

		// This is just used to see how many models we have
		// We could declare the import using 'as Models' but doing Object.keys(Models).length is O(n) so this is faster
		this._numModels = [AlertM, HomeM].length;
		AlertM.subscribe(this);
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
				AlertM.unsubscribe(this);
				HomeM.unsubscribe(this);
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

}

export default AuthLoadingPresenter;