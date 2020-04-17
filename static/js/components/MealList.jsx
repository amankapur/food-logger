import React, { Component } from 'react'
import _ from 'underscore'
import Icons from '../util/Icons'
import Loading from '../util/Loading'
import MealModal from './Meal'

import Data from '../util/Data'

import MealList from "../reducers/meallist"
import Meal from "../reducers/meal"
import {Modal} from "../reducers/modal"
import { connect } from "react-redux"


class MealListTable extends Component {


	constructor(props) {
		super(props)

		this.closeMeal = this.closeMeal.bind(this)

		this.state = {
			expanded: []
		}

		this.props.dispatch(MealList.getList())
	}

	closeMeal() {
		this.props.dispatch(Meal.actions.unselectMeal())
		this.props.dispatch(Modal.actions.close())
	}

	deleteMeal(meal) {
		return (e) => {
			e.preventDefault()
			e.stopPropagation()
			this.props.dispatch(MealList.delete(meal))
		}
	}
	editMeal(meal) {
		return (e) => {
			e.preventDefault()
			e.stopPropagation()
			this.props.dispatch(Meal.actions.selectMeal(meal))
			this.props.dispatch(Modal.actions.open())
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
		_.each(this.props.meals, (meal) => {
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
			<Loading show={this.props.loading}>
				<div className={this.props.loading ? "spinner-overlay" : ''}>
					<table className="table meal-list">
						<thead>
							<tr>
								<th>#</th>
								<th>Meal Date</th>
								<th>Meal Name</th>
								<th>Total Calories</th>
								<th className="slim">
									<MealModal hideCallback={this.closeMeal}/>
								</th>
							</tr>
						</thead>
						<tbody>
							{this.getTrList()}
						</tbody>
					</table>
				</div>
			</Loading>
		)
	}
}

const mapStateToProps = (state) => {
	return {
	  meals: state.MealList.all,
	  loading: state.MealList.loading,
	  error: state.MealList.error,
	  selectedMeal: state.Meal
	}
};

export default connect(mapStateToProps)(MealListTable)
