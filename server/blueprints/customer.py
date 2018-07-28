from flask import Flask, url_for, request, redirect, jsonify, Blueprint
from flask_login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

from models.User_C import User_C

customer = Blueprint('customer', __name__, url_prefix='/customer')

login_manager = LoginManager()

@login_manager.user_loader
def load_user(id):
    return User_C.query.get(int(id))

@customer.route('/ping')
def pong():
    return 'pong'

@customer.route('/logout')
def logout():
    logout_user()
    return 'logged out!'

@customer.route('/is_logged_in')
def state():
    return '{}'.format(current_user.is_authenticated)

@customer.route('/hi')
@login_required
def hi():
    return 'Hello, {}'.format(current_user.username)


@customer.route('/login', methods=['GET', 'POST'])
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
