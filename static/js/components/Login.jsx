import React, { Component } from 'react';
import $ from 'jquery'
import { Link } from 'react-router-dom';

export default class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			email: '',
			password: ''
		}
		this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.submitForm = this.submitForm.bind(this)
	}

	setEmail(e) {
		this.setState({email: e.target.value})
	}

	setPassword(e) {
		this.setState({password: e.target.value})
	}

	submitForm(e) {
		e.preventDefault()
		$.post({
			url: '/auth/login',
			dataType: 'json',
			data: this.state,
			success: (data) => {
				window.location = data['redirect_to']
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
				<h2> Login </h2>
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
				<Link to="/auth/signup/">
					<button className="btn btn-primary">Sign Up</button>				
				</Link>
			</form>
     )
  }
}
