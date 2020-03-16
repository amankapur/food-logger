from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_test_app():
	app = Flask(__name__)
	app.config['TESTING'] = True
	app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/food-logger-test.db"
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	db.init_app(app)
	app.app_context().push()
	app.secret_key = ".."
	return app

# you can create another app context here, say for production
def create_production_app():
	app = Flask(__name__, template_folder='views', static_folder='public')
	app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/food-logger.db'
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	app.url_map.strict_slashes = False

	db.init_app(app)
	app.app_context().push()
	app.secret_key = ".."
	return app
