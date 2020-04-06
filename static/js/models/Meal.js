import _ from 'underscore'
import Data from '../util/Data'


export default class Meal {

	constructor(id=null, callback=null) {
		if (id) {
			if (typeof(id) == 'number') {
				this.get(id, callback)
			} else if(typeof(id) == 'object') {
				_.each(id, (v,k) =>  {
					this[k] = v
				})
			}
		} else {
			_.each(this.defaults(), (v,k) => {
				this[k] = v
			})
		}
	}

	get(id, callback) {
		Data.get_meal(
			{id: id},
			(meal) => {
				_.each(meal, (v,k)=> {
					this[k] = v
				})
				callback(this)
			}
		)
	}

	defaults() {
		let today = new Date();
		let dd = String(today.getDate()).padStart(2, '0');
		let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		let yyyy = today.getFullYear();

		return {
			'id': null,
			'meal-type': '',
			'meal-date': yyyy + '-' + mm + '-' + dd,
			'fooditems': [{
				'food-name': '',
				'portion-size': '',
				'calories': ''
			}]
		}
	}

	clone() {
		let fo_clone = []
		_.each(this.fooditems, (fo) => {
			fo_clone.push(_.clone(fo))
		})
		let o = {
			'id': this.id,
			'meal-type': this['meal-type'],
			'meal-date': this['meal-date'],
			'fooditems': fo_clone
		}
		return new Meal(o)
	}

	save(callback) {
		let saveFunc = this.id ? Data.edit_meal : Data.create_meal
		saveFunc(
			this,
			(meals) => {
				callback((_.map(meals,(m)=> {return new Meal(m)} )))
			}
		)
	}

	delete(callback) {
		Data.delete_meal(
			{id: this.id},
			(meals) => {
				console.log('successfully deleted meal')
				callback(_.map(meals,(m)=> {return new Meal(m)} ))
			}
		)
	}
	checkValidity() {
		let conds = []
		_.each(this, (v,k) => {
			if(k == 'meal-date') {
				conds.push(v.split('-').length == 3)
			}

			if(k == 'meal-type') {
				conds.push(v != '')
			}
			if (k == 'fooditems') {
				_.each(v, (fo) => {
					_.each(fo, (foV, foK) => {
						conds.push(foV != '')
					})
				})
			}
		})
		conds.push(this.fooditems.length > 0)
		return _.every(conds, (c) => {return c})
	}
}
