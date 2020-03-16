from flask import Flask
from flask_sqlalchemy import SQLAlchemy

global app
global db

app = None
db = None

def create_test_app():
	app = Flask(__name__)
	app.config['TESTING'] = True
	app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/food-logger-test.db"
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	db = SQLAlchemy()
	db.init_app(app)
	app.app_context().push()
	app.secret_key = ".."
	return app, db

# you can create another app context here, say for production
def create_production_app():
	app = Flask(__name__, template_folder='views', static_folder='public')
	app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/food-logger.db'
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	db = SQLAlchemy()
	db.init_app(app)
	app.app_context().push()
	app.secret_key = ".."
	return app, db


def get_app(test=False):
	global app
	global db

	if app != None and db != None:
		return app, db

	return create_production_app() if not test else create_test_app()
