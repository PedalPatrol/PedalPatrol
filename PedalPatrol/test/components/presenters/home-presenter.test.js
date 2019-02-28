import HomePresenter from '@/src/components/presenters/home-presenter';
import Model from '@/src/components/models/model';
import HomeModel from '@/src/components/models/home-model';
import BaseView from '@/src/components/views/view';

// Test implementation for presenter
class TestView extends BaseView {
	constructor() { super(); this.state = {data: []}}
	refreshState = () => {};
}

// Produces console error saying you shouldn't set state on an unmounted component
test('should filter names matching data', () => {
	const view = new TestView();
	const homepresenter = new HomePresenter(view);

	homepresenter.handleSearchFilter('BikeName1');

	expect(homepresenter.view.state.data).toEqual([]);

	homepresenter.onDestroy();
});

test('should return data from model', () => {
	const view = new TestView();
	const homepresenter = new HomePresenter(view);

	const resultData = [];

	expect(homepresenter.getData()).toEqual(resultData);

	homepresenter.onDestroy();
});

// This test is actually useful because we don't use the send update function
test('should update model', () => {
	const view = new TestView();
	const homemodel = new HomeModel();
	const homepresenter = new HomePresenter(view);
	const onUpdated = homepresenter.onUpdated = jest.fn((newData) => 'default').mockName('update');

	let dataToPass = { data: { model: 'Test', id: 0 } };
	let result_data = { data: [{ model: 'Test', id: 0 }] }; // To Change when actual UID is obtained

	homepresenter.update(dataToPass);

	expect(onUpdated).toHaveBeenCalled();
	expect(onUpdated).toHaveBeenCalledWith(result_data);

	homepresenter.onDestroy();
});

test('should add view as attribute', () => {
	const view = new TestView();
	const homepresenter = new HomePresenter(view);

	expect(homepresenter.view).toEqual(view);
});

test('should subscribe presenter to model', () => {
	const spy = jest.spyOn(Model.prototype, 'subscribe');
	const view = new TestView();
	const homepresenter = new HomePresenter(view);

	expect(spy).toHaveBeenCalled();
	expect(spy).toHaveBeenCalledWith(homepresenter);

	homepresenter.onDestroy();
});