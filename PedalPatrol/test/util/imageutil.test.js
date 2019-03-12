import ImageUtil from '@/src/util/imageutil';

const DEFAULT_IMAGE = 'https://i.imgur.com/Fwx1TXQ.png';

test('should check number of defaults', () => {
	const images0 = [];
	const images1 = [1];
	const images4 = [1, 2, 3, 4];
	const images5 = [1, 2, 3, 4, 5];

	expect(ImageUtil.checkNumDefaults(0, images5)).toBe(true);
	expect(ImageUtil.checkNumDefaults(5, images5)).toBe(false);
	expect(ImageUtil.checkNumDefaults(1, images4)).toBe(true);
	expect(ImageUtil.checkNumDefaults(1, images1)).toBe(false);
	expect(ImageUtil.checkNumDefaults(0, images0)).toBe(false);
	expect(ImageUtil.checkNumDefaults(5, images0)).toBe(true);
});

test('should check if already uploaded', () => {
	const imageWithURI = {uri: 'test'};
	const imageWithFirebase = 'https://firebasestorage.googleapis.com/someimagelinkhere.jpg';
	const imageWithPartFirebase = 'https://firebasestorage';

	expect(ImageUtil.isAlreadyUploaded(imageWithURI)).toBe(false);
	expect(ImageUtil.isAlreadyUploaded(imageWithFirebase)).toBe(true);
	expect(ImageUtil.isAlreadyUploaded(DEFAULT_IMAGE)).toBe(false);
	expect(ImageUtil.isAlreadyUploaded('')).toBe(false);
});

test('should check if default image', () => {
	const other_image = 'https://firebasestorage.googleapis.com/someimagelinkhere.jpg';
	const null_image = null;
	const undefined_image = undefined;
	const no_image = '';

	expect(ImageUtil.isDefaultImage(DEFAULT_IMAGE)).toBe(true);
	expect(ImageUtil.isDefaultImage(other_image)).toBe(false);
	expect(ImageUtil.isDefaultImage(null_image)).toBe(false);
	expect(ImageUtil.isDefaultImage(undefined_image)).toBe(false);
	expect(ImageUtil.isDefaultImage(no_image)).toBe(false);
});

test('should check if image list is valid', () => {
	expect(ImageUtil.checkImageListValid(null)).toBe(false);
	expect(ImageUtil.checkImageListValid(undefined)).toBe(false);
	expect(ImageUtil.checkImageListValid([])).toBe(false);
	expect(ImageUtil.checkImageListValid([0])).toBe(true);
});

test('should check images for defaults', () => {
	let images = [
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE},
	];

	expect(ImageUtil.checkPhotosForDefaults(images)).toBe(true);
	images[0].illustration = 'other image';
	expect(ImageUtil.checkPhotosForDefaults(images)).toBe(false);
	images[0].illustration = undefined;
	expect(ImageUtil.checkPhotosForDefaults(images)).toBe(true);
	images = [];
	expect(ImageUtil.checkPhotosForDefaults(images)).toBe(true);
	images = [{illustration: 'other image'}];
	expect(ImageUtil.checkPhotosForDefaults(images)).toBe(false);
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
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE}
	];
	const formedThumbnails1 = [
		image,
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE},
		{illustration: DEFAULT_IMAGE}
	];
	const formedThumbnails4 = [
		image,
		image,
		image,
		image,
		{illustration: DEFAULT_IMAGE}
	];
	const formedThumbnails5 = [
		image,
		image,
		image,
		image,
		image
	];

	expect(ImageUtil.addRemainingDefaults([])).toEqual(formedThumbnails0);
	expect(ImageUtil.addRemainingDefaults([image])).toEqual(formedThumbnails1);
	expect(ImageUtil.addRemainingDefaults([image, image, image, image])).toEqual(formedThumbnails4);
	expect(ImageUtil.addRemainingDefaults([image, image, image, image, image])).toEqual(formedThumbnails5);
});