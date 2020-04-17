import React, { Component } from 'react';
import _ from 'underscore'
import { connect } from "react-redux"
import {Modal as ModalReducer} from "../reducers/modal"
import Loading from '../util/Loading'


class ModalHeader extends Component {
	render() {
		return (
			<div className={"modal-header " + (this.props.className || '')}>
				<h4 className="modal-title">{this.props.title}</h4>
				{this.props.children}
			</div>
		)
	}
}

class ModalBody extends Component {
	render() {
		return (
			<div className={"modal-body " + (this.props.className || '')}>
				{this.props.children}
			</div>
		)
	}
}

class ModalFooter extends Component {
	render() {
		return (
			<div className={"modal-footer " + (this.props.className || '')}>
				{this.props.children}
			</div>
		)
	}
}


class Modal extends Component {

	constructor(props){
		super(props)
	}

	modalAction(name) {
		return (e) => {
			e.preventDefault()
			e.stopPropagation()
			this.props.dispatch(ModalReducer.actions[name]())
		}
	}

	render() {
		let modalContent = null
		if (this.props.open) {
			modalContent = (
				<div className="modal">
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<Loading show={this.props.loading}>
								{this.props.children}
							</Loading>
						</div>
					</div>
				</div>
			)
		}

		return (
			<div>
				<button className='btn btn-outline-dark btm-small'
								onClick={this.modalAction('open')}>
					{this.props.buttonTitle}
				</button>
				{modalContent}
			</div>
		)
	}

}

const mapStateToProps = (state) => {
	return {
	  open: state.Modal.open,
	  loading: state.Modal.loading
	}
};

const ModalComp = connect(mapStateToProps)(Modal)
const ModalHeaderComp = connect(null)(ModalHeader)

export {ModalFooter, ModalHeaderComp as ModalHeader, ModalBody, ModalComp as Modal}
