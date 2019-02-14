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

	const resultData = [
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

	expect(homepresenter.getData()).toEqual(resultData);

	homepresenter.onDestroy();
});

test('should update model', () => {
	const view = new TestView();
	const homemodel = new HomeModel();
	const homepresenter = new HomePresenter(view);
	const onUpdated = homepresenter.onUpdated = jest.fn((newData) => 'default').mockName('update');

	const dataToPass = { data: 'test' };
	const resultData = {
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
					'test'
			]
	}

	homepresenter.update(dataToPass);

	expect(onUpdated).toHaveBeenCalled();
	expect(onUpdated).toHaveBeenCalledWith(resultData);

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