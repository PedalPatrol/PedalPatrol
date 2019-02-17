import HomeModel from '@/src/components/models/home-model';

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
	expect(HomeM._data).toEqual({ 
			data: [
					{
						id: 1,
						name: 'BikeName1',
						model: 'Model1',
						owner: 'Owner1',
						description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                        colour: 'Red',
						serial_number: 72613671,
						notable_features: 'lime green grips, scratch on side',
                        timeago: '2 hrs ago',
                        datetime: '3:30 PM - 16 Jan. 19',
                        address: '162 Barrie St. Kingston, ON',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
			]

		});
});

test('should return default data', () => {
	const HomeM = new HomeModel();

	expect(HomeM.get()).toEqual({ 
			data: [
					{
						id: 1,
						name: 'BikeName1',
						model: 'Model1',
						owner: 'Owner1',
						description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                        colour: 'Red',
						serial_number: 72613671,
						notable_features: 'lime green grips, scratch on side',
                        timeago: '2 hrs ago',
                        datetime: '3:30 PM - 16 Jan. 19',
                        address: '162 Barrie St. Kingston, ON',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					}
			]

		});
});

test('should notify all subscribers', () => {
	const HomeM = new HomeModel();

	// Mock function for notifyAll
	const _notifyAll = HomeM._notifyAll = jest.fn();

	let data = { data: { id: 1 }};
	HomeM.update(data); // Call the actual function

	let result_data = {
		data: [
					{
						id: 1,
						name: 'BikeName1',
						model: 'Model1',
						owner: 'Owner1',
						description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                        colour: 'Red',
						serial_number: 72613671,
						notable_features: 'lime green grips, scratch on side',
                        timeago: '2 hrs ago',
                        datetime: '3:30 PM - 16 Jan. 19',
                        address: '162 Barrie St. Kingston, ON',
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					},
					{ id: 1 }
			]
	}

	// Check expectations
	expect(HomeM._data).toEqual(result_data);
	expect(_notifyAll).toHaveBeenCalled();
	expect(_notifyAll).toHaveBeenCalledWith(result_data);
});

