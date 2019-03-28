import Model from './model';
import Database from '../../util/database';
import PersistStorage from '../../util/persistentstorage';
import AuthState from '../../util/authenticationstate';
import NotificationMethod from '../../util/notification';

/**
 * Class for the AuthLoading model to be used by the AuthLoadingPresenter
 * @extends Model
 */
class AuthLoadingModel extends Model {
	/**
	 * Creates an instance of AuthLoadingModel and creates an observerlist.
	 *
	 * @constructor
	 */
	constructor(){
		super();
		this._createObserverList();
	}

	/**
	 * Check the authentication state of the user.
	 *
	 * @param {Function} onComplete - A callback function to call when authentication has completed
	 */
	async checkAuthenticationState(onComplete) {
		// Offline authentication check first, if it fails, then check database
		await PersistStorage.retrieveData('userToken', async (userToken) => {
			if (userToken == null || userToken == undefined) {
				console.log('No user token, checking database authentication...');
				// Only check database user if no user token stored
				await Database.getCurrentUser((userID) => {
					AuthState.setCurrentUserID(userID);
					onComplete(userID);
				});	
			} else {
				console.log('User token found');
				AuthState.setCurrentUserID(userToken);
				onComplete(userToken);
			}
		}, (error) => {
			console.log(error);
			onComplete(null);
		});
	}

	/**
	 * Tries to log out of the database and remove all stored keys.
	 *
	 * @param {Function} onSuccess - A callback function on a successful logout
	 * @param {Function} onFailure - A callback function on a failure to logout
	 */
	logout(onSuccess, onFailure) {		
  NotificationMethod.removeToken();
		Database.signOut(async () => {
			const userID = AuthState.getCurrentUserID();
			await PersistStorage.removeAllData([], (message) => {
				console.log('All data removed', message);
			}, (error) => {
				console.log('Error removing data:', error);
			});
			AuthState.setCurrentUserID(null);
			onSuccess();
		}, (error) => {
			onFailure();
			console.log('Logout error');
		});
	}
}

export default AuthLoadingModel;