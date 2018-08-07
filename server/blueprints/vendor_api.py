from flask import Flask, url_for, request, redirect, jsonify, Blueprint
from flask_login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

from models.User_V import User_V

vendor_api = Blueprint('vendor_api', __name__, url_prefix='/vendor_api')
login_manager = LoginManager()

@login_manager.user_loader
def load_user(id):
    user = User_V.query.get(int(id))
    if user is not None and user.profile is None:user.init_profile()
    return user

@vendor_api.route('/ping')
def ping():
    return 'pong'

@vendor_api.route('/profile')
def profile():
    if not current_user.is_authenticated:
        return 'login require'
    return jsonify(current_user.get_user_obj())

@vendor_api.route('/update_user_profile', methods=['GET', 'POST'])
def update_user_profile():
    if not current_user.is_authenticated:
        return 'login require'
    try:
        data = request.get_json()
    except Exception as e:
        raise e
    for key, value in data.items():
        if current_user.set_data(key,value) is not None:
            return current_user.set_data(key,value)
    current_user.init_profile()
    return jsonify(current_user.get_user_obj())

@vendor_api.route('/update_info', methods=['POST'])
def update_info():
    if not current_user.is_authenticated:
        return 'login require'
    try:
        data = request.get_json()
    except Exception as e:
        raise e
    current_user.Ctl.set_profile(data)
    current_user.init_profile()
    return jsonify(current_user.get_user_obj()['obj'])

@vendor_api.route('/new_category/<name>')
def new_category(name):
    if not current_user.is_authenticated:
        return 'login require'
    result = current_user.Ctl.new_category(name)
    if not result[0]:return result[1]
    current_user.init_profile()
    return jsonify(current_user.get_user_obj()['obj'])

@vendor_api.route('/item_list')
def item_list():
    if not current_user.is_authenticated:
        return 'login require'
    result = current_user.Ctl.item_list()
    if not result[0]:return result[1]
    return jsonify(result[1])

@vendor_api.route('/update_items/<cat_name>', methods=['POST'])
def update_items(cat_name):
    if not current_user.is_authenticated:
        return 'login require'
    try:
        data = request.get_json()
    except Exception as e:
        raise e
    result = current_user.Ctl.update_items(cat_name,data)
    if not result[0]:return result[1]
    return redirect(url_for('vendor_api.item_list'))

@vendor_api.route('/logout')
def logout():
    logout_user()
    return 'logged out!'

@vendor_api.route('/is_logged_in')
def state():
    return '{}'.format(current_user.is_authenticated)

@vendor_api.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if current_user.is_authenticated:
            return jsonify(current_user.get_user_obj())
        data = request.form or request.get_json()
        user = User_V.query.filter_by(username=data.get('username')).first()
        if user is None or not user.check_password(data.get('password')):
            return 'Invalid username or password'
        login_user(user, remember=True)
        return jsonify(user.get_user_obj())
    return 'login require'

@vendor_api.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if current_user.is_authenticated:
            return jsonify(current_user.get_user_obj())
        data = request.form or request.get_json()
        q = User_V.query.filter_by(username=data.get('username')).first()
        if q is not None:
            return 'Please use a different username.'
        user = User_V(username=data.get('username'))
        user.set_password(data.get('password'))
        user.add_user()
        return jsonify(user.get_user_obj())
    return 'login require'