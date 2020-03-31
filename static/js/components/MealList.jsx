import React, { Component } from 'react'
import $ from 'jquery'
import _ from 'underscore'
import Modal from '../util/Modal'
import Icons from '../util/Icons'
import Loading from '../util/Loading'
import Meal from './Meal'

export default class MealList extends Component {

	get_list() {
		const self = this
		$.get({
			url: '/meallist',
			success: (data) => {
				console.log('successfully fetched meal list')
				console.log(data['data'])
				self.setState({
					loading: false,
					mealList: data['data']
				})
			},
			fail: (data) => {
				console.log('error fetching meal list')
				console.log(data)
			}
		})
	}

	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			mealList: [],
			mealID: null,
			expanded: []
		}
		this.get_list()
		this.listChange = this.listChange.bind(this)
		this.closeMeal = this.closeMeal.bind(this)
	}

	listChange(data) {
		this.setState({
			loading: false,
			mealList: data,
		})
	}

	closeMeal() {
		this.state['mealID'] = null
		this.setState(this.state)
	}

	deleteMeal(id) {
		const self = this
		return (e) => {
			e.preventDefault()
			e.stopPropagation()
			return $.post({
				url: '/delete_meal/' + id,
				success: (data) => {
					console.log('successfully deleted meal')
					self.listChange(data['data'])
				}
			})
		}
	}
	editMeal(id) {
		const self = this
		return (e) => {
			e.preventDefault()
			e.stopPropagation()
			self.state['mealID'] = id
			self.setState(self.state)
		}
	}
	toggleExpand(meal) {
		return () => {
			if (this._isExpanded(meal)) {
				this.state.expanded = _.without(this.state.expanded, meal.id)
			} else{
				this.state.expanded.push(meal.id)
			}
			this.setState(this.state)
		}
	}
	_isExpanded(meal) {
		return _.indexOf(this.state.expanded, meal.id) != -1
	}

	getMainRow(meal) {

		return (
			<tr className="pointer" key={meal.id} onClick={this.toggleExpand(meal)}>
				<td>{this._isExpanded(meal) ? Icons.down() : Icons.right()} {meal.id}</td>
				<td>{meal.date}</td>
				<td>{meal['meal-name']}</td>
				<td>{meal['total-calories']}</td>
				<td>
					<span className="icon-tray">
						<span className="icon" onClick={this.deleteMeal(meal.id)}>
							{Icons.trash()}
						</span>
						<span className="icon" onClick={this.editMeal(meal.id)}>
							{Icons.edit()}
						</span>
					</span>
				</td>
			</tr>
		)
	}

	getExpandedRow(fooditem) {
		let key = fooditem['meal-id'] + '.' + fooditem.id
		return (
			<tr key={key} className="inner">
				<td></td>
				<td></td>
				<td>{fooditem['food-name']}</td>
				<td>{fooditem.calories + ' (' + fooditem['portion-size'] + ')'}</td>
				<td></td>
			</tr>
		)
	}
	getTrList() {
		let list = []
		_.each(this.state.mealList, (meal) => {
			list.push(this.getMainRow(meal))

			if (this._isExpanded(meal)) {
				_.each(meal.fooditems, (fooditem) => {
					list.push(this.getExpandedRow(fooditem))
				})
			}
		})
		return list
	}

	render() {
		return (
			<div>
				<Loading show={this.state.loading}/>
				<div className={this.state.loading ? "spinner-overlay" : ''}>
					<table className="table">
						<thead>
							<tr>
								<th>#</th>
								<th>Meal Date</th>
								<th>Meal Name</th>
								<th>Total Calories</th>
								<th/>
							</tr>
							</thead>
							<tbody>
							{this.getTrList()}
							</tbody>
						</table>
						<Meal changeCallback={this.listChange}
								  hideCallback={this.closeMeal}
								  id={this.state.mealID}/>
				</div>
			</div>
		)
	}
}
