from flask import Flask, url_for, request, redirect, Blueprint, jsonify
from bson.objectid import ObjectId
from flask_pymongo import PyMongo

from models.User_V import User_V
from models.User_C import User_C

site_api = Blueprint('site_api', __name__, url_prefix='/site_api')
mongo =  PyMongo()

@site_api.route('/vendor_list')
def vendor_list():
    obj=[]
    for x in mongo.db.vendor.find({}):
        x['_id']='{}'.format(x['_id'])
        obj.append(x)
    return jsonify(obj)

@site_api.route('/item_list/<ID>')
def item_list(ID):
    obj=[]
    for x in mongo.db.category.find({'vendorID':ObjectId(ID)}):
        x.update({'item':[]})
        for y in mongo.db.items.find({'categoryID':x.get('_id')}):
            y['_id']='{}'.format(y['_id'])
            y['categoryID']='{}'.format(y['categoryID'])
            # y.pop('_id')
            # y.pop('categoryID')
            x['item'].append(y)
        # print(x)
        x['_id']='{}'.format(x['_id'])
        x['vendorID']='{}'.format(x['vendorID'])
        # x.pop('_id')
        # x.pop('vendorID')
        obj.append(x)
    return jsonify(obj)

@site_api.route('/pp')
def pp():
    return 'yy'

@site_api.route('/vendor_profile/<id>')
def vprofile(id):
    user = User_V.query.filter_by(MongoID=id).first()
    return jsonify(user.get_user_obj())

@site_api.route('/customer_profile/<id>')
def cprofile(id):
    user = User_C.query.filter_by(MongoID=id).first()
    return jsonify(user.get_user_obj())
