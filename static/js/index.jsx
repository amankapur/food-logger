import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import MealListTable from './components/MealList';
import TopNav from './components/TopNav';

import style from '../css/app.scss'

const App = (
	<div id="container" className="d-flex justify-content-center">
		<TopNav />
		<BrowserRouter >
			<div id="content">
				<Route path='/' component={MealListTable} />
				{/*<Route path='/meal/:meal_id' component={Meal} />*/}
			</div>
		</BrowserRouter>
	</div>
)

ReactDOM.render(App, document.getElementById("content"));
