import React, { Component } from 'react'
import _ from 'underscore'
import Modal from '../util/Modal'
import Icons from '../util/Icons'
import Loading from '../util/Loading'
import Data from '../util/Data'
import If from '../util/If'
import Meal from '../models/Meal'


class MealForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
			meal: this.props.meal
		}
		this.saveForm = this.saveForm.bind(this)
		this.addFoodItem = this.addFoodItem.bind(this)
		this.deleteFoodItem = this.deleteFoodItem.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.meal.id != this.props.meal.id) {
			this.setState({
				meal: this.props.meal
			})
		}
	}

	getSetFunc(name, e) {
		return (e) => {
			e.preventDefault()
			if (name.search("fooditems") == -1) {
				this.state.meal[name] = e.target.value
			}
			else {
				let foIdx = parseInt(name.split('[')[1].split('].')[0])
				let fo_param = name.split('[')[1].split('].')[1]
				this.state.meal.fooditems[foIdx][fo_param] = e.target.value
			}

			this.setState(this.state)
		}
	}

	addFoodItem(e) {
		e.preventDefault()
		e.stopPropagation()
		this.state.meal.fooditems.push({
			'food-name': '',
			'portion-size': '',
			'calories': ''
		})
		this.setState(this.state)
	}

	deleteFoodItem(i) {
		return (e) => {
			e.stopPropagation()
			e.preventDefault()
			let fooditems = []
			_.each(this.state.meal.fooditems, (f, j) => {
				if (j != i) {
					fooditems.push(f)
				}
			})
			this.state.meal.fooditems = fooditems
			this.setState(this.state)
		}
	}

	saveForm(e) {
		e.preventDefault()
		e.stopPropagation()
		if (this.state.meal.checkValidity()) {
			this.props.loading(true)
			this.state.meal.save((meals) =>{
				this.props.changeCallback(meals)
			})
		}
	}

	render() {
		return (
			<div className="meal-container">
				<select value={this.state.meal['meal-type']}
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
						value={this.state.meal['meal-date']}
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
						{_.map(this.state.meal.fooditems, (fooditem, i) => {
							return (
								<tr key={i}>
									<td>
										<input
											type="text"
											className="form-control"
											value={fooditem['food-name']}
											onChange={this.getSetFunc('fooditems['+i+'].'+'food-name')}
											name="food-name"/>
									</td>
									<td>
										<input
											type="text"
											className="form-control"
											value={fooditem['portion-size']}
											onChange={this.getSetFunc('fooditems['+i+'].'+'portion-size')}
											name="portion-size"/>
									</td>
									<td>
										<input
											className="form-control"
											type="number"
											value={fooditem.calories}
											onChange={this.getSetFunc('fooditems['+i+'].'+'calories')}
											name="calolries"/>
									</td>
									<td>
										<If show={this.state.meal.fooditems.length >= 2}>
											<div className="icon" onClick={this.deleteFoodItem(i)}>
												{Icons.trash()}
											</div>
										</If>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
				<button type="button"
						name="Save"
						onClick={this.saveForm}
						className="btn btn-primary"
						disabled={!this.state.meal.checkValidity()}>
						Save
				</button>
			</div>
		)
	}

}


export default class MealModal extends Component {

	constructor(props) {
		super(props)

		this.state = {
			'loading': false,
			'showModal': this.props.meal.id ? true : false
		}

		this.hideModal = this.hideModal.bind(this)
		this.setLoading = this.setLoading.bind(this)
		this.setShowModal = this.setShowModal.bind(this)
		this.changeCallback = this.changeCallback.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.meal.id != this.props.meal.id && this.props.meal.id != null) {
			this.setShowModal(true)
		}
	}

	setLoading(val) {
		this.setState({
			loading: val
		})
	}

	setShowModal(val) {
		this.setState({
			showModal: val
		})
	}

	hideModal() {
		this.setShowModal(false)
		this.props.hideCallback()
	}
	changeCallback(meals) {
		this.setLoading(false)
		this.setShowModal(false)
		this.props.changeCallback(meals)
	}


	render() {
		let title = this.props.meal.id ? "Edit Meal " + this.props.meal.id : "Add Meal"

		return (
			<Loading show={this.state.loading}>
				<Modal buttonTitle="+ Add Meal"
							 header={<h4 className="modal-title">{title}</h4>}
							 centered
							 open={this.state.showModal}
							 hideModal={this.hideModal}
							 showModal={()=>{this.setShowModal(true)}}>
					<MealForm meal={this.props.meal}
										loading={this.setLoading}
										changeCallback={this.changeCallback}/>
				</Modal>
			</Loading>
		)
	}
}
