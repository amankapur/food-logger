
const Modal = {
	getInitialState: () => {
		return {
			'open': false,
			'loading': false
		}
	},
	reducer: (state=Modal.getInitialState(), action) => {
		switch (action.type) {
			case 'OPEN_MODAL':
				return {
					...state,
					'open': true
				}
			case 'CLOSE_MODAL':
				return {
					...state,
					'open': false
				}
			case 'SET_LOADING':
				return {
					...state,
					'loading': true
				}
			case 'UNSET_LOADING':
				return {
					...state,
					'loading': false
				}
			default:
				return state
		}
	},
	actions: {
		open: () => {
			return {
				type: 'OPEN_MODAL'
			}
		},
		close: () => {
			return {
				type: 'CLOSE_MODAL'
			}
		},
		loading: (val) => {
			let s = val ? 'SET' : 'UNSET'
			return {
				type: s + '_LOADING'
			}
		}
	}
}
export {Modal}
