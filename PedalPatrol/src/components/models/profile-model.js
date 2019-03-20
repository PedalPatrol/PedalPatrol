import Model from './model';
import Database from '../../util/database';
import AuthState from '../../util/authenticationstate';
import PersistStorage from '../../util/persistentstorage';
import ImageUtil from '../../util/imageutil';

const PROFILE_TYPE = ImageUtil.getTypes().PROFILE;

/**
 * Class for the Profile model to be used by the ProfilePresenter
 * @extends Model
 */
class ProfileModel extends Model {
	/**
	 * Creates an instance of ProfileModel. Sets the default callback, creates an observerlist,
	 * and registers an on read from the database.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this._callback = this._defaultCallback;

		this._data = {data: []};
		this._createObserverList();
		this._getUserDataFromDB();		
	}

	/**
	 * Default callback
	 */
	_defaultCallback(message) {
		console.log(message);
	}

	/**
	 * Set the model's callback to a new callback. This callback can be used anywhere and is usually passed in from a presenter.
	 *
	 * @param {Function} callback - A callback to run when certain code is executed
	 */
	setCallback(callback) {
		this._callback = callback;
	}

	/**
	 * Get the user ID from the database, authstate or persistent storage, then read from the database.
	 */
	_getUserDataFromDB() {
		const userID = AuthState.getCurrentUserID(); // Check this first, data might already be loaded
		if (userID == null) {
			this.checkAuthenticationState((verifiedUserID) => {
				this._readDBUserOnce(verifiedUserID);
			})
		} else {
			this._readDBUserOnce(userID);
		}
	}

	/**
	 * Read from the database once with the user id.
	 *
	 * @param {string} userID - The user's ID
	 */
	_readDBUserOnce(userID) {
		Database.readProfileDataOnce(userID, (snapshot) => {
			const retrievedData = snapshot.val();
			this._insertDataOnRead(userID, retrievedData);
			if (retrievedData != null && retrieveData != undefined) {
				this._addProfileImageLocally(userID, retrievedData.thumbnail[0]);
			}
			this._notifyAll(null); // Don't supply data to force a refresh by the presenter
		});
	}

	/**
	 * Check the authentication state of the user.
	 * TODO : Consider extracting out to AuthenticationModel
	 *
	 * @param {Function} onComplete - A callback function to call when authentication has completed
	 */
	async checkAuthenticationState(onComplete) {
		// Offline authentication check first, if it fails, then check database
		await PersistStorage.retrieveData('userToken', async (userToken) => {
			if (userToken == null || userToken == undefined) {
				// Only check database user if no user token stored
				await Database.getCurrentUser((userID) => {
					onComplete(userID);
				});	
			} else {
				onComplete(userToken);
			}
		}, (error) => {
			onComplete(null);
		});
	}

	/**
	 * Get method for presenters to get data.
	 *
	 * @return {Object} data stored in the model
	 */
	get() {
		return {...this._data} // Immutable
	}

	async getProfilePicture(callback) {
		const DEFAULT_PROFILE_IMAGE = ImageUtil.getDefaultImage(ImageUtil.getTypes().PROFILE);
		const userID = AuthState.getCurrentUserID();
		return await PersistStorage.retrieveData(userID, (retrievedImage) => {
			callback(retrievedImage)
			return retrievedImage;
		}, (error) => {
			console.log(error);
		});
	}

	/**
	 * Update method for presenters to update the model's data. Datetime and Owner are handled in database class.
	 *
	 * @param {Object} newData - New data to add
	 */
	update(newData) {
		if (newData.data.id === '' || newData.data.id == undefined) {
			newData.data.id = AuthState.getCurrentUserID();
			// This should never happen, but a fail safe just in-case
			if (newData.data.id == null || newData.data.id == undefined) {
				this._callback(false);
				return;
			}
		}

		try {
			// Check if it exists, and get index
			const {exists, index} = this._profileDataExists(newData);

			if (exists && this._checkImages(index, newData.data.thumbnail)) {
				newData.data.thumbnail = this._removeIllustrationKey(newData.data.thumbnail);
				this._insertDataOnUpdate(newData);
				this._editExistingInDatabase(newData.data, (result) => {this._callback(true); this._notifyAll(this._data);});

			} else {
				const { ProfileImages } = Database.getImageFolders();

				// Write to database
				this._writeImageToDBStorage(newData.data.id, newData.data.thumbnail, ProfileImages, (uploaded_images) => {
					newData.data.thumbnail = uploaded_images;

					// Check if there's actually images 
					if (!ImageUtil.checkImageListValid(uploaded_images)) {
						this._callback(false);
						return;
					}

					this._insertDataOnUpdate(newData);

					const funcCall = exists ? this._editExistingInDatabase : this._writeNewInDatabase;
					funcCall(newData.data, (result) => {

						this._callback(result); 
						this._notifyAll(this._data);
					});
					
					this._writeImageToAsyncStorage(newData.data.id, uploaded_images[0]);

				}, this._callback);
			}
		} catch (error) {
			console.log(error);
			this._callback(false);
		}
	}

	_writeImageToAsyncStorage(key, image) {
		PersistStorage.storeData(key, image, (error) => {console.log(error)});
	}

	/**
	 * Checks if there are new images in the bike stored vs what was passed in.
	 *
	 * @param {Number} index - The index of the bike in the local data
	 * @param {List} thumbnails - A list of thumbnails
	 * @return {Boolean} true: If the thumbnails are the same; false: If the thumbnails are different or if the bike doesn't exist
	 */
	_checkImages(index, thumbnails) {
		if (index >= 0) {
			const profile = this._data.data[index];
			return JSON.stringify(profile.thumbnail) == JSON.stringify(thumbnails);
		} else {
			return false; // Profile does not exist
		}
	}

	/**
	 * Removes the illustration key from the object and only adds the actual link.
	 *
	 * @param {List} thumbnails - A list of thumbnail objects with the property 'illustration'
	 * @return {List} A list of thumbnails
	 */
	_removeIllustrationKey(thumbnails) {
		let new_thumbnails = [];
		for (let i=0; i < thumbnails.length; i++) {
			new_thumbnails.push(thumbnails[i].illustration);
		}
		return new_thumbnails;
	}

	/**
	 * Write the image to the firebase storage and call the callbacks with the urls that were defined.
	 *
	 * @param {Number} id - The id of the profile corresponding to the image
	 * @param {List} images - A list of objects with the property 'illustration'
	 * @param {string} imagesFolder - The folder to upload images to
	 * @param {Function} onSuccess - A callback to call when an image has been successfully uploaded
	 * @param {Function} onError - A callback to call when an image has failed to upload
	 */
	_writeImageToDBStorage(id, images, imagesFolder, onSuccess, onError) {
		const FILE_EXTENSION = '.jpg';
		const DEFAULT_INDEX = 0;
		let uploaded_pictures = [];

		// If there are no images, return
		if (!ImageUtil.checkImageListValid(images)) {
			onError(false);
			return;
		}
	
		// Check if there's a default image, if so, skip it and just use the default image
		if (ImageUtil.isDefaultImage(PROFILE_TYPE, images[DEFAULT_INDEX].illustration)) {
			onSuccess([images[DEFAULT_INDEX].illustration]);
			return;
		}

		// Check if the image has already been uploaded, if it has, just skip it
		if (ImageUtil.isAlreadyUploaded(images[DEFAULT_INDEX].illustration)) {
			uploaded_pictures.push(images[DEFAULT_INDEX].illustration);
			onSuccess(uploaded_pictures);
			return;
		}

		// Name of file is the index and the file extension
		const filename = DEFAULT_INDEX + ImageUtil.getFileExtension();
		// Write image to database
		Database.writeImage(id, images[DEFAULT_INDEX].illustration, filename, imagesFolder, (url) => {
			uploaded_pictures.push(url);
			onSuccess(uploaded_pictures);
			return url;
		}, (error) => {
			console.log(error);
			onError(false);
		});

	}

	// Could generalize _writeNewInDatabase and _editExistingInDatabase into one function

	/**
	 * Write new data in database and call the function callback depending on if it was successful or not.
	 *
	 * @param {Object} newData - Data to be written to the database
	 * @param {Function} callback - A function to call on the success or failure of the call
	 */
	_writeNewInDatabase(newData, callback) {
		return Database.writeProfileData(newData, (data) => {
			// console.log(data);
			callback(typeof data !== 'undefined' && data !== undefined);
			// return typeof data !== 'undefined' && data !== undefined
			// this._callback(typeof data !== 'undefined' && data !== undefined);
		},(error) => {
			console.log(error);
			callback(false);
			// this._callback(false);
		});
	}

	/**
	 * Overwrite existing data in database and call the function callback depending on if it was successful or not.
	 *
	 * @param {Object} newData - Data to be written to the database
	 * @param {Function} callback - A function to call on the success or failure of the call
	 */
	_editExistingInDatabase(newData, callback) {
		return Database.editProfileData(newData, (data) => {
			// console.log(data);
			callback(typeof data !== 'undefined' && data !== undefined);
			// return typeof data !== 'undefined' && data !== undefined;
			// this._callback(typeof data !== 'undefined' && data !== undefined);
		},(error) => {
			console.log(error);
			callbacK(false);
			// this._callback(false);
		});
	}

	/**
	 * Insert data into the data object on an update trigger (from Presenter).
	 *
	 * @param {Object} newData - New data passed in, of the form : {data: []}
	 * @return {Boolean} true: Data was an edited value; false: Data was a new value
	 */
	_insertDataOnUpdate(newData) {
		let i = 0;

		// If only one piece, just insert it
		if (this._data.data.length === 0) {
			this._data.data.push(newData.data);
			return false;
		}

		this._data.data[0] = newData.data;  // Data found, overwrite
		return true;
	}

	/**
	 * Checks if the profile exists based on the data of the profile.
	 * 
	 * @param {Object} profileData - The data to check
	 * @return {Boolean, Number} exists: true: If the profile exists; false: otherwise. index - The index of the profile if it exists, -1 if not
	 */
	_profileDataExists(profileData) {
		return this._profileIDExists(profileData.data.id)
	}

	/**
	 * Checks if the profile exists based on the id.
	 *
	 * @param {string} id - The id of a profile
	 * @return {Boolean, Number} exists: true: If the profile exists; false: otherwise. index - The index of the profile if it exists, -1 if not
	 */
	_profileIDExists(id) {
		const exists = this._data.data[0].id === id;
		const index = exists ? 0 : -1;
		return { exists, index };
	}

	/**
	 * Checks if an object has a certain property.
	 * 
	 * @param {Object} obj - An object to check
	 * @param {string} property - The name of a property
	 * @return {Boolean} true: if the object has the property; false: otherwise
	 */
	_hasProperty(obj, property) {
		return obj.hasOwnProperty(property);
	}

	/**
	 * Insert data into the data object on a read from the database.
	 *
	 * @param {string} currentUser - The user id of the current user
	 * @param {Object} databaseData - An objects of objects containing data from the database.
	 */
	_insertDataOnRead(currentUser, databaseData) {
		let tempData = {data:[]};
		if (databaseData != null) { // Check if there are objects in the database

			// If it doesn't have an id, skip it because it isn't valid
			if (!this._hasProperty(databaseData, 'id') || currentUser == null || currentUser != databaseData.id) { 
				return;
			}

			tempData.data.push(databaseData);
			this._data = tempData;
		}
		// console.log(this._data);
	}

	async _addProfileImageLocally(userID, image) {
		const DEFAULT_PROFILE_IMAGE = ImageUtil.getDefaultImage(ImageUtil.getTypes().PROFILE);
		await PersistStorage.retrieveData(userID, (retrievedImage) => {
			if (retrievedImage === DEFAULT_PROFILE_IMAGE && image !== retrievedImage && image !== DEFAULT_PROFILE_IMAGE) {
				PersistStorage.storeData(userID, ImageUtil.getDefaultImage(ImageUtil.getTypes().PROFILE), (error) => {console.log(error)});
			}
		}, (error) => {
			console.log(error);
		});
	}
}

export default ProfileModel;