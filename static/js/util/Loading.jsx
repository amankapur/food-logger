import React, {Component} from 'react';

export default class Loading extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		if (!this.props.show) {
			return null
		}

		return (
			<div className="spinner-border" role="status">
				<span className="sr-only">Loading...</span>
			</div>
		)
	}

}
