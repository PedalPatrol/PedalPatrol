import HomeModel from '@/src/components/models/home-model';
import Database from '@/src/util/database';

afterEach(() => {
	Database.goOffline();
});

test('should create observer list', () => {
	// Need to use spyOn to test function calls within constructors
	const spy = jest.spyOn(HomeModel.prototype, '_createObserverList');
	// Calling function/constructor needs to be called right before expect
	const HomeM = new HomeModel();

	expect(spy).toHaveBeenCalled();
	expect(spy).toHaveBeenCalledWith();
});

test('should contain default data', () => {
	const HomeM = new HomeModel();

	// Use toEqual to compare objects
	expect(HomeM._data).toEqual({ data: [] });
});

test('should return default data', () => {
	const HomeM = new HomeModel();

	expect(HomeM.get()).toEqual({ data: [] });
});

test('should notify all subscribers', () => {
	const HomeM = new HomeModel();

	// Mock function for notifyAll
	const _notifyAll = HomeM._notifyAll = jest.fn();

	let data = { data: { model: 'Test', id: 0 } };
	let result_data = { data: [{model: 'Test', id: 0 }] }
	HomeM.update(data); // Call the actual function

	// Check expectations
	expect(_notifyAll).toHaveBeenCalled();
	expect(_notifyAll).toHaveBeenCalledWith(result_data);
});