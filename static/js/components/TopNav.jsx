import React, { Component } from 'react';

export default class TopNav extends Component {
	constructor(props) {
		super(props)
	}


	render() {
		return (
			<nav id="top-nav" className="navbar navbar-expand-lg navbar-light bg-light">
			  <a className="navbar-brand" href="/home">Food Logger</a>
			  <div className="collapse navbar-collapse" id="navbarSupportedContent">
			    <ul className="navbar-nav mr-auto">
			      <li className="nav-item active">
			        <a className="nav-link" href="/home">Home</a>
			      </li>
			      <li className="nav-item active pull-right">
			        <a className="nav-link" href="/auth/logout">Logout</a>
			      </li>
			    </ul>
			  </div>
			</nav>
    )
  }
}
