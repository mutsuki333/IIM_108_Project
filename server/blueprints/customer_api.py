from flask import Flask, url_for, request, redirect, jsonify, Blueprint
from flask_login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

from models.User_C import User_C

customer_api = Blueprint('customer_api', __name__, url_prefix='/customer_api')

login_manager = LoginManager()

@login_manager.user_loader
def load_user(id):
    return User_C.query.get(int(id))

@customer_api.route('/profile')
def profile():
    if not current_user.is_authenticated:
        return redirect(url_for('ping'))
    return jsonify(current_user.get_user_obj())

@customer_api.route('/update_profile', methods=['GET', 'POST'])
def update_profile():
    if not current_user.is_authenticated:
        return redirect(url_for('customer_api.ping'))
    try:
        data = request.get_json()
    except Exception as e:
        raise e
    for key, value in data.items():
        if current_user.set_data(key,value) is not None:
            return current_user.set_data(key,value)

    return jsonify(current_user.get_user_obj())


@customer_api.route('/ping')
def ping():
    return 'pong'

@customer_api.route('/logout')
def logout():
    logout_user()
    return 'logged out!'

@customer_api.route('/is_logged_in')
def state():
    return '{}'.format(current_user.is_authenticated)

# @customer_api.route('/')

@customer_api.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if current_user.is_authenticated:
            return jsonify(current_user.get_user_obj())
            # return '{}'.format(current_user.id)
            # return redirect('/ping')
        try:
            data = request.get_json()
        except Exception as e:
            raise e
        user = User_C.query.filter_by(username=data['username']).first()
        if user is None or not user.check_password(data['password']):
            return 'Invalid username or password'
        login_user(user, remember=True)
        return jsonify(user.get_user_obj())
    return redirect(url_for('ping'))

@customer_api.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if current_user.is_authenticated:
            return jsonify(current_user.get_user_obj())
        try:
            data = request.get_json()
        except Exception as e:
            raise e
        q = User_C.query.filter_by(username=data['username']).first()
        if q is not None:
            return 'Please use a different username.'
        user = User_C(
        username=data['username'],
        first_name=data['first_name'],
        last_name=data['last_name']
        )
        user.set_password(data['password'])
        user.set_history()
        user.add_user()
        return jsonify(user.get_user_obj())
    return redirect(url_for('ping'))
