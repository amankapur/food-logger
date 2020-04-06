import _ from 'underscore'
import $ from 'jquery'


class DataClass {
	constructor() {
		this.get_all_meals = this.request('get', '/meallist')
		this.delete_meal = this.request('post', '/delete_meal')
		this.create_meal = this.request('post', '/create_meal')
		this.get_meal = this.request('get', '/meal')
		this.edit_meal = this.request('post', '/meal')
	}

	request(method, url) {
		return (params, successCallback, errorCallback) => {

			let data = params
			if (data != null) {
				if (method != 'get') {
					data = JSON.stringify(data)
				}
			}

			$.ajax({
				method: method,
				url: url,
				data: data,
				contentType: 'application/json',
	      dataType: 'json',
	      success: (rData, textStatus, xhr) => {
	      	successCallback(rData['data'])
	      },
	      error: (rData, textStatus, xhr) => {
	      	errorCallback(rData['data'])
	      }
			})
		}
	}
}
let Data = new DataClass()
export default Data
