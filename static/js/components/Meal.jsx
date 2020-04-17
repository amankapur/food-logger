import React, { Component } from 'react'
import _ from 'underscore'
import {Modal, ModalHeader, ModalFooter, ModalBody} from '../util/Modal'
import Icons from '../util/Icons'

import Data from '../util/Data'
import If from '../util/If'
import MealList from "../reducers/meallist"
import Meal from "../reducers/meal"
import { connect } from "react-redux"
import {Modal as ModalReducer} from "../reducers/modal"


const mapStateToProps = (state) => {
	return {
	  meal: state.Meal,
	}
};


class MealForm extends Component {

	constructor(props) {
		super(props)
		this.addFoodItem = this.addFoodItem.bind(this)
		this.deleteFoodItem = this.deleteFoodItem.bind(this)
	}

	getSetFunc(name, e) {
		return (e) => {
			e.preventDefault()
			this.props.dispatch(Meal.actions.set(name, e.target.value))
		}
	}

	getSetFoodItemFunc(i, name) {
		return (e) => {
			e.preventDefault()
			let val = e.target.value
			let fooditems = this.props.meal.fooditems
			fooditems[i][name] = val
			this.props.dispatch(Meal.actions.set('fooditems', fooditems))
		}
	}

	addFoodItem(e) {
		e.preventDefault()
		e.stopPropagation()
		this.props.dispatch(Meal.actions.addFoodItem())
	}

	deleteFoodItem(fo) {
		return (e) => {
			e.stopPropagation()
			e.preventDefault()
			this.props.dispatch(Meal.actions.deleteFoodItem(fo))
		}
	}


	render() {
		return (
			<div className="meal-container">
				<select value={this.props.meal['meal-type']}
								onChange={this.getSetFunc('meal-type')}
								className="custom-select">
					<option value='' disabled>Select Meal Type</option>
					<option value='Breakfast'>Breakfast</option>
					<option value='Lunch'>Lunch</option>
					<option value='Dinner'>Dinner</option>
					<option value='Snack'>Snack</option>
				</select>

				<input
						className="form-control"
						type="date"
						placeholder="Enter meal date"
						value={this.props.meal['meal-date']}
						onChange={this.getSetFunc('meal-date')}
						name="meal-date"/>

				<table className="table text-center slim">
					<thead>
						<tr>
							<th>
								Food Name
							</th>
							<th>Portion Size</th>
							<th>Calories</th>
							<th>
								<div className="icon" onClick={this.addFoodItem}>
									{Icons.plus()}
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{_.map(this.props.meal.fooditems, (fooditem, i) => {
							return (
								<tr key={i}>
									<td>
										<input
											type="text"
											className="form-control"
											value={fooditem['food-name']}
											onChange={this.getSetFoodItemFunc(i, 'food-name')}
											name="food-name"/>
									</td>
									<td>
										<input
											type="text"
											className="form-control"
											value={fooditem['portion-size']}
											onChange={this.getSetFoodItemFunc(i, 'portion-size')}
											name="portion-size"/>
									</td>
									<td>
										<input
											className="form-control"
											type="number"
											value={fooditem.calories}
											onChange={this.getSetFoodItemFunc(i, 'calories')}
											name="calories"/>
									</td>
									<td>
										<If show={this.props.meal.fooditems.length >= 2}>
											<div className="icon" onClick={this.deleteFoodItem(fooditem)}>
												{Icons.trash()}
											</div>
										</If>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		)
	}

}
MealForm = connect(mapStateToProps)(MealForm)


class MealModal extends Component {

	constructor(props) {
		super(props)
		this.saveMeal = this.saveMeal.bind(this)
	}

	modalAction(name) {
		return (e) => {
			e.preventDefault()
			e.stopPropagation()
			this.props.dispatch(ModalReducer.actions[name]())
			if (name == 'close') {
				this.props.dispatch(Meal.actions.unselectMeal())
			}
		}
	}
	saveMeal(e) {
		e.preventDefault()
		e.stopPropagation()
		if (Meal.checkValidity(this.props.meal)) {
			this.props.dispatch(ModalReducer.actions.loading(true))
			Meal.save(this.props.meal, (meals) =>{
				this.props.dispatch(MealList.actions.getListSuccess(meals))
				this.props.dispatch(ModalReducer.actions.loading(false))
				this.props.dispatch(ModalReducer.actions.close())
			})
		}
	}

	render() {

		let title = this.props.meal.id ? "Edit Meal " + this.props.meal.id : "Add Meal"

		return (
			<Modal buttonTitle="+ Add Meal">
				<ModalHeader title={title}>
					<button type="button"
								className="close"
								onClick={this.modalAction('close')}>&times;</button>
				</ModalHeader>

				<ModalBody>
					<MealForm />
				</ModalBody>

				<ModalFooter>
					<button type="button"
						name="Save"
						onClick={this.saveMeal}
						className="btn btn-primary"
						disabled={!Meal.checkValidity(this.props.meal)}>
						Save
					</button>
					<button className="btn btn-primary"
									onClick={this.modalAction('close')}>
						Close
					</button>
				</ModalFooter>
			</Modal>
		)
	}
}


export default connect(mapStateToProps)(MealModal)
