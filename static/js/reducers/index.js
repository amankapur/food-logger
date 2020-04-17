import { combineReducers } from 'redux'

import MealList from './meallist'
import Meal from './meal'
import {Modal} from './modal'

export default combineReducers({
  MealList: MealList.reducer,
  Modal: Modal.reducer,
  Meal: Meal.reducer
})
