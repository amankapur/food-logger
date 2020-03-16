import functools
from flask import Blueprint, make_response, jsonify, session, redirect, url_for, render_template, request
from config import db
from model import User

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


def login_required(view):

	@functools.wraps(view)
	def wrapped_view(**kwargs):
		if session.get('user_id') is None:
			return redirect(url_for('auth.login'))

		return view(**kwargs)

	return wrapped_view



@auth_bp.route('/signup',  methods=['GET', 'POST'])
def signup():
	if request.method == 'POST':
		data = request.form.to_dict()

		name = data['email']
		email = data['email']
		password = data['password']

		new_user = User(name=name, email=email)
		user = User.get_by_email(email)

		if user:
			data = {'msg': 'User already exists'}
			r = make_response(jsonify(data), 400)
			r.headers['Content-Type'] = 'application/json'
			return r

		new_user.set_password(password)
		db.session.add(new_user)
		db.session.commit()


		data = {'msg': 'User successfully created'}
		r = make_response(jsonify(data), 200)
		r.headers['Content-Type'] = 'application/json'
		return r

	return render_template('auth.html')

@auth_bp.route('/login',  methods=['GET', 'POST'])
def login():
	if request.method == 'POST':
		data = request.form.to_dict()
		email = data['email']
		password = data['password']

		user = User.get_by_email(email)

		if not user:
			data = {'msg': "User doesn't exist"}
			r = make_response(jsonify(data), 400)
			r.headers['Content-Type'] = 'application/json'
			return r

		pwd_check = user.check_password(password)

		if not pwd_check:
			data = {'msg': "Incorrect Password"}
			r = make_response(jsonify(data), 400)
			r.headers['Content-Type'] = 'application/json'
			return r

		session['user_id'] = user.id
		data = {'msg': 'Successfully logged in'}
		r = make_response(jsonify(data), 200)
		r.headers['Content-Type'] = 'application/json'
		return r

	return render_template('auth.html')

@auth_bp.route('/logout')
def logout():
	del session['user_id']
	data = {'msg': 'Successfully logged out'}
	r = make_response(jsonify(data), 200)
	r.headers['Content-Type'] = 'application/json'
	return r
