export default class BasePresenter {

	constructor() {
		this.state = {}
	}

	onChange = () => {
		this.setState(this.state) // dumb easy: triggers render
	}

	componentWillMount = () => {
		this.stores && this.stores.forEach(store => {
		  // each store has a common change event to subscribe to
		  store.on('change', this.onChange)
		})
	}

	componentWillUnmount = () => {
		this.stores && this.stores.forEach(store => {
		  store.off('change', this.onChange)
		})
	}
}
