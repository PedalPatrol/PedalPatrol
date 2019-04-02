import { BIKE_PHOTO_ENTRIES, PROFILE_PHOTO_ENTRIES, BIKE_DEFAULT_IMAGE, PROFILE_DEFAULT_IMAGE } from '../assets/static/entries';

/**
 * Image utility class for helping with image handling. 
 */
class ImageUtility {

	/**
	 * Checks the number of defaults with the length of the uploaded images and the allowed number of images.
	 *
	 * @param {string} type - The type of image constant requested (e.g. BIKE, PROFILE, etc.)
	 * @param {Number} num_defaults - The number of defaults found
	 * @param {List} uploaded_images - The list of uploaded images
	 * @return {Boolean} true: If the number of defaults found is conversely related to the number of uploaded images based on the allowed number of images; false: otherwise
	 */
	checkNumDefaults(type, num_defaults, uploaded_images) {
		 return (this.getTypeConstant(type, TYPE_CONSTANTS.indices.NUMBER_OF_IMAGES)-num_defaults === uploaded_images.length);
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
	 * Returns the possible image types.
	 *
	 * @return {Object} An object of strings
	 */
	getTypes() {
		return TYPE_NAMES;
	}

	/**
	 * Returns the constant associated with a particular image type and index.
	 *
	 * @param {string} type - The type of image constant requested (e.g. BIKE, PROFILE, etc.)
	 * @param {Number} index - The index of the constant in TYPE_CONSTANTS
	 * @return {string/Number} The constant associated with the type and index
	 */
	getTypeConstant(type, index) {
		return TYPE_CONSTANTS[type][index];
	}

	/**
	 * Checks if the image is the default image for an associated type.
	 *
	 * @param {string} type - The type of image constant requested (e.g. BIKE, PROFILE, etc.)
	 * @param {string} image - The url to an image
	 * @return {Boolean} true: if the image is the default image; false: otherwise
	 */
	isDefaultImage(type, image) {
		return image === this.getTypeConstant(type, TYPE_CONSTANTS.indices.DEFAULT_IMAGE);
	}

	/**
	 * Returns the default image for a specific image type.
	 *
	 * @param {string} type - The type of image constant requested (e.g. BIKE, PROFILE, etc.)
	 * @return {string} The default image for the image type
	 */	
	getDefaultImage(type) {
		return this.getTypeConstant(type, TYPE_CONSTANTS.indices.DEFAULT_IMAGE);
	}

	/**
	 * Returns the photo entries.

	 * @param {string} type - The type of image constant requested (e.g. BIKE, PROFILE, etc.)
	 * @return {Object} The photo entries
	 */
	getPhotoEntries(type) {
		return this.getTypeConstant(type, TYPE_CONSTANTS.indices.PHOTO_ENTRIES);
	}

	/**
	 * Checks whether the image list is valid using an overly complex set of logical comparisons.
	 * Really not needed but all these cases came up and proved to be a problem.
	 *
	 * @param {List} imagelist - A list of images to check
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
	 * Checks if all the images are default images.
	 *
	 * @param {string} type - The type of image constant requested (e.g. BIKE, PROFILE, etc.)
	 * @param {List} images - A list of images
	 * @return {Boolean} true: if all the images are the default image; false: if any one of them is not
	 */
	checkPhotosForDefaults(type, images) {
		let all_defaults = true;
		for (let i=0; i < images.length; i++) {
			// AND the validity of the image with the previous result
			all_defaults &= (images[i].illustration === this.getTypeConstant(type, TYPE_CONSTANTS.indices.DEFAULT_IMAGE) || images[i].illustration == undefined);
		}
		
		return !!all_defaults; // !! converts to boolean, needed to convert number to actual boolean value because errors occurred
	}


	/**
	 * Forms the thumbnail into a useable list of objects.
	 * 
	 * @param {List} thumbnails - A list of thumbnails with links
	 * @return {List} A list of thumbnail objects with an 'illustration' property
	 */
	formThumbnail(thumbnails) {
		let formedThumbnails = [];
		if (thumbnails != undefined) {
			for (let i=0; i < thumbnails.length; i++) {
				// Need to form the thumbnail property for the carousel
				formedThumbnails.push({illustration: thumbnails[i]});
			}
		}
		return formedThumbnails;
	}

	/**
	 * Add remaining defaults to the list of thumbnails for editing purposes.
	 *
	 * @param {string} type - The type of image constant requested (e.g. BIKE, PROFILE, etc.)
	 * @param {List} thumbnails - A list of thumbnails
	 * @return {List} A list of thumbnails of length NUMBER_OF_BIKE_IMAGES with defaults
	 */
	addRemainingDefaults(type, thumbnails) {
		// Number of defaults remaining is the number of images the type allows minus the number of provided images
		const defaults_remaining = this.getTypeConstant(type, TYPE_CONSTANTS.indices.NUMBER_OF_IMAGES) - thumbnails.length;
		const default_thumbnail = {illustration: this.getTypeConstant(type, TYPE_CONSTANTS.indices.DEFAULT_IMAGE)};
		for (let i=0; i < defaults_remaining; i++) {
			thumbnails.push(default_thumbnail);
		}
		return thumbnails;
	}

	/**
	 * Return the default photo entries.
	 *
	 * @param {string} type - The type of image constant requested (e.g. BIKE, PROFILE, etc.)
	 * @return {List} A list of objects with the property 'illustration' that contains the uri
	 */
	getDefaultPhotos(type) {
		return JSON.parse(JSON.stringify(this.getPhotoEntries(type)));
	}
}

const FILE_EXTENSION = '.jpg';
const FIREBASE_URL = 'https://firebasestorage.googleapis.com';
const NUMBER_OF_BIKE_IMAGES = BIKE_PHOTO_ENTRIES.length;
const NUMBER_OF_PROFILE_IMAGES = PROFILE_PHOTO_ENTRIES.length;

// Constant corresponding to property names in the TYPE_CONSTANTS object
const TYPE_NAMES = {
	BIKE: 'BIKE',
	PROFILE: 'PROFILE'
}
/*
 * The purpose of this data structure is to keep track of all the constants for different image types.
 * Different MVP components need different default images and number of images so this way we can keep track
 * of them all and keep our functions generalized.
 * To add another image type, add the name to the TYPE_NAMES object, add the corresponding string as a property
 * value in the TYPE_CONSTANTS structure and a list of the constants. Keep the list of the constants in the same
 * order as the indices indicate in the 'indices' property below.
 */
const TYPE_CONSTANTS = {
	BIKE: [
		BIKE_PHOTO_ENTRIES,
		BIKE_DEFAULT_IMAGE,
		NUMBER_OF_BIKE_IMAGES
	],
	PROFILE: [
		PROFILE_PHOTO_ENTRIES,
		PROFILE_DEFAULT_IMAGE,
		NUMBER_OF_PROFILE_IMAGES
	],
	indices: {
		PHOTO_ENTRIES: 0,
		DEFAULT_IMAGE: 1,
		NUMBER_OF_IMAGES: 2
	}
}

const ImageUtil = new ImageUtility();
export default ImageUtil;