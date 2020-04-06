import functools
from flask import Blueprint, redirect, render_template, url_for, request, jsonify, session, make_response
from flask_migrate import Migrate

from config import db, create_production_app
from model import *
from views.auth import auth_bp, login_required
from datetime import datetime


def get_datetime_from_str(date_str):
	arr = list(map(int, date_str.split('-')))
	return datetime(arr[0], arr[1], arr[2])

def make_error_response(e):
	msg = str(e)
	if type(e) == IntegrityError:

		if Meal.UNIQ_USER_MEAL_CONSTRAINT in str(e.orig.args):
			msg = 'Meal Type already exists for this date'

	r = make_response(jsonify(data = msg), 400)
	r.headers['Content-Type'] = 'application/json'
	return r

app = create_production_app()
migrate = Migrate(app, db)


app_bp = Blueprint('app', __name__, url_prefix='')

@app_bp.route('/')
@login_required
def home():
	return render_template('home.html')


@app_bp.route('/meallist')
@login_required
def meallist():
	user_id = session.get('user_id')
	user = User.get_by_id(user_id)
	r = make_response(jsonify(data = [m.serialize for m in user.meals]), 200)
	r.headers['Content-Type'] = 'application/json'
	return r


@app_bp.route('/meal/', methods=['GET', 'POST'])
@login_required
def meal():

	if request.method == 'GET':
		id = request.args.get('id')
		meal = Meal.get_by_id(id)
		return make_response(jsonify(data = meal.serialize), 200)

	if request.method == 'POST':

		user_id = session.get('user_id')
		user = User.get_by_id(user_id)

		data = request.json
		id = data['id']
		meal = Meal.get_by_id(id)

		meal.name = data['meal-type']
		meal.date = get_datetime_from_str(data['meal-date'])

		new_ids = []

		# update any fo changes
		for fo in data['fooditems']:
			if 'id' in fo:
				new_ids.append(fo['id'])
				fooditem = FoodItem.get_by_id(fo['id'])
				fooditem.name = fo['food-name']
				fooditem.portionsize = fo['portion-size']
				fooditem.calories = fo['calories']
				db.session.add(fooditem)

		# delete any existing fo
		for fo in meal.fooditems:
			if fo.id not in new_ids:
				db.session.delete(fo)

		# add new fo
		for fo in data['fooditems']:
			if 'id' not in fo:
				try:
					fooditem = FoodItem(name=fo['food-name'], portionsize=fo['portion-size'], calories=fo['calories'])
					fooditem.meal = meal
					db.session.add(fooditem)
				except Exception as e:
					return make_error_response(e)


		db.session.add(meal)
		db.session.commit()

		r = make_response(jsonify(data = [m.serialize for m in user.meals]), 200)
		r.headers['Content-Type'] = 'application/json'
		return r


@app_bp.route('/create_meal', methods=['POST'])
@login_required
def create_meal():
	if request.method == 'POST':
		user_id = session.get('user_id')
		user = User.get_by_id(user_id)

		data = request.json

		meal_name = data['meal-type']
		meal_date= get_datetime_from_str(data['meal-date'])

		meal = None

		try:
			meal = Meal(name=meal_name, date=meal_date)
		except Exception as e:
			return make_error_response(e)

		meal.user = user

		db.session.add(meal)

		for fo in data['fooditems']:
			fooditem = None
			try:
				fooditem = FoodItem(name=fo['food-name'], portionsize=fo['portion-size'], calories=fo['calories'])
			except Exception as e:
				return make_error_response(e)

			fooditem.meal = meal
			db.session.add(fooditem)

		try:
			db.session.commit()
		except Exception as e:
			db.session.rollback()
			return make_error_response(e)

		return make_response(jsonify(data = [m.serialize for m in user.meals]), 200)





@app_bp.route('/delete_meal', methods=['POST'])
@login_required
def delete_meal():
	if request.method == 'POST':
		id = request.json['id']

		meal = Meal.get_by_id(id)

		user_id = session.get('user_id')
		user = User.get_by_id(user_id)

		if not meal:
			return make_response(jsonify(data = 'Meal not found'), 200)

		db.session.delete(meal)
		db.session.commit()

		return make_response(jsonify(data = [m.serialize for m in user.meals]), 200)



if __name__ == "__main__":

	db.create_all()

	app.register_blueprint(auth_bp)
	app.register_blueprint(app_bp)
	app.run(debug=True)
