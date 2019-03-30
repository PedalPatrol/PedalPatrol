import BikeModel from '@/src/components/models/bike-model';
import Database from '@/src/util/database';

afterEach(() => {
	Database.goOffline();
});

test('should create observer list', async () => {
	// Need to use spyOn to test function calls within constructors
	const _createObserverList = jest.spyOn(BikeModel.prototype, '_createObserverList');
	const _registerDBReadListener = jest.spyOn(BikeModel.prototype, '_registerDBReadListener').mockImplementation(() => 'default');
	// Calling function/constructor needs to be called right before expect
	BikeModel._registerDBReadListener = _registerDBReadListener;
	const BikeM = new BikeModel();

	expect(_createObserverList).toHaveBeenCalled();
	expect(_createObserverList).toHaveBeenCalledWith();
	expect(_registerDBReadListener).toHaveBeenCalled();
	expect(_registerDBReadListener).toHaveBeenCalledWith();
});

test('should contain default data', async () => {
	const BikeM = new BikeModel();

	// Use toEqual to compare objects
	expect(BikeM._data).toEqual({ data: [] });
});

test('should return default data', () => {
	const BikeM = new BikeModel();

	expect(BikeM.get()).toEqual({ data: [] });
});

// test('should notify all subscribers', () => {
// 	const BikeM = new BikeModel();

// 	// Mock function for notifyAll
// 	const _notifyAll = BikeM._notifyAll = jest.fn();
// 	const _insertDataOnUpdate = BikeM._insertDataOnUpdate = jest.fn((newData) => {BikeM._data.data = [newData.data]}).mockName('insertData');

// 	let data = { data: { model: 'Test', id: 0, thumbnail: [''] } };
// 	let result_data = { data: [{ model: 'Test', id: 0, thumbnail: [''] }] }; // To Change when actual UID is obtained
// 	BikeM.update(data); // Call the actual function

// 	// Check expectations
// 	expect(_insertDataOnUpdate).toHaveBeenCalled();
// 	expect(_insertDataOnUpdate).toHaveBeenCalledWith(data);
// 	expect(_notifyAll).toHaveBeenCalled();
// 	expect(_notifyAll).toHaveBeenCalledWith(result_data);

// 	Database.removeBikeItem(0, (_) => 'default');
// });

test('should overwrite data', () => {
	const BikeM = new BikeModel();

	const newData = {
		data: { id: 1 }
	};

	BikeM._insertDataOnUpdate(newData);
	expect(BikeM._data.data).toEqual([{id: 1}]);
});

test('should insert new data', () => {
	const BikeM = new BikeModel();

	const newData = {
		data: { id: 1 }
	};

	let result_data = { data: [{ id: 1 }] }

	BikeM._insertDataOnUpdate(newData);
	expect(BikeM._data.data).toEqual(result_data.data);
});

test('should check if bike exists', () => {
	const BikeM = new BikeModel();

	const bikes = [{ id: 1 }, { id: 2 }];
	BikeM._data.data = bikes;

	const existingBike = {data: { id: 1 }};
	const missingBike = {data: { id: 3}};

	expect(BikeM._bikeDataExists(existingBike)).toEqual({exists: true, index: 0});
	expect(BikeM._bikeDataExists(missingBike)).toEqual({exists: false, index: -1});

});