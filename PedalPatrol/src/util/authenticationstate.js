class AuthenticationState {
	constructor() {
		this.currentUserID = null;
	}

	setCurrentUserID(id) {
		if (id != null) {
			this.currentUserID = id;
		}
	}

	getCurrentUserID() {
		return this.currentUserID;
	}
}

const AuthState = new AuthenticationState();
export default AuthState;