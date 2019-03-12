import BikeDetailsPresenter from '@/src/components/presenters/bikedetails-presenter';
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


const view = new TestView();
const bikedetailspresenter = new BikeDetailsPresenter(view);

test('should translate object data', () => {
	const dataIn = {	
		brand: "brand_test",
		colour: ["colour_test"],
		dataID: 3,
		datetime: "00:00 - 00/00/00",
		found: true,
		frame_size: "frame_test",
		id: "-L_Zx7Tgmjqq72xFB5Gf",
		milliseconds: 1552176941250,
		model: "model_test",
		name: "name_test",
		notable_features: "nf_test",
		owner: "8RgSz68DONPFOZL9cni3nBkYHNU2",
		serial_number: "6958695769",
		stolen: true,
		thumbnail: ["https://firebasestorage/1.jpg", "https://firebasestorage/2.jpg", "https://firebasestorage/3.jpg"],
		timeago: "2 days ago",
		wheel_size: "30"
	};

	// id is based off of the position in dataIn
	const dataOut = [
		{title: "Name: ", text: "name_test", id: "9"},
		{title: "Serial Number: ", text: "6958695769", id: "12"},
		{title: "Timeago: ", text: "2 days ago", id: "15"},
		{title: "Datetime: ", text: "00:00 - 00/00/00", id: "3"},
		{title: "Model: ", text: "model_test", id: "8"},
		{title: "Brand: ", text: "brand_test", id: "0"},
		{title: "Colour: ", text: "colour_test", id: "1"},
		{title: "Frame Size: ", text: "frame_test", id: "5"},
		{title: "Wheel Size: ", text: "30", id: "16"},
		{title: "Notable Features: ", text: "nf_test", id: "10"}
	];

	const thumbnailOut = [
		{illustration: "https://firebasestorage/1.jpg"},
		{illustration: "https://firebasestorage/2.jpg"},
		{illustration: "https://firebasestorage/3.jpg"}
	];

	expect(bikedetailspresenter.translateData(dataIn)).toEqual({formedData: dataOut, thumbnail: thumbnailOut});
	expect(bikedetailspresenter.translateData({})).toEqual({formedData: [], thumbnail: []});
});

test('should reorder data based on function definition', () => {
	const dataIn = [
		{title: "Notable Features: ", text: "nf_test", id: "10"},
		{title: "Serial Number: ", text: "6958695769", id: "12"},
		{title: "Name: ", text: "name_test", id: "9"},
		{title: "Datetime: ", text: "00:00 - 00/00/00", id: "3"},
		{title: "Wheel Size: ", text: "30", id: "16"},
		{title: "Timeago: ", text: "2 days ago", id: "15"},
		{title: "Brand: ", text: "brand_test", id: "0"},
		{title: "Colour: ", text: "colour_test", id: "1"},
		{title: "Model: ", text: "model_test", id: "8"},
		{title: "Frame Size: ", text: "frame_test", id: "5"},
	];

	// id is based off of the position in dataIn
	const dataOut = [
		{title: "Name: ", text: "name_test", id: "9"},
		{title: "Serial Number: ", text: "6958695769", id: "12"},
		{title: "Timeago: ", text: "2 days ago", id: "15"},
		{title: "Datetime: ", text: "00:00 - 00/00/00", id: "3"},
		{title: "Model: ", text: "model_test", id: "8"},
		{title: "Brand: ", text: "brand_test", id: "0"},
		{title: "Colour: ", text: "colour_test", id: "1"},
		{title: "Frame Size: ", text: "frame_test", id: "5"},
		{title: "Wheel Size: ", text: "30", id: "16"},
		{title: "Notable Features: ", text: "nf_test", id: "10"}
	];

	expect(bikedetailspresenter.reorderData(dataIn)).toEqual(dataOut);
	expect(bikedetailspresenter.reorderData([])).toEqual([]);
});

test('should find element if it exists', () => {
	const dataIn = [
		{title: "Name: ", text: "name_test", id: "9"},
		{title: "Serial Number: ", text: "6958695769", id: "12"},
		{title: "Timeago: ", text: "2 days ago", id: "15"},
		{title: "Datetime: ", text: "00:00 - 00/00/00", id: "3"},
		{title: "Model: ", text: "model_test", id: "8"},
		{title: "Brand: ", text: "brand_test", id: "0"},
		{title: "Colour: ", text: "colour_test", id: "1"},
		{title: "Frame Size: ", text: "frame_test", id: "5"},
		{title: "Wheel Size: ", text: "30", id: "16"},
		{title: "Notable Features: ", text: "nf_test", id: "10"}
	];

	expect(bikedetailspresenter.findElement(dataIn, 'Name')).toEqual({title: "Name: ", text: "name_test", id: "9"});
	expect(bikedetailspresenter.findElement(dataIn, 'Test')).toEqual(undefined);
	expect(bikedetailspresenter.findElement(dataIn, null)).toEqual(undefined);
});

test('should convert text to title case', () => {
	expect(bikedetailspresenter.convertCase('title name')).toBe('Title Name');
	expect(bikedetailspresenter.convertCase('title_name')).toBe('Title_name');
	expect(bikedetailspresenter.convertCase('title')).toBe('Title');
	expect(bikedetailspresenter.convertCase('Title')).toBe('Title');
	expect(bikedetailspresenter.convertCase(null)).toBe('');
});