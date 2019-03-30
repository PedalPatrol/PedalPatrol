import AuthState from '@/src/util/authenticationstate';

test('should have current user id be null after initialization', () => {
	expect(AuthState.currentUserID).toEqual(null);
});

test('should set current user id to parameter', () => {
	AuthState.setCurrentUserID('0');
	expect(AuthState.currentUserID).toBe('0');
	AuthState.setCurrentUserID(null);
	expect(AuthState.currentUserID).toEqual(null);
});

test('should return current user id', () => {
	AuthState.setCurrentUserID('1');
	expect(AuthState.getCurrentUserID()).toBe('1');
});