import React, {Component} from 'react';

export default class Loading extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		let klass = this.props.show ? "spinner-border" : ''
		let contentClass = this.props.show ? "spinner-overlay" : ''
		return (
			<div>
				<div className={klass}/>
				<div className={contentClass}>
					{this.props.children}
				</div>
			</div>
		)
	}

}
