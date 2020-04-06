import React, { Component } from 'react'
import _ from 'underscore'
import Modal from '../util/Modal'
import Icons from '../util/Icons'
import Loading from '../util/Loading'
import MealModal from './Meal'
import MealList from '../models/MealList'
import Meal from '../models/Meal'
import Data from '../util/Data'

export default class MealListTable extends Component {


	constructor(props) {
		super(props)

		this.listChange = this.listChange.bind(this)
		this.closeMeal = this.closeMeal.bind(this)

		this.state = {
			loading: true,
			meals: new MealList(this.listChange),
			selectedMeal: new Meal(),
			expanded: []

		}
	}

	listChange(meals) {
		this.state.meals.all = meals
		this.state.loading = false
		this.state.selectedMeal = new Meal()
		this.setState(this.state)
	}

	closeMeal() {
		console.log('before list change')
		console.log(this.state.meals.all)
		this.listChange(this.state.meals.all)
	}

	deleteMeal(meal) {
		return (e) => {
			e.preventDefault()
			e.stopPropagation()
			meal.delete((meals)=>{
				this.listChange(meals)
			})
		}
	}
	editMeal(meal) {
		return (e) => {
			e.preventDefault()
			e.stopPropagation()
			this.state.selectedMeal = meal.clone()
			this.setState(this.state)
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
				<td>{this._isExpanded(meal) ? Icons.down() : Icons.right()}</td>
				<td>{meal['meal-date']}</td>
				<td>{meal['meal-type']}</td>
				<td>{meal['total-calories']}</td>
				<td>
					<span className="icon-tray">
						<span className="icon" onClick={this.deleteMeal(meal)}>
							{Icons.trash()}
						</span>
						<span className="icon" onClick={this.editMeal(meal)}>
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
		_.each(this.state.meals.all, (meal) => {
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
			<Loading show={this.state.loading}>
				<div className={this.state.loading ? "spinner-overlay" : ''}>
					<table className="table meal-list">
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
					<MealModal changeCallback={this.listChange}
							  hideCallback={this.closeMeal}
							  meal={this.state.selectedMeal}/>
				</div>
			</Loading>
		)
	}
}
