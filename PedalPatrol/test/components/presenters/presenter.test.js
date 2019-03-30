import BasePresenter from '@/src/components/presenters/presenter';

const BaseP = new BasePresenter();

test('should throw error when calling update', () => {
	expect(BaseP.update.bind(this, null)).toThrow();
});

test('should throw error when calling onUpdated', () => {
	expect(BaseP.onUpdated.bind(this, null)).toThrowError(new Error("Method must be implemented"));
});

test('should throw error when calling getData', () => {
	expect(BaseP.getData.bind(this)).toThrowError(new Error("Method must be implemented"));
});