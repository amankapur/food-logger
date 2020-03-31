import React, { Component } from 'react'
import $ from 'jquery'
import _ from 'underscore'
import Modal from '../util/Modal'
import Icons from '../util/Icons'
import Loading from '../util/Loading'

class Meal extends Component {

	getEmptyMeal() {
		let today = new Date();
		let dd = String(today.getDate()).padStart(2, '0');
		let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		let yyyy = today.getFullYear();

		return {
			'meal-type': '',
			'food-name': '',
			'portion-size': '',
			'calories': '',
			'meal-date': yyyy + '-' + mm + '-' + dd,
		}

	}
	constructor(props) {
		super(props)

		this.state = this.getEmptyMeal()
		this.state['loading'] = false
		this.state['showModal'] = false

		this.saveMeal = this.saveMeal.bind(this)
		this.clickedButton = this.clickedButton.bind(this)
		this.showModal = this.showModal.bind(this)
		this.hideModal = this.hideModal.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {

		if (prevProps.id != this.props.id && this.props.id != null) {
			this.getMeal(this.props.id)
		}

	}

	getSetFunc(name, e) {
		const self = this
		return (e) => {
			e.preventDefault()
			self.state[name] = e.target.value
			self.setState(self.state)
		}
	}

	getMeal(id) {
		const self = this
		this.state['loading'] = true
		this.state['showModal'] = true
		this.setState(this.state)
		$.get({
			url: '/meal/'+ id,
			success: (data) => {
				let meal = data['data']
				let state = {
					'meal-type': meal['meal-name'],
					'food-name': meal['fooditems'][0]['fooditem_name'],
					'portion-size': meal['fooditems'][0]['portionsize'],
					'calories': meal['fooditems'][0]['calories'],
					'meal-date': meal['date'],
					'loading': false,
					'showModal': true
				}
				console.log(state)
				self.setState(state)
			}
		})
	}

	saveMeal() {
		const self = this
		return $.post({
			url: self.props.id ? '/meal/'+self.props.id : '/create_meal',
			data: self.state,
			success: (data) => {
				self.props.changeCallback(data['data'])
				console.log(data)
				self.state['loading'] = false
				self.state['showModal'] = false
				self.setState(self.state)
			}
		})
	}

	clickedButton(tp) {
		if (tp == 'Save') {
			this.state['loading'] = true
			this.setState(this.state)
			this.saveMeal()
		}
	}

	showModal() {
		this.state['showModal'] = true
		this.setState(this.state)
	}

	hideModal() {
		this.state = this.getEmptyMeal()
		this.state['loading'] = false
		this.state['showModal'] = false
		this.setState(this.state)
		this.props.hideCallback()
	}

	render() {
		let title = this.props.id ? "Edit Meal " + this.props.id : "Add Meal"
		return (
			<Modal buttonTitle="+ Add Meal"
						 header={<h4 className="modal-title">{title}</h4>}
						 footer={["Save", "Close"]}
						 footerCallback={this.clickedButton}
						 modalDialogClass={this.state.loading ? 'spinner-overlay': ''}
						 centered
						 open={this.state.showModal}
						 hideModal={this.hideModal}
						 showModal={this.showModal}>
				<Loading show={this.state.loading}/>
				<div className="meal-container">
					<select value={this.state['meal-type']}
									onChange={this.getSetFunc('meal-type')}
									className="custom-select">
	          <option value = '' disabled>Select Meal Type</option>
						<option value = 'Breakfast'>Breakfast</option>
						<option value = 'Lunch'>Lunch</option>
						<option value = 'Dinner'>Dinner</option>
						<option value = 'Snack'>Snack</option>
					</select>

					<input
							className="form-control"
							placeholder="Enter food name"
							value={this.state['food-name']}
							onChange={this.getSetFunc('food-name')}
							name="food-name"/>
					<input
							className="form-control"
							placeholder="Enter portion size"
							value={this.state['portion-size']}
							onChange={this.getSetFunc('portion-size')}
							name="portion-size"/>
					<input
							className="form-control"
							placeholder="Enter calolries"
							type="number"
							value={this.state.calories}
							onChange={this.getSetFunc('calories')}
							name="calolries"/>
					<input
							className="form-control"
							placeholder="Enter meal date"
							value={this.state['meal-date']}
							onChange={this.getSetFunc('meal-date')}
							name="meal-date"/>
				</div>
			</Modal>
		)
	}
}


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
			mealID: null
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
		return $.post({
			url: '/delete_meal/' + id,
			success: (data) => {
				console.log('successfully deleted meal')
				self.listChange(data['data'])
			}
		})
	}

	getDeleteMealFunc(id) {
		const self = this
		return () => {
			return self.deleteMeal(id)
		}
	}
	getEditMealFunc(id) {
		const self = this
		return () => {
			self.state['mealID'] = id
			self.setState(self.state)
		}
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
							{_.map(this.state.mealList, (meal) => {
								return (
									<tr key={meal.id}>
										<td>{meal.id}</td>
										<td>{meal.date}</td>
										<td>{meal['meal-name']}</td>
										<td>{meal['total-calories']}</td>
										<td>
											<span className="icon" onClick={this.getDeleteMealFunc(meal.id)}>
												{Icons.trash()}
											</span>
											<span className="icon" onClick={this.getEditMealFunc(meal.id)}>
												{Icons.edit()}
											</span>
										</td>
									</tr>
								)
							})}
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
