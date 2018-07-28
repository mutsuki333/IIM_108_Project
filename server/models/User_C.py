from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy();

'''
class for customer user.
'''

class User_C(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password = db.Column(db.String(128))
    # password_hash = db.Column(db.String(128))
    level = db.Column(db.Integer)

    # def set_password(self, password):
    #     self.password = generate_password_hash(password)
    #
    # def check_password(self, password):
    #     print ('password:{:s} , self:{:s}'.format(password,self.password))
    #     return check_password_hash(self.password, password)
    def check_password(self, password):
        return self.password==password

    def get_user_obj(self):
        return {
        'is_authenticated':self.is_authenticated,
        'id':self.id,
        'username':self.username,
        'level':self.level
        }

    def __repr__(self):
        return 'User: {}'.format(self.username)
