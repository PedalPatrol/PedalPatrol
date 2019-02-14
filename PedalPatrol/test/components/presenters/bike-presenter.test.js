import BikePresenter from '@/src/components/presenters/bike-presenter';
import Model from '@/src/components/models/model';
import BikeModel from '@/src/components/models/bike-model';
import BaseView from '@/src/components/views/view';

// Test implementation for presenter
class TestView extends BaseView {
	constructor() { super(); this.state = {data: []}}
	refreshState = () => {};
}

// Produces console error saying you shouldn't set state on an unmounted component
test('should filter names matching data', () => {
	const view = new TestView();
	const bikepresenter = new BikePresenter(view);

	bikepresenter.handleSearchFilter('BikeName1');

	expect(bikepresenter.view.state.data).toEqual([]);

	bikepresenter.onDestroy();
});

test('should return data from model', () => {
	const view = new TestView();
	const bikepresenter = new BikePresenter(view);

	const resultData = [
		{
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
			thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
		}
	]

	expect(bikepresenter.getData()).toEqual(resultData);

	bikepresenter.onDestroy();
});

test('should update model', () => {
	const view = new TestView();
	const bikemodel = new BikeModel();
	const bikepresenter = new BikePresenter(view);
	const onUpdated = bikepresenter.onUpdated = jest.fn((newData) => 'default').mockName('update');

	const dataToPass = { data: { model: 'test'} };
	const resultData = {
		data: [
					{
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
						thumbnail: 'https://i.imgur.com/i8t6tlI.jpg'
					},
					{
						model: 'test',
						id: 2,
						owner: 'Owner'
					}
			]
	}

	bikepresenter.update(dataToPass);

	expect(onUpdated).toHaveBeenCalled();
	expect(onUpdated).toHaveBeenCalledWith(resultData);

	bikepresenter.onDestroy();
});

test('should add view as attribute', () => {
	const view = new TestView();
	const bikepresenter = new BikePresenter(view);

	expect(bikepresenter.view).toEqual(view);
});

test('should subscribe presenter to model', () => {
	const spy = jest.spyOn(Model.prototype, 'subscribe');
	const view = new TestView();
	const bikepresenter = new BikePresenter(view);

	expect(spy).toHaveBeenCalled();
	expect(spy).toHaveBeenCalledWith(bikepresenter);

	bikepresenter.onDestroy();
});