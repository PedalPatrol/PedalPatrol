import ImageUtil from '@/src/util/imageutility';

const BIKE_DEFAULT_IMAGE = 'https://i.imgur.com/Fwx1TXQ.png';
const PROFILE_DEFAULT_IMAGE = 'http://chittagongit.com//images/default-user-icon/default-user-icon-8.jpg';
const BIKE_TYPE = ImageUtil.getTypes().BIKE;
const PROFILE_TYPE = ImageUtil.getTypes().PROFILE;

test('should check number of defaults', () => {
	const images0 = [];
	const images1 = [1];
	const images4 = [1, 2, 3, 4];
	const images5 = [1, 2, 3, 4, 5];

	expect(ImageUtil.checkNumDefaults(BIKE_TYPE, 0, images5)).toBe(true);
	expect(ImageUtil.checkNumDefaults(BIKE_TYPE, 5, images5)).toBe(false);
	expect(ImageUtil.checkNumDefaults(BIKE_TYPE, 1, images4)).toBe(true);
	expect(ImageUtil.checkNumDefaults(BIKE_TYPE, 1, images1)).toBe(false);
	expect(ImageUtil.checkNumDefaults(BIKE_TYPE, 0, images0)).toBe(false);
	expect(ImageUtil.checkNumDefaults(BIKE_TYPE, 5, images0)).toBe(true);
});

test('should check if already uploaded', () => {
	const imageWithURI = {uri: 'test'};
	const imageWithFirebase = 'https://firebasestorage.googleapis.com/someimagelinkhere.jpg';
	const imageWithPartFirebase = 'https://firebasestorage';

	expect(ImageUtil.isAlreadyUploaded(imageWithURI)).toBe(false);
	expect(ImageUtil.isAlreadyUploaded(imageWithFirebase)).toBe(true);
	expect(ImageUtil.isAlreadyUploaded(BIKE_DEFAULT_IMAGE)).toBe(false);
	expect(ImageUtil.isAlreadyUploaded('')).toBe(false);
});

test('should check if default image', () => {
	const other_image = 'https://firebasestorage.googleapis.com/someimagelinkhere.jpg';
	const null_image = null;
	const undefined_image = undefined;
	const no_image = '';

	expect(ImageUtil.isDefaultImage(BIKE_TYPE, BIKE_DEFAULT_IMAGE)).toBe(true);
	expect(ImageUtil.isDefaultImage(BIKE_TYPE, other_image)).toBe(false);
	expect(ImageUtil.isDefaultImage(BIKE_TYPE, null_image)).toBe(false);
	expect(ImageUtil.isDefaultImage(BIKE_TYPE, undefined_image)).toBe(false);
	expect(ImageUtil.isDefaultImage(BIKE_TYPE, no_image)).toBe(false);
});

test('should check if image list is valid', () => {
	expect(ImageUtil.checkImageListValid(null)).toBe(false);
	expect(ImageUtil.checkImageListValid(undefined)).toBe(false);
	expect(ImageUtil.checkImageListValid([])).toBe(false);
	expect(ImageUtil.checkImageListValid([0])).toBe(true);
});

test('should check images for defaults', () => {
	let images = [
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE},
	];

	expect(ImageUtil.checkPhotosForDefaults(BIKE_TYPE, images)).toBe(true);
	images[0].illustration = 'other image';
	expect(ImageUtil.checkPhotosForDefaults(BIKE_TYPE, images)).toBe(false);
	images[0].illustration = undefined;
	expect(ImageUtil.checkPhotosForDefaults(BIKE_TYPE, images)).toBe(true);
	images = [];
	expect(ImageUtil.checkPhotosForDefaults(BIKE_TYPE, images)).toBe(true);
	images = [{illustration: 'other image'}];
	expect(ImageUtil.checkPhotosForDefaults(BIKE_TYPE, images)).toBe(false);
});

test('should form thumbnail properly', () => {
	const thumbnails = ['0', '1', '2', '3'];
	const formedThumbnails = [
		{illustration: '0'},
		{illustration: '1'},
		{illustration: '2'},
		{illustration: '3'}
	];

	expect(ImageUtil.formThumbnail(thumbnails)).toEqual(formedThumbnails);
	expect(ImageUtil.formThumbnail([])).toEqual([]);
});

test('should add remaining defaults', () => {
	const image = {illustration: '0'};

	const formedThumbnails0 = [
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE}
	];
	const formedThumbnails1 = [
		image,
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE},
		{illustration: BIKE_DEFAULT_IMAGE}
	];
	const formedThumbnails4 = [
		image,
		image,
		image,
		image,
		{illustration: BIKE_DEFAULT_IMAGE}
	];
	const formedThumbnails5 = [
		image,
		image,
		image,
		image,
		image
	];

	expect(ImageUtil.addRemainingDefaults(BIKE_TYPE, [])).toEqual(formedThumbnails0);
	expect(ImageUtil.addRemainingDefaults(BIKE_TYPE, [image])).toEqual(formedThumbnails1);
	expect(ImageUtil.addRemainingDefaults(BIKE_TYPE, [image, image, image, image])).toEqual(formedThumbnails4);
	expect(ImageUtil.addRemainingDefaults(BIKE_TYPE, [image, image, image, image, image])).toEqual(formedThumbnails5);
});

test('should return image types', () => {
	expect(ImageUtil.getTypes()).not.toEqual(null);
	expect(ImageUtil.getTypes().BIKE).toBe('BIKE');
	expect(ImageUtil.getTypes().PROFILE).toBe('PROFILE');
});

test('should return a constant for an image type', () => {
	expect(ImageUtil.getTypeConstant(BIKE_TYPE, 2)).toBe(5);
	expect(ImageUtil.getTypeConstant(PROFILE_TYPE, 2)).toBe(1);
});

test('should return default photo', () => {
	expect(ImageUtil.getDefaultImage(BIKE_TYPE)).toBe(BIKE_DEFAULT_IMAGE);
	expect(ImageUtil.getDefaultImage(PROFILE_TYPE)).toBe(PROFILE_DEFAULT_IMAGE);
});

test('should return .jpg file extension', () => {
	expect(ImageUtil.getFileExtension()).toBe('.jpg');
});