import BikeModel from '@/src/components/models/bike-model';

test('should create observer list', () => {
	// Need to use spyOn to test function calls within constructors
	const spy = jest.spyOn(BikeModel.prototype, '_createObserverList');
	const BikeM = new BikeModel();

	expect(spy).toHaveBeenCalled();
	expect(spy).toHaveBeenCalledWith();
});

test('should contain default data', () => {
	const BikeM = new BikeModel();

	// Use toEqual to compare objects
	expect(BikeM._data).toEqual({ 
			data: [
					{
						id: 1,
						name: 'BikeName1',
						model: 'Model1',
						owner: 'Owner1',
						description: 'Testing',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
			]

		});
});

test('should return default data', () => {
	const BikeM = new BikeModel();

	expect(BikeM.get()).toEqual({ 
			data: [
					{
						id: 1,
						name: 'BikeName1',
						model: 'Model1',
						owner: 'Owner1',
						description: 'Testing',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
			]

		});
});

test('should notify all subscribers', () => {
	const BikeM = new BikeModel();

	// Mock function for notifyAll
	const _notifyAll = BikeM._notifyAll = jest.fn();

	let data = { data: { id: 1 }};
	BikeM.update(data); // Call the actual function

	let result_data = {
		data: [
					{
						id: 1,
						name: 'BikeName1',
						model: 'Model1',
						owner: 'Owner1',
						description: 'Testing',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					},
					{ id: 1 }
			]
	}

	// Check expectations
	expect(BikeM._data).toEqual(result_data);
	expect(_notifyAll).toHaveBeenCalled();
	expect(_notifyAll).toHaveBeenCalledWith(result_data);
});

