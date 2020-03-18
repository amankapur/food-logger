import functools

from flask import Blueprint, redirect, render_template, url_for, request, jsonify, session, make_response

from config import db, create_production_app

from model import *

from views.auth import auth_bp, login_required




app = create_production_app()

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
	r = make_response(jsonify(data = user.meals), 200)
	r.headers['Content-Type'] = 'application/json'
	return r



if __name__ == "__main__":

	# db.create_all()

	app.register_blueprint(auth_bp)
	app.register_blueprint(app_bp)
	app.run(debug=True)
