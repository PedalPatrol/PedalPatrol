import { ProfileM } from '../components/models/export-models';
import ImageUtil from './imageutil';

/**
 * Class to help with the facilitation of the side drawer.
 * The drawer cannot be accessed across components so this class allows the drawer to register itself and be used.
 */
class DrawerHelper {
	/**
	 * Creates an instance of the DrawerHelper.
	 * 
	 * @constructor
	 */
	constructor() {
		this.drawer = null;
		this.defaultProfilePicture = ImageUtil.getDefaultImage(ImageUtil.getTypes().PROFILE);
	}

	getDefaultProfile() {
		return this.defaultProfilePicture;
	}

	/**
	 * Checks if the drawer view exists.
	 *
	 * @return {Boolean} true: if the drawer exists; false: otherwise
	 */
	drawerExists() {
		return this.drawer != null;
	}

	/**
	 * Sets the attribute drawer to the passed in drawer.
	 * 
	 * @param {Class} drawer - An instance of the SideDrawer class
	 */
	setDrawer(drawer) {
		this.drawer = drawer;
	}

	/**
	 * Returns the stored instance of the side drawer
	 * 
	 * @return {Class} An instance of the SideDrawer class
	 */
	getDrawer() {
		return this.drawer;
	}

	/**
	 * Checks if the drawer instance exists, and if it does, toggles the side drawer.
	 */
	toggle() {
		if (this.drawerExists()) {
			this.drawer.toggleDrawer();
		}
	}

	/**
	 * Opens the drawer if it exists and adds the number of notifications if it exists.
	 *
	 * @param {Number} numNotifications - The number of notifications
	 */
	openDrawer(numNotifications) {
		if (this.drawerExists()) {
			this.fetchProfileImageFromStorage();
			this.drawer.openDrawer(numNotifications);
		}
	}

	/**
	 * Closes the drawer if it exists.
	 */
	closeDrawer() {
		if (this.drawerExists()) {
			this.drawer.closeDrawer();
		}
	}

	fetchProfileImageFromStorage() {
		ProfileM.getProfilePicture((result) => {
			let default_data = result;
			if (!result) {
				default_data = { profilePicture: this.defaultProfilePicture, full_name: '' };
			}
			this.drawer.setState({profileData: default_data});
		});
	}
}

const DrawerHelp = new DrawerHelper();
export default DrawerHelp;