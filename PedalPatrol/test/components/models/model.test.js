import Model from '@/src/components/models/model';
import BasePresenter from '@/src/components/presenters/presenter';

const model = new Model();
const presenter = new BasePresenter();

test('should call non-deprecated function', () => {
	const _createEventStream = model._createEventStream = jest.spyOn(Model.prototype, '_createEventStream');

	model._createObserverList();
	expect(_createEventStream).toHaveBeenCalled();
	expect(_createEventStream).toHaveBeenCalledWith();
});

test('should create event stream', () => {
	model._createEventStream();
	expect(model.eventStream).not.toEqual(null);
});

test('should subscribe observer', () => {
	model._createEventStream();
	model.subscribe(presenter);
	const {observer, subscription} = model.observers[0];

	expect(observer).toEqual(presenter);
	expect(subscription).not.toEqual(null);
});

test('should unsubscribe observer', () => {
	model._createEventStream();
	model.subscribe(presenter);
	const observers = model.observers;

	model.unsubscribe(null);
	expect(model.observers).toEqual(observers);

	model.unsubscribe(presenter);
	expect(model.observers).toEqual([]);
});

test('should notify all observers with message', () => {
	const onUpdated = presenter.onUpdated = jest.fn((message) => 'default').mockName('notifyAllMessage');
	const message = { data: 'test' };

	model._createEventStream();
	model.subscribe(presenter);
	model._notifyAll(message);

	expect(onUpdated).toHaveBeenCalled();
	expect(onUpdated).toHaveBeenCalledWith(message);
	model.unsubscribe(presenter);
});

test('should notify all observers with null message', () => {
	const onUpdated = presenter.onUpdated = jest.fn((message) => 'default').mockName('notifyAllNoMessage');

	model._createEventStream();
	model.subscribe(presenter);
	model._notifyAll(null);

	expect(onUpdated).toHaveBeenCalled();
	expect(onUpdated).toHaveBeenCalledWith(null);
	model.unsubscribe(presenter);
});