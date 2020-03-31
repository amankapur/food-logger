from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property

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
			'fooditem_name': self.name,
			'portionsize': self.portionsize,
			'meal-id': self.meal_id,
			'calories': self.calories
		}

class Meal(db.Model):

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	fooditems = db.relationship('FoodItem', backref='meal', lazy=True, cascade="all,delete-orphan")
	date = db.Column(db.DateTime, nullable=False, default=datetime.today())

	@property
	def serialize(self):
		"""Return object data in easily serializable format"""
		return {
			'id'         : self.id,
			'meal-name'  : self.name,
			'user-id'		 : self.user_id,
			'fooditems'	 : [fi.serialize for fi in self.fooditems],
			'total-calories': self.total_calories,
			'date' :  "{}-{}-{}".format(self.date.year, self.date.month, self.date.day)
		}

	@hybrid_property
	def total_calories(self):
		return sum([f.calories for f in self.fooditems])

	@staticmethod
	def get_by_id(id):
		return db.session.query(Meal).filter_by(id=id).scalar()
