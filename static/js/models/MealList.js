import _ from 'underscore'
import Data from '../util/Data'
import Meal from './Meal'

export default class MealList {
	constructor(callback) {
		this.all = []
		this.getList(callback)
	}

	getList(callback) {
		Data.get_all_meals(
			null,
			(meals)=> {
				console.log('successfully fetched meal list')
				console.log(meals)
				this.all = []
				_.each(meals, (m) => {
					this.all.push(new Meal(m))
				})
				callback(this.all)
			},
			(msg) => {
				console.log('error fetching meal list')
				console.log(msg)
			}
		)
	}
	findById(id) {
		return _.where(this.all, {'id': id})[0]
	}
}
