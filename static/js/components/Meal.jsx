import React, { Component } from 'react'
import $ from 'jquery'
import _ from 'underscore'
import Modal from '../util/Modal'
import Icons from '../util/Icons'
import Loading from '../util/Loading'


export default class Meal extends Component {

	getEmptyMeal() {
		let today = new Date();
		let dd = String(today.getDate()).padStart(2, '0');
		let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		let yyyy = today.getFullYear();

		return {
			'meal-type': '',
			'meal-date': yyyy + '-' + mm + '-' + dd,
			'fooditems': [{
				'food-name': '',
				'portion-size': '',
				'calories': ''
			}]
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
		this.addFoodItem = this.addFoodItem.bind(this)
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
			if (name.search("fooditems") == -1) {
				self.state[name] = e.target.value
			}
			else {
				let foIdx = parseInt(name.split('[')[1].split('].')[0])
				let fo_param = name.split('[')[1].split('].')[1]
				self.state.fooditems[foIdx][fo_param] = e.target.value
			}

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
					'meal-date': meal['date'],
					'fooditems': meal.fooditems,
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
		console.log(self.state)
		let s = this.state
		s['test'] = [1,2,3]
		return $.post({
			url: self.props.id ? '/meal/'+self.props.id : '/create_meal',
			data: JSON.stringify(s),
			contentType: 'application/json',
    	dataType: 'json',
			success: (data) => {
				self.props.changeCallback(data['data'])
				console.log(data)
				self.state['loading'] = false
				self.state['showModal'] = false
				self.setState(self.state)
			}
		})
	}
	addFoodItem(e) {
		e.preventDefault()
		e.stopPropagation()
		this.state.fooditems.push({
			'food-name': '',
			'portion-size': '',
			'calories': ''
		})
		this.setState(this.state)
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
							placeholder="Enter meal date"
							value={this.state['meal-date']}
							onChange={this.getSetFunc('meal-date')}
							name="meal-date"/>

					<table className="table text-center slim">
						<thead>
							<tr>
								<th>
									<div className="icon float-left" onClick={this.addFoodItem}>
										{Icons.plus()}
									</div>
									Food Name
								</th>
								<th>Portion Size</th>
								<th>Calories</th>
							</tr>
						</thead>
						<tbody>
							{_.map(this.state.fooditems, (fooditem, i) => {
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
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</Modal>
		)
	}
}
