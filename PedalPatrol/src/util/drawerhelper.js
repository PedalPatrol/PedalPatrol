/**
 * Class to help with the facilitation of the side drawer.
 */
class DrawerHelper {
	/**
	 * Creates an instance of the DrawerHelper.
	 * 
	 * @constructor
	 */
	constructor() {
		this.drawer = null;
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
}

export default DrawerHelp = new DrawerHelper();