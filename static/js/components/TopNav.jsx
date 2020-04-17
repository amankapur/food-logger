import React, { Component } from 'react';

export default class TopNav extends Component {
	constructor(props) {
		super(props)
	}


	render() {
		return (
			<nav id="top-nav" className="navbar navbar-light bg-light ">
			  <a className="navbar-brand" href="/home">Food Logger</a>
		    <ul className="navbar-nav ml-auto">
		      <li className="nav-item active">
		        <a className="nav-link" href="/auth/logout">Logout</a>
		      </li>
		    </ul>
			</nav>
    )
  }
}
