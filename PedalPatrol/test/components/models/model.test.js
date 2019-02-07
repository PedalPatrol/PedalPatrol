import Model from '@/src/components/models/model';
import ObserverList from '@/src/util/observerlist';
import BasePresenter from '@/src/components/presenters/presenter';

test('should create observer list', () => {
	const model = new Model();

	model._createObserverList();
	expect(model.observerList).toBeDefined();
	expect(model.observerList).toBeInstanceOf(ObserverList);
});

test('should subscribe observer', () => {
	const model = new Model();
	const presenter = new BasePresenter();

	model._createObserverList();

	const add = model.observerList.add = jest.fn();

	model.subscribe(presenter);

	expect(add).toHaveBeenCalled();
	expect(add).toHaveBeenCalledWith(presenter);
});

test('should unsubscribe observer', () => {
	const model = new Model();
	const presenter = new BasePresenter();

	model._createObserverList();

	const remove = model.observerList.remove = jest.fn();

	model.unsubscribe(presenter);

	expect(remove).toHaveBeenCalled();
	expect(remove).toHaveBeenCalledWith(presenter);
});

test('should notify observer with message', () => {
	const model = new Model();
	const presenter = new BasePresenter();
	const onUpdated = presenter.onUpdated = jest.fn((message) => 'default').mockName('notifyMessage');
	const message = { data: 'test' };

	model._createObserverList();
	model.subscribe(presenter);
	model._notify(presenter, message);

	expect(onUpdated).toHaveBeenCalled();
	expect(onUpdated).toHaveBeenCalledWith(message);
});

test('should notify all observers with message', () => {
	const model = new Model();
	const presenter = new BasePresenter();
	const onUpdated = presenter.onUpdated = jest.fn((message) => 'default').mockName('notifyAllMessage');
	const message = { data: 'test' };

	model._createObserverList();
	model.subscribe(presenter);
	model._notifyAll(message);

	expect(onUpdated).toHaveBeenCalled();
	expect(onUpdated).toHaveBeenCalledWith(message);
});

test('should notify all observers with no message', () => {
	const model = new Model();
	const presenter = new BasePresenter();
	const onUpdated = presenter.onUpdated = jest.fn((message) => 'default').mockName('notifyAllNoMessage');

	model._createObserverList();
	model.subscribe(presenter);
	model._notifyAll();

	expect(onUpdated).toHaveBeenCalled();
	expect(onUpdated).toHaveBeenCalledWith(undefined);
});