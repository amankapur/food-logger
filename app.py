import functools

from flask import Blueprint, redirect, render_template, url_for, request

from config import get_app

from model import *

from views.auth import auth_bp, login_required




app, db = get_app()

app_bp = Blueprint('app', __name__, url_prefix='')


@app_bp.route('/')
@login_required
def home():
	return 'Hello'


if __name__ == "__main__":

	# db.create_all()

	app.register_blueprint(auth_bp)
	app.register_blueprint(app_bp)
	app.run(debug=True)
