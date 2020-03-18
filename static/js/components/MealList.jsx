import React, { Component } from 'react';
import $ from 'jquery'

export default class MealList extends Component {

	get_list() {
		const self = this
		$.get({
			url: '/meallist',
			success: (data) => {
				console.log(data['data'])
				self.setState({
					loading: false,
					meallist: data['data']
				})
			},
			fail: (data) => {
				console.log(data)
			}
		})
	}
	
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			mealList: []
		}
		this.get_list()
	}


	render() {
		return (
			<table className="table">
			  <thead>
			    <tr>
			      <th scope="col">#</th>
			      <th scope="col">Meal Description</th>
			      <th scope="col">Meal Date</th>
			      <th scope="col">Total Calories</th>
			    </tr>
			  </thead>
			  <tbody>

			  </tbody>
			</table>
    )
  }
}
