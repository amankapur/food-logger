from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import validates

from werkzeug.security import generate_password_hash, check_password_hash

from config import db

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), nullable=False)
	email = db.Column(db.String(120), unique=True, nullable=False, index=True)
	password_hash = db.Column(db.String(128))
	meals = db.relationship('Meal', backref='user', lazy=True)


	def __repr__(self):
		return '<User id: %r, name: %r>' % (self.id, self.name)

	def set_password(self, password):
		self.password_hash = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.password_hash, password)

	@staticmethod
	def get_by_email(email):
		return db.session.query(User).filter_by(email=email).scalar()

	@staticmethod
	def get_by_id(id):
		return db.session.query(User).filter_by(id=id).scalar()


class FoodItem(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), nullable=False)
	portionsize = db.Column(db.Integer, nullable=False)
	meal_id = db.Column(db.Integer, db.ForeignKey('meal.id'), nullable=False)
	calories = db.Column(db.Integer, nullable=False)

	@property
	def serialize(self):
		return {
			'id': self.id,
			'food-name': self.name,
			'portion-size': self.portionsize,
			'meal-id': self.meal_id,
			'calories': self.calories
		}

	@validates('calories')
	def validate_calories(self, key, calories):
		try:
			int(calories)
		except e:
			raise AssertionError("Calories must be of type int")
		if int(calories) <= 0:
			raise AssertionError("Calories must greater than 0")
		return calories

	@staticmethod
	def get_by_id(id):
		return db.session.query(FoodItem).filter_by(id=id).scalar()

class Meal(db.Model):


	MEAL_NAMES = ['Breakfast', 'Lunch', 'Snack', 'Dinner']
	UNIQ_USER_MEAL_CONSTRAINT = "uniq_user_meal"


	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	fooditems = db.relationship('FoodItem', backref='meal', lazy=True, cascade="all,delete-orphan")
	date = db.Column(db.DateTime, nullable=False, default=datetime.today())

	__table_args__ = (db.UniqueConstraint('name', 'user_id', 'date', name=UNIQ_USER_MEAL_CONSTRAINT),)


	@property
	def serialize(self):
		m = self.date.month
		if self.date.month < 10:
			m = '0' + str(self.date.month)

		d = self.date.day
		if self.date.day < 10:
			d = '0' + str(self.date.day)

		return {
			'id'         : self.id,
			'meal-type'  : self.name,
			'user-id'		 : self.user_id,
			'fooditems'	 : [fi.serialize for fi in self.fooditems],
			'total-calories': self.total_calories,
			'meal-date' :  "{}-{}-{}".format(self.date.year, m, d)
		}

	@hybrid_property
	def total_calories(self):
		return sum([f.calories for f in self.fooditems])

	@staticmethod
	def get_by_id(id):
		return db.session.query(Meal).filter_by(id=id).scalar()

	@validates('date')
	def validate_date(self, key, date):
		if not date:
			raise AssertionError("Meal Type cannot be empty")

		if type(date) is not datetime:
			raise AssertionError("Type of date must be datetime object")
		return date

	@validates('name')
	def validate_name(self, key, name):
		if name not in Meal.MEAL_NAMES:
			raise AssertionError("Meal Type is valid")
		return name
