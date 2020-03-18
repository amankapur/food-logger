import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';

import style from '../css/auth.scss'

const AuthComp = (
	<div>
		<h1> Food Logger </h1>
		<BrowserRouter >
			<div id="login-box">
				<Route path='/auth/signup' component={Signup} />
				<Route path='/auth/login' component={Login} />
			</div>
		</BrowserRouter>
	</div>
)

ReactDOM.render(AuthComp, document.getElementById("login-content"));
