import _ from 'underscore'
import Data from '../util/Data'


const Meal = {

	getInitialState() {
		let today = new Date();
		let dd = String(today.getDate()).padStart(2, '0');
		let mm = String(today.getMonth() + 1).padStart(2, '0');
		let yyyy = today.getFullYear();

		return {
			'id': null,
			'meal-type': '',
			'meal-date': yyyy + '-' + mm + '-' + dd,
			'fooditems': [Meal.getIntialStateFoodItem()]
		}
	},

	getIntialStateFoodItem() {
		return {
			'food-name': '',
			'portion-size': '',
			'calories': ''
		}
	},


	save(meal, callback) {
		let saveFunc = meal.id ? Data.edit_meal : Data.create_meal
		saveFunc(
			meal,
			(meals) => {
				callback(meals)
			}
		)
	},

	delete(meal, callback) {
		Data.delete_meal(
			{id: meal.id},
			(meals) => {
				console.log('successfully deleted meal')
				callback(meals)
			}
		)
	},
	checkValidity(meal) {
		let conds = []
		_.each(meal, (v,k) => {
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
		conds.push(meal.fooditems.length > 0)
		return _.every(conds, (c) => {return c})
	},

	reducer(state = Meal.getInitialState(), action) {
		switch(action.type) {
			case 'CHANGE_MEAL_PROPERTY':
				let o = {
					...state
				}
				o[action.key] = action.value
				return o
			case 'SET_MEAL':
				return action.meal
			case 'UNSET_MEAL':
				return Meal.getInitialState()
			case 'ADD_FOOD_ITEM':
				return {
					...state,
					fooditems: [...state.fooditems, action.foodItem]
				}
			case 'DELETE_FOOD_ITEM':
				return {
					...state,
					fooditems: _.without(state.fooditems, action.foodItem)
				}
			default:
				return state
		}
	},
	actions: {
		set: (key, value) => {
			return {
				type: 'CHANGE_MEAL_PROPERTY',
				key,
				value
			}
		},
		addFoodItem: (foodItem=Meal.getIntialStateFoodItem()) => {
			return {
				type: 'ADD_FOOD_ITEM',
				foodItem
			}
		},
		deleteFoodItem: (foodItem) => {
			return {
				type: 'DELETE_FOOD_ITEM',
				foodItem
			}
		},
		selectMeal: (meal) => {
			return {
				type: 'SET_MEAL',
				meal
			}
		},
		unselectMeal: () => {
			return {
				type: 'UNSET_MEAL'
			}
		}
	}
}

export default Meal
