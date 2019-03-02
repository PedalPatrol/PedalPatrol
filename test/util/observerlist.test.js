import ObserverList from '@/src/util/observerlist';
import BasePresenter from '@/src/components/presenters/presenter';

test('should create observer list', () => {
	const observerlist = new ObserverList();

	expect(observerlist.observers).toBeDefined();
	expect(observerlist.observers).toEqual([]);
});

test('should add observer', () => {
	const observerlist = new ObserverList();
	const presenter = new BasePresenter();

	expect(observerlist.add(presenter)).toBe(1);
	expect(observerlist.observers).toContainEqual(presenter);
});

test('should remove observer', () => {
	const observerlist = new ObserverList();
	const presenter = new BasePresenter();

	observerlist.add(presenter);
	observerlist.remove(presenter);
	expect(observerlist.observers).not.toContainEqual(presenter);
});

test('should remove observer at index', () => {
	const observerlist = new ObserverList();
	const presenter = new BasePresenter();

	observerlist.add(presenter);
	observerlist.removeIndex(0);
	expect(observerlist.observers).not.toContainEqual(presenter);
});

test('should still have presenter if index is larger than list', () => {
	const observerlist = new ObserverList();
	const presenter = new BasePresenter();

	observerlist.add(presenter);
	observerlist.removeIndex(2);
	expect(observerlist.observers).toContainEqual(presenter);
	expect(observerlist.observers.length).toBe(1);
});

test('should return length of observer list', () => {
	const observerlist = new ObserverList();
	const presenter = new BasePresenter();

	observerlist.add(presenter);
	expect(observerlist.count()).toBe(1);
});

test('should check if class exists as an observer', () => {
	const observerlist = new ObserverList();
	const presenter = new BasePresenter();

	observerlist.add(presenter);
	expect(observerlist.exists(presenter)).toBe(true);
});

test('should check if class exists as an observer', () => {
	const observerlist = new ObserverList();
	const presenter = new BasePresenter();

	expect(observerlist.exists(presenter)).toBe(false);
});

test('should return observer at index', () => {
	const observerlist = new ObserverList();
	const presenter = new BasePresenter();

	observerlist.add(presenter);
	expect(observerlist.get(0)).toBe(presenter);
});

test('should check if class exists as an observer', () => {
	const observerlist = new ObserverList();
	const presenter = new BasePresenter();

	expect(observerlist.get(2)).toBe(undefined);
});