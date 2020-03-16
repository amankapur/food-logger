from werkzeug.security import generate_password_hash, check_password_hash

from config import get_app

app, db = get_app()

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


class FoodItem(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), nullable=False)
	portionsize = db.Column(db.Integer, nullable=False)
	meal_id = db.Column(db.Integer, db.ForeignKey('meal.id'), nullable=False)


class Meal(db.Model):

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), nullable=False)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	fooditems = db.relationship('FoodItem', backref='meal', lazy=True)
