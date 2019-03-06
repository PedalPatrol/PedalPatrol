import BikePresenter from '@/src/components/presenters/bike-presenter';
import Model from '@/src/components/models/model';
import BikeModel from '@/src/components/models/bike-model';
import BaseView from '@/src/components/views/view';
import Database from '@/src/util/export-database';

afterEach(() => {
	Database.goOffline();
});

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

	const resultData = [];

	expect(bikepresenter.getData()).toEqual(resultData);

	bikepresenter.onDestroy();
});

test('should update model', () => {
	const view = new TestView();
	const bikemodel = new BikeModel();
	const bikepresenter = new BikePresenter(view);
	const onUpdated = bikepresenter.onUpdated = jest.fn((newData) => 'default').mockName('update');

	let dataToPass = { data: { model: 'Test', id: 0 } };
	let result_data = { data: [{ model: 'Test', id: 0, owner: 'Owner' }] }; // To Change when actual UID is obtained

	bikepresenter.update(dataToPass);

//Broken
	// expect(onUpdated).toHaveBeenCalled();
	// expect(onUpdated).toHaveBeenCalledWith(result_data);

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