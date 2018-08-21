from flask import Flask, url_for, request, redirect, Blueprint
from bson.objectid import ObjectId
from flask_pymongo import PyMongo


site_api = Blueprint('site_api', __name__, url_prefix='/site_api')
db =  PyMongo()

@site_api.route('item_list/<venderID>')
def itemList(venderID):
    if venderID is None:
        abort(404)
    return '{}'.format(venderID)
