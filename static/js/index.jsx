import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import MealListTable from './components/MealList';
import TopNav from './components/TopNav';
import rootReducer from './reducers/index'
import {Provider} from 'react-redux'
import style from '../css/app.scss'
import { createStore, applyMiddleware } from 'redux'
import thunk from "redux-thunk";


const App = (
	<Provider store={createStore(rootReducer, applyMiddleware(thunk))}>
		<div id="container" className="d-flex justify-content-center">
			<TopNav />
			<BrowserRouter >
				<div id="content">
					<Route path='/' component={MealListTable} />
				</div>
			</BrowserRouter>
		</div>
	</Provider>
)

ReactDOM.render(App, document.getElementById("content"));
