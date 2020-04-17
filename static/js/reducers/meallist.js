import _ from 'underscore'
import Data from '../util/Data'

const MealList = {

	getInitialState: () => {
		return {
			all: [],
			loading: false,
			error: null
		}
	},

	getList: () => {
		return (dispatch) => {
			dispatch(MealList.actions.getListBegin())
			Data.get_all_meals(
				null,
				(meals)=> {
					console.log('successfully fetched meal list')
					dispatch(MealList.actions.getListSuccess(meals))
				},
				(msg) => {
					console.log('error fetching meal list')
					dispatch(MealList.actions.getListError(msg))
				}
			)
		}
	},

	delete: (meal) => {
		return (dispatch) => {
			dispatch(MealList.actions.deleteMealBegin())
			Data.delete_meal(
				{id: meal.id},
				(meals) => {
					console.log('successfully deleted meal')
					dispatch(MealList.actions.deleteMealSuccess(meals))
				},
				(msg) => {
					console.log('error deleting meal')
					dispatch(MealList.actions.deleteMealError(msg))
				}
			)
		}
	},

	reducer: (state=MealList.getInitialState(), action) => {
		switch(action.type) {
			case 'ADD_MEAL':
				return {
					...state,
					all: [...state, action.meal]
				}
			case 'DELETE_MEAL':
				return {
					...state,
					all: _.without(state, (s) => {s.id == action.id})
				}
			case 'GET_MEALLIST_BEGIN':
				return {
					...state,
					loading: true
				}
			case 'GET_MEALLIST_SUCCESS':
				return {
					...state,
					all: action.meals,
					error: null,
					loading: false
				}
			case 'GET_MEALLIST_ERROR':
				return {
					...state,
					all: [],
					error: action.msg,
					loading: false
				}

			case 'DELETE_MEAL_BEGIN':
				return {
					...state,
					loading: true
				}
			case 'DELETE_MEAL_SUCCESS':
				return {
					...state,
					all: action.meals,
					error: null,
					loading: false
				}
			case 'DELETE_MEAL_ERROR':
				return {
					...state,
					all: [],
					error: action.msg,
					loading: false
				}
			default:
				return state
		}
	},

	actions: {
		addMeal: (meal) => {
			return {
				type: 'ADD_MEAL',
				meal
			}
		},
		deleteMeal: (meal) => {
			return {
				type: 'DELETE_MEAL',
				meal
			}
		},
		getListBegin: () => {
			return {
				type: 'GET_MEALLIST_BEGIN'
			}
		},
		getListSuccess: (meals) => {
			return {
				type: 'GET_MEALLIST_SUCCESS',
				meals: meals
			}
		},
		getListError: (msg) => {
			return {
				type: 'GET_MEALLIST_ERROR',
				msg: msg
			}
		},
		deleteMealBegin: () => {
			return {
				type: 'DELETE_MEAL_BEGIN'
			}
		},
		deleteMealSuccess: (meals) => {
			return {
				type: 'DELETE_MEAL_SUCCESS',
				meals: meals
			}
		},
		deleteMealError: (msg) => {
			return {
				type: 'DELETE_MEAL_ERROR',
				msg: msg
			}
		}
	}
}
export default MealList
