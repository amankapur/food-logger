import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';

import style from '../css/auth.scss'


const App = (
	<div>
		<h1> Main App </h1>
		<BrowserRouter >
			<div>
				<Route path='/auth/signup' component={Signup} />
				<Route path='/auth/login' component={Login} />
			</div>
		</BrowserRouter>
	</div>
)

ReactDOM.render(App, document.getElementById("content"));
