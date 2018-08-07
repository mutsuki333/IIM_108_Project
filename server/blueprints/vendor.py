from flask import Flask, url_for, request, redirect, jsonify, Blueprint, render_template

from blueprints import vendor_api as api

vendor = Blueprint('vendor', __name__, url_prefix='/vendor')

@vendor.route('/ping')
def ping():
    return api.ping()

@vendor.route('/test',  methods=['GET', 'POST'])
def test():
    return api.update_user_profile()

@vendor.route('/')
@vendor.route('/index')
def home():
    return render_template('vendor-app.html')
