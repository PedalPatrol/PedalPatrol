/**
 * Class to hold a temporary authentication state for the user.
 * Only used to be able to retrieve the user ID rather quickly since asyncstorage and database calls are asynchronous.
 */
class AuthenticationState {
	/**
	 * Creates an instance of AuthenticationState
	 *
	 * @constructor
	 */
	constructor() {
		this.currentUserID = null;
	}

	/**
	 * Sets the current user id.
	 *
	 * @param {string} id - The current user's id
	 */
	setCurrentUserID(id) {
		if (id != null) {
			this.currentUserID = id;
		}
	}

	/**
	 * Returns the current user's id.
	 *
	 * @return {string} The current user's id
	 */
	getCurrentUserID() {
		return this.currentUserID;
	}
}

const AuthState = new AuthenticationState();
export default AuthState;