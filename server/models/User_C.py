import re, time
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy();
shopDB = PyMongo();
item = PyMongo()

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
    photo = db.Column(db.String(120))
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
        return self.record

    def add_to_cart(self,id):
        shopDB.db.customer_records.update_one({'_id':ObjectId(self.MongoID)},
        {'$push':{'cart':id}})

    def remove_from_cart(self,id):
        shopDB.db.customer_records.update_one({'_id':ObjectId(self.MongoID)},
        {'$pull':{'cart':id}},False)

    def cart(self):
        cart=shopDB.db.customer_records.find_one({'_id':ObjectId(self.MongoID)})['cart']
        obj = []
        for x in cart:
            for y in item.db.items.find({'_id':ObjectId(x)}):
                y['_id']='{}'.format(y['_id'])
                y['categoryID']='{}'.format(y['categoryID'])
                # y.pop('_id')
                # y.pop('categoryID')
                y.pop('index')
                y['item'].pop('ctr')
                obj.append(y)
        return obj

    def set_data(self, name, data):
        if name is None:return
        print(name,data)
        if name =='email'and re.match('\w+@\w+',data)is not None:self.email=data
        elif name =='mobile' and re.match('09\d{8}',data)is not None:self.mobile=data
        elif name =='date_of_birth' and re.match('(19|20)\d{2}-[10]\d-[3210]\d',data)is not None:
            self.date_of_birth=data
        elif name =='gender' and re.match('[mfa]{1}',data)is not None:self.gender=data
        elif name =='photo' :self.photo=data
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
        'photo' : self.photo,
        'mongoID' : self.MongoID
        }

    def add_user(self):
        db.session.add(self)
        db.session.commit()

    def get_checks(self):
        history = shopDB.db.customer_records.find_one({'_id':ObjectId(self.MongoID)})['history']
        obj = []
        for id in history:
            tmp = item.db.order.find_one({'_id':ObjectId(id)})
            tmp['_id']='{}'.format(tmp['_id'])
            obj.append(tmp)
        return obj

    def check(self,t):
        items = self.cart()
        if len(items)<=0:return 'empty cart'
        total = 0
        vendors = []
        i=0
        for x in items:
            x['vendorID']='{}'.format(item.db.category.find_one({'_id':ObjectId(x['categoryID'])},{'vendorID':1})['vendorID'])
            vendors.append({
            'vendor':x['vendorID'],
            'status':'processing',
            'index' : i,
            'item':x['_id']
            })
            total += x['item']['base_price']
            i+=1
            # print(x)
        order={
            'vendors' : vendors,
            'ctr' : len(items),
            'customer' : self.MongoID,
            'items' : items,
            # 'time' : time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
            'time' : t,
            'status' : 'processing',
            'total' : total
        }
        # print(order)
        shopDB.db.customer_records.update_one({'_id':ObjectId(self.MongoID)},{'$set':{'cart':[]}})
        shopDB.db.customer_records.update_one({'_id':ObjectId(self.MongoID)},
        {'$push':{'history':'{}'.format(item.db.order.insert_one(order).inserted_id)}})
        # print(self.get_record())
        return 'success'

    def cancel_check(self,id):
        item.db.order.update_one({'_id':ObjectId(id)},
        {'$set':{'status':'canceling'}})
        item.db.order.update_one({'_id':ObjectId(id)},
        {'$set':{'vendors.$.status':'canceling'}})
        return 'success'

    def __repr__(self):
        return 'User: {}'.format(self.username)
