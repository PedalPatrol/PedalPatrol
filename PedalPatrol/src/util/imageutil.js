import { PHOTO_ENTRIES } from '../assets/static/entries';

const FILE_EXTENSION = '.jpg';
const DEFAULT_IMAGE = 'https://i.imgur.com/Fwx1TXQ.png';
const FIREBASE_URL = 'https://firebasestorage.googleapis.com';
const NUMBER_OF_IMAGES = PHOTO_ENTRIES.length;

/**
 * Image utility class for helping with image handling. 
 */
class ImageUtility {

	/**
	 * Checks the number of defaults with the length of the uploaded images and the allowed number of images.
	 *
	 * @param {Number} num_defaults - The number of defaults found
	 * @param {List} uploaded_images - The list of uploaded images
	 * @return {Boolean} true: If the number of defaults found is conversely related to the number of uploaded images based on the allowed number of images; false: otherwise
	 */
	checkNumDefaults(num_defaults, uploaded_images) {
		 return (NUMBER_OF_IMAGES-num_defaults === uploaded_images.length);
	}

	/**
	 * Checks if an image has already been uploaded by checking if it contains the firebase url.
	 *
	 * @param {string} image - An image url to check. Might be an object if image is trying to be uploaded
	 * @return {Boolean} true: If the image has already been uploaded; false: otherwise
	 */
	isAlreadyUploaded(image) {
		return image.hasOwnProperty('uri') ? false : image.startsWith(FIREBASE_URL);
	}

	/**
	 * Checks if the image supplied is the set default image.
	 *
	 * @param {string} image - An image link
	 * @return {Boolean} true: if the image is the default image; false: otherwise
	 */
	isDefaultImage(image) {
		return image === DEFAULT_IMAGE;
	}

	/**
	 * Returns the photo entries.
	 * 
	 * @return {Object} The photo entries
	 */
	getPhotoEntries() {
		return PHOTO_ENTRIES;
	}

	/**
	 * Returns the current date and time in milliseconds.
	 * 
	 * @return {Number} The date and time in milliseconds
	 */
	getDateTime() {
		return (new Date()).getTime();
	}

	/**
	 * Checks whether the image list is valid using an overly complex set of logical comparisons.
	 * Really not needed but all these cases came up and proved to be a problem.
	 *
	 * @return {Boolean} true: If valid; false: otherwise 
	 */
	checkImageListValid(imagelist) {
		return (typeof imagelist !== 'undefined' && imagelist != undefined && imagelist != null && imagelist != [] && imagelist.length !== 0);
	}

	/**
	 * Returns the defined file extension for images.
	 *
	 * @return {string} The file extension (default '.jpg')
	 */
	getFileExtension() {
		return FILE_EXTENSION;
	}

	/**
	 * Checks if all the images are default images
	 *
	 * @param {List} images - A list of images
	 * @return {Boolean} true: if all the images are the default image; false: if any one of them is not
	 */
	checkPhotosForDefaults(images) {
		let all_defaults = true;
		for (let i=0; i < images.length; i++) {
			// AND the validity of the image with the previous result
			all_defaults &= (images[i].illustration === DEFAULT_IMAGE || images[i].illustration == undefined);
		}
		
		return !!all_defaults; // !! converts to boolean
	}


	/**
	 * Forms the thumbnail into a useable list of objects.
	 * 
	 * @param {List} thumbnails - A list of thumbnails with links
	 * @return {List} A list of thumbnail objects with an 'illustration' property
	 */
	formThumbnail(thumbnails) {
		let formedThumbnails = [];
		for (let i=0; i < thumbnails.length; i++) {
			// Need to form the thumbnail property for the carousel
			formedThumbnails.push({illustration: thumbnails[i]});
		}
		return formedThumbnails;
	}

	/**
	 * Add remaining defaults to the list of thumbnails for editing purposes.
	 *
	 * @param {List} thumbnails - A list of thumbnails
	 * @return {List} A list of thumbnails of length NUMBER_OF_IMAGES with defaults
	 */
	addRemainingDefaults(thumbnails) {
		const defaults_remaining = NUMBER_OF_IMAGES - thumbnails.length;
		const default_thumbnail = {illustration: DEFAULT_IMAGE};
		for (let i=0; i < defaults_remaining; i++) {
			thumbnails.push(default_thumbnail);
		}
		return thumbnails;
	}

	/**
	 * Return the default photo entries.
	 *
	 * @return {List} A list of objects with the property 'illustration' that contains the uri
	 */
	getDefaultPhotos() {
		return JSON.parse(JSON.stringify(this.getPhotoEntries()));
	}
}

const ImageUtil = new ImageUtility();
export default ImageUtil;