import React, { Component } from 'react';
import _ from 'underscore'

export default class Modal extends Component {

	constructor(props){
		super(props)
		this.footerButtonClick = this.footerButtonClick.bind(this)
	}

	getModalClass(){
		let modal_class = 'hide'
		if (this.props.open) {
			modal_class = ''
		}
		return modal_class  + ' ' + this.props.className ? this.props.className : ''
	}
	getDialogClass() {
		let s = ''
		if (this.props.hasOwnProperty('centered')) {
			s += 'modal-dialog-centered'
		}
		return s
	}
	getFooterClass() {
		let s = ''
		if (this.props.hasOwnProperty('hide-footer') || !this.props.hasOwnProperty('footer')) {
			s += 'hide'
		}
		return s
	}
	footerButtonClick(e) {
		e.preventDefault()
		const name = e.target['name']
		const self = this

		this.props.footerCallback(name)

		if (name == 'Close') {
			this.props.hideModal()
		}

	}
	render() {
		let modalContent = null
		if (this.props.open) {
			modalContent = (
				<div className={"modal " + this.getModalClass()}>
					<div className={"modal-dialog " + this.getDialogClass()}>
						<div className="modal-content">

							<div className="modal-header">
								{this.props.header}
								<button type="button" className="close" onClick={this.props.hideModal}>&times;</button>
							</div>

							<div className="modal-body">
								{this.props.children}
							</div>

							<div className={"modal-footer " + this.getFooterClass()}>
								{_.map(this.props.footer, (name) => {
									let disabled = false
									if (name.search('-disabled') > -1) {
										name = name.split('-')[0]
										disabled = true
									}
									return (
										<button type="button"
														name={name}
														key={name}
														onClick={this.footerButtonClick}
														className="btn btn-primary"
														disabled={disabled}>{name}</button>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			)
		}

		return (
			<div>
				<div >
					<button className='btn btn-primary' onClick={this.props.showModal}>
						{this.props.buttonTitle}
					</button>
				</div>
				{modalContent}
			</div>
		)
	}

}
