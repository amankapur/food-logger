import React, { Component } from 'react'


export default class If extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		if (this.props.show) {
			return this.props.children
		}
		return null
	}
}
