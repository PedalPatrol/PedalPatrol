import { NavigationActions } from 'react-navigation';
import TimeUtil from '../util/timeutility';

/**
 * Class for navigation service to facilitate navigating outside of the root stack navigator.
 */
class NavigationService {
	/**
	 * Creates an instance of NavigationService.
	 *
	 * @constructor
	 */
	constructor() {
		this._navigator = null;
	}

	/**
	 * Sets the top level constructor.
	 *
	 * @param {Object} navigatorRef - A reference to the top level navigator
	 */
	setTopLevelNavigator(navigatorRef) {
		this._navigator = navigatorRef;
	}

	/**
	 * Navigate to a specific route. The key property makes sure the component remounts if it has already mounted 
	 * because it is technically a new component.
	 *
	 * @param {string} routeName - A specific route defined in navigation.js
	 * @param {Object} params - Parameters for the component being navigated to
	 */
	navigate(routeName, params) {
		this._navigator.dispatch(
			NavigationActions.navigate({
				routeName,
				params,
				key: routeName + TimeUtil.getDateTime()
			})
		);
	}
}

const NavigatorService = new NavigationService();
export default NavigatorService;