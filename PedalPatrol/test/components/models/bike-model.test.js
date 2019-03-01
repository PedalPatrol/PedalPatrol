import BikeModel from '@/src/components/models/bike-model';
import Database from '@/src/util/export-database';

afterEach(() => {
	Database.goOffline();
});

test('should create observer list', async () => {
	// Need to use spyOn to test function calls within constructors
	const _createObserverList = jest.spyOn(BikeModel.prototype, '_createObserverList');
	const _registerDatabaseRead = jest.spyOn(BikeModel.prototype, '_registerDatabaseRead').mockImplementation(() => 'default');
	// Calling function/constructor needs to be called right before expect
	BikeModel._registerDatabaseRead = _registerDatabaseRead;
	const BikeM = new BikeModel();

	expect(_createObserverList).toHaveBeenCalled();
	expect(_createObserverList).toHaveBeenCalledWith();
	expect(_registerDatabaseRead).toHaveBeenCalled();
	expect(_registerDatabaseRead).toHaveBeenCalledWith();
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

test('should notify all subscribers', () => {
	const BikeM = new BikeModel();

	// Mock function for notifyAll
	const _notifyAll = BikeM._notifyAll = jest.fn();
	const _insertDataOnUpdate = BikeM._insertDataOnUpdate = jest.fn((newData) => {BikeM._data.data = [newData.data]}).mockName('insertData');
	const writeBikeData = Database.writeBikeData = jest.fn();

	let data = { data: { model: 'Test', id: 0 } };
	let result_data = { data: [{ model: 'Test', id: 0 }] }; // To Change when actual UID is obtained
	BikeM.update(data); // Call the actual function

	// Check expectations
	expect(writeBikeData).toHaveBeenCalled();
	expect(_insertDataOnUpdate).toHaveBeenCalled();
	expect(_insertDataOnUpdate).toHaveBeenCalledWith(data);
	expect(_notifyAll).toHaveBeenCalled();
	expect(_notifyAll).toHaveBeenCalledWith(result_data);

	Database.removeBikeItem(0);
});

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