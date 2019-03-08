import BasePresenter from './presenter';
import PersistStorage from '../../util/persistentstorage';
import Database from '../../util/export-database';

/**
 * Class for the auth loading presenter to check if the authentication state is valid. 
 * Uses the persist storage as the model.
 */
class AuthLoadingPresenter extends BasePresenter {

	/**
	 * Asynchronously check the authentication state of the user to see if they are logged in.
	 *
	 * @param {Function} onSuccess - A success callback
	 * @param {Function} onFailure - A failure callback
	 */
	async checkAuthenticationState(onSuccess, onFailure) {
		await PersistStorage.retrieveData('userToken', (userToken) => {
			this.onRetrievalSuccess(userToken, onSuccess, onFailure);
		}, (error) => {
			onFailure();
			console.log(error);
		});
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

}

export default AuthLoadingPresenter;