import React, { Component } from 'react';
import $ from 'jquery'

export default class Signup extends Component {
	constructor(props) {
		super(props)

		this.state = {
			email: '',
			password: '',
			name: ''
		}
		this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setName = this.setName.bind(this);

    this.submitForm = this.submitForm.bind(this)
	}

	setEmail(e) {
		this.setState({email: e.target.value})
	}

	setPassword(e) {
		this.setState({password: e.target.value})
	}

	setName(e) {
		this.setState({name: e.target.value})
	}

	submitForm(e) {
		e.preventDefault()
		$.post({
			url: '/auth/signup',
			dataType: 'json',
			data: this.state,
			success: (data) => {
				window.location = "/auth/login"
			},
			fail: (data) => {
				console.log(data)
				console.log('fail')
			}

		})
	}

	render() {
		return (
			<form>
				<h2> Signup </h2>
				<div className="form-group">
					<label >Name</label>
					<input type="name"
								className="form-control"
								placeholder="Enter name"
								value={this.state.name}
								onChange={this.setName}/>
				</div>
				<div className="form-group">
					<label >Email address</label>
					<input type="email"
								className="form-control"
								placeholder="Enter email"
								value={this.state.email}
								onChange={this.setEmail}/>
				</div>
				<div className="form-group">
					<label >Password</label>
					<input type="password"
								className="form-control"
								placeholder="Password"
								value={this.state.password}
								onChange={this.setPassword}/>
				</div>
				<button type="submit"
								onClick={this.submitForm}
								className="btn btn-primary">Submit</button>
			</form>
     )
  }
}
