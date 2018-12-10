import re
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy();
shopDB = PyMongo();

'''
class for customer user.
'''

class User_C(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20))
    password_hash = db.Column(db.String(128))
    email = db.Column(db.String(120))
    mobile = db.Column(db.String(20))
    date_of_birth = db.Column(db.DATE)
    join_date = db.Column(db.DATE)
    gender = db.Column(db.Enum('m','f','a'))
    first_name = db.Column(db.String(20))
    last_name = db.Column(db.String(20))
    MongoID = db.Column(db.String(24))

    record = None

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_record(self):
        self.MongoID = '{}'.format(shopDB.db.customer_records.insert_one({'cart':[],'history':[]}).inserted_id)

    def get_record(self):
        self.record = shopDB.db.customer_records.find_one({'_id':ObjectId(self.MongoID)})

    def set_data(self, name, data):
        if name is None:return
        if name =='email'and re.match('\w+@\w+',data)is not None:self.email=data
        elif name =='mobile' and re.match('09\d{8}',data)is not None:self.mobile=data
        elif name =='date_of_birth' and re.match('(19|20)\d{2}-[10]\d-[3210]\d',data)is not None:
            self.date_of_birth=data
        elif name =='gender' and re.match('[mfa]{1}',data)is not None:self.gender=data
        else: return 'Invalid {}'.format(name)
        self.add_user()
        return

    def get_user_obj(self):
        return {
        'is_authenticated':self.is_authenticated,
        'id':self.id,
        'username':self.username,
        'email' : self.email,
        'mobile' :self.mobile,
        'date_of_birth' :self.date_of_birth,
        'gender' :self.gender,
        'first_name' :self.first_name,
        'last_name' :self.last_name,
        'mongoID' : self.MongoID
        }

    def add_user(self):
        db.session.add(self)
        db.session.commit()

    def get_cart(self):
        pass
    def addToCart(self,index):
        pass
    def removeFromCart(self,index):
        pass

    def __repr__(self):
        return 'User: {}'.format(self.username)
