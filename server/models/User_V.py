import re
from flask_login import UserMixin
from flask_pymongo import PyMongo
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from models.Vendors_Set import Vendors_Set

mongo=PyMongo()
db = SQLAlchemy()

class User_V(UserMixin, db.Model):
    __tablename__ = 'users_vendor'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20))
    password_hash = db.Column(db.String(128))
    join_date = db.Column(db.DATE)
    email = db.Column(db.String(120))
    mobile = db.Column(db.String(20))
    MongoID = db.Column(db.String(24))
    banking = db.Column(db.String(128))
    first_name = db.Column(db.String(20))
    last_name = db.Column(db.String(20))
    profile = None
    Ctl = Vendors_Set()

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def init_profile(self):
        print("init")
        if self.MongoID is None:
            self.MongoID = '{}'.format(mongo.db.vendor.insert_one({'products':[]}).inserted_id)
            self.add_user()
        self.profile = mongo.db.vendor.find_one({'_id':ObjectId(self.MongoID)})
        self.Ctl.set_ID(ObjectId(self.MongoID))

    def set_data(self, name, data):
        if name is None:return
        if name =='email'and re.match('\w+@\w+',data)is not None:self.email=data
        elif name =='mobile' and re.match('09\d{8}',data)is not None:self.mobile=data
        elif name =='banking' :self.banking=data
        elif name == 'first_name':self.first_name=data
        elif name == 'last_name':self.last_name=data
        # elif name =='MongoID' and re.match('\w{24}',data)is not None:self.MongoID=data
        else: return 'Invalid {}'.format(name)
        self.add_user()
        return

    def get_user_obj(self):
        obj = None
        if self.profile is None:
            self.init_profile()
        if self.profile is not None:
            obj = self.profile
            obj.pop('_id')
        return {
        'id':self.id,
        'username':self.username,
        'email' : self.email,
        'banking' : self.banking,
        'join_date' : self.join_date,
        'MongoID' : self.MongoID,
        'obj' : obj
        }

    def add_user(self):
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return 'User: {}'.format(self.username)
