from flask import Flask
from flask_testing import TestCase
from sqlalchemy.exc import IntegrityError

import unittest, pytest

from config import db, create_test_app
from model import *

class TestDB(TestCase):

	def create_app(self):
		return create_test_app()

	def setUp(self):
		db.create_all()

	def test_user_create(self):
		user = User(name='test', email='test@test.com')
		db.session.add(user)
		db.session.commit()

		assert len(User.query.all()) == 1

	def test_email_uniqueness(self):
		user1 = User(name='test', email='test@test.com')
		user2 = User(name='test', email='test@test.com')

		db.session.add(user1)
		db.session.add(user2)

		with pytest.raises(IntegrityError):
			db.session.commit()

	def test_set_password(self):
		user = User(name='test', email='test@test.com')
		user.set_password('mypassword')
		db.session.add(user)
		db.session.commit()

		assert user.check_password('mypassword')
		assert not user.check_password('mypassword2')

	def tearDown(self):
		db.session.remove()
		db.drop_all()


if __name__ == '__main__':
	unittest.main()
