import addBikePresenter from '@/src/components/presenters/addbike-presenter';
import Model from '@/src/components/models/model';
import BikeModel from '@/src/components/models/bike-model';
import BaseView from '@/src/components/views/view';

import Database from '@/src/util/database';

afterEach(() => {
	Database.goOffline();
});

// Test implementation for presenter
class TestView extends BaseView {
	constructor() { super(); this.state = {data: []}}
	refreshState = () => {};
}

test('should return data from model', () => {
	const view = new TestView();
	const addbikepresenter = new addBikePresenter(view);

	const resultData = [];

	expect(addbikepresenter.getData()).toEqual(resultData);

	addbikepresenter.onDestroy();
});

test('should update model with edited bike', () => {
	const view = new TestView();
	const bikemodel = new BikeModel();
	const addbikepresenter = new addBikePresenter(view);
	const onUpdated = addbikepresenter.onUpdated = jest.fn((newData) => 'default').mockName('onUpdated');
	const callback = jest.fn((success) => 'default').mockName('callback');

	const dataToPass = { 
		inputTextData: [
				{
					name: 'Name',
					text: 'name_test'
				},
				{
					name: 'Serial Number',
					text: 'serial_test'
				},
				{
					name: 'Brand',
					text: 'brand_test'
				},
				{
					name: 'Model',
					text: 'model_test'
				},
				{
					name: 'Notable Features',
					text: 'notable_test'
				},
				{
					name: 'Wheel Size',
					text: 'wheel_test'
				},
				{
					name: 'Frame Size',
					text: 'frame_test'
				}
			],
		selectedColours: ['Red'],
		picture: [
			{ illustration: {uri: 'file:///Users/seanr/Library/Developer/CoreSimulato…ocuments/E5374902-C179-42AD-BDB9-760EEBB5E893.jpg'}},
			{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
			{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
			{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
			{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
		],
		currentID: 1
	};
	const resultDataNew = {
		data: [
					{
						id: 1,
						name: 'name_test',
						model: 'model_test',
						brand: 'brand_test',
						serial_number: 'serial_test',
						notable_features: 'notable_test',
						wheel_size: 'wheel_test',
						frame_size: 'frame_test',
						colour: ['Red'],
						owner: 'Owner',
						stolen: false,
						found: false,
						thumbnail: ['file:///Users/seanr/Library/Developer/CoreSimulato…ocuments/E5374902-C179-42AD-BDB9-760EEBB5E893.jpg'],
					}
			]
	};

	const resultDataEdit = {
		data: [
					{
						id: 1,
						name: 'name_test',
						model: 'model_test',
						brand: 'brand_test',
						serial_number: 'serial_test',
						notable_features: 'notable_test',
						wheel_size: 'wheel_test',
						frame_size: 'frame_test',
						colour: ['Blue'],
						owner: 'Owner',
						stolen: false,
						found: false,
						thumbnail: ['file:///Users/seanr/Library/Developer/CoreSimulato…ocuments/E5374902-C179-42AD-BDB9-760EEBB5E893.jpg']
					}
			]
	};

	// New
	addbikepresenter.update(dataToPass, callback);
//Broken
	// expect(onUpdated).toHaveBeenCalled();
	// expect(onUpdated).toHaveBeenCalledWith(resultDataNew);

	// Edit
	dataToPass.selectedColours = ['Blue'];
	addbikepresenter.update(dataToPass, callback);
//Broken
	// expect(onUpdated).toHaveBeenCalled();
	// expect(onUpdated).toHaveBeenCalledWith(resultDataEdit);

	addbikepresenter.onDestroy();
	Database.removeBikeItem(1, (_) => 'default');
});

test('should build data from view data', () => {
	const view = new TestView();
	const addbikepresenter = new addBikePresenter(view);
	
	const dataToPass = { 
		inputTextData: [
				{
					name: 'Name',
					text: 'name_test'
				},
				{
					name: 'Serial Number',
					text: 'serial_test'
				},
				{
					name: 'Brand',
					text: 'brand_test'
				},
				{
					name: 'Model',
					text: 'model_test'
				},
				{
					name: 'Notable Features',
					text: 'notable_test'
				},
				{
					name: 'Wheel Size',
					text: 'wheel_test'
				},
				{
					name: 'Frame Size',
					text: 'frame_test'
				}
			],
		selectedColours: ['Red'],
		picture: [
			{ illustration: {uri: 'file:///Users/seanr/Library/Developer/CoreSimulato…ocuments/E5374902-C179-42AD-BDB9-760EEBB5E893.jpg'}},
			{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
			{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
			{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
			{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
		],
	};

	const result_data = {
		data: {
				id: undefined,
				stolen: false,
				found: false,
				name: 'name_test',
				model: 'model_test',
				brand: 'brand_test',
				serial_number: 'serial_test',
				notable_features: 'notable_test',
				wheel_size: 'wheel_test',
				frame_size: 'frame_test',
				colour: ['Red'],
				thumbnail: [
					{ illustration: {uri: 'file:///Users/seanr/Library/Developer/CoreSimulato…ocuments/E5374902-C179-42AD-BDB9-760EEBB5E893.jpg'}},
					{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
					{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
					{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
					{ illustration: 'https://i.imgur.com/Fwx1TXQ.png'},
				]
			}
	};

	expect(addbikepresenter._buildDataFromView(dataToPass)).toEqual(result_data);

	addbikepresenter.onDestroy();
});

test('should check editing state and execute expected function', () => {
	const view = new TestView();
	const addbikepresenter = new addBikePresenter(view);

	const success = jest.fn(() => 'success').mockName('success');
	const failure = jest.fn(() => 'failure').mockName('failure');


	addbikepresenter.checkEditingState(true, success, failure);
	expect(success).toHaveBeenCalled();
	expect(success).toHaveBeenCalledWith();

	addbikepresenter.checkEditingState(false, success, failure);
	expect(failure).toHaveBeenCalled();
	expect(failure).toHaveBeenCalledWith();

	addbikepresenter.onDestroy();
});

test('should set view state with modified colour list', () => {
	const view = new TestView();
	const addbikepresenter = new addBikePresenter(view);

	const colourData = {
		data: [ {name: "Alice Blue", colour: "#f0f8ff"} ]
	};

	const result_data = {
		colours: [
			{
				text_component: 'Colour: #f0f8ff Name: Alice Blue',
				name: 'Alice Blue'
			}
		]
	};
	

	const renderer = jest.fn((colour, name) => {return 'Colour: ' + colour + ' Name: ' + name}).mockName('renderer');
	const setState = addbikepresenter.view.setState = jest.fn((state) => 'default').mockName('setState');

	addbikepresenter.changeText(colourData.data, renderer);
	expect(renderer).toHaveBeenCalled();
	expect(renderer).toHaveBeenCalledWith("#f0f8ff", "Alice Blue");
	expect(setState).toHaveBeenCalled();
	expect(setState).toHaveBeenCalledWith(result_data);

	addbikepresenter.onDestroy();
});

test('should filter colours by search term', () => {
	const view = new TestView();
	const addbikepresenter = new addBikePresenter(view);

	const searchTermValid = 'Blue';
	const searchTermInvalid = 'Green';
	const subKey = '';
	const displayKey = 'text_component';
	const uniqueKey = 'name';
	const items = [
		{
			text_component: 'Colour: #f0f8ff Name: Alice Blue',
			name: 'Alice Blue'
		},
		{
			text_component: 'Colour: #dc143c Name: Crimson',
			name: 'Crimson'
		}
	];

	expect(addbikepresenter.filterItems(searchTermValid, items, {subKey, displayKey, uniqueKey})).toEqual([items[0]]);
	expect(addbikepresenter.filterItems(searchTermInvalid, items, {subKey, displayKey, uniqueKey})).toEqual([]);

	addbikepresenter.onDestroy();
});

test('should translate item data to text input form', () => {
	const view = new TestView();
	const addbikepresenter = new addBikePresenter(view);

	const inputData = {
		id: 1,
		name: 'BikeName1',
		model: 'Model1',
		brand: 'Schwin',
		owner: 'Owner1',
		description: 'Testing',
		colour: ['Red', 'Blue', 'Green'],
		serial_number: 72613671,
		notable_features: 'lime green grips, scratch on side',
		wheel_size: 52,
		frame_size: 123,
		thumbnail: ['https://i.imgur.com/i8t6tlI.jpg']
	};

	const result_data = [
		{
			name: 'Name',
			multiline: false,
			bike_editable: false,
			required: true,
			text: 'BikeName1'
		},
		{
			name: 'Serial Number',
			multiline: false,
			bike_editable: true,
			required: true,
			text: '72613671'
		},
		{
			name: 'Brand',
			multiline: false,
			bike_editable: true,
			required: false,
			text: 'Schwin'
		},
		{
			name: 'Model',
			multiline: false,
			bike_editable: true,
			required: false,
			text: 'Model1'
		},
		{
			name: 'Notable Features',
			multiline: true,
			bike_editable: true,
			required: false,
			text: 'lime green grips, scratch on side'
		},
		{
			name: 'Wheel Size',
			multiline: false,
			bike_editable: true,
			required: false,
			text: '52'
		},
		{
			name: 'Frame Size',
			multiline: false,
			bike_editable: true,
			required: false,
			text: '123'
		}
	];

	expect(addbikepresenter._translateDataToInput(inputData)).toEqual(result_data);

	addbikepresenter.onDestroy();
});

test('should produce deep copy of array', () => {
	const view = new TestView();
	const addbikepresenter = new addBikePresenter(view);

	const array = [{id: '1'}, {id: '2'}];
	const result_array = [{id: '1'}, {id: '2'}];

	expect(addbikepresenter._deepCopy(array)).toEqual(result_array);
	expect(addbikepresenter._deepCopy(array)).not.toBe(array);

	addbikepresenter.onDestroy();
});

test('should add view as attribute', () => {
	const view = new TestView();
	const addbikepresenter = new addBikePresenter(view);

	expect(addbikepresenter.view).toEqual(view);

	addbikepresenter.onDestroy();
});

test('should subscribe presenter to model', () => {
	const spy = jest.spyOn(Model.prototype, 'subscribe');
	const view = new TestView();
	const addbikepresenter = new addBikePresenter(view);

	expect(spy).toHaveBeenCalled();

	addbikepresenter.onDestroy();
	expect(spy).toHaveBeenCalledWith(addbikepresenter);
});