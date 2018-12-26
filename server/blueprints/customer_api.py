from flask import Flask, url_for, request, redirect, jsonify, Blueprint, session
from flask_login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

from models.User_V import User_V
from models.User_C import User_C

test_mode=False

customer_api = Blueprint('customer_api', __name__, url_prefix='/customer_api')
login_manager = LoginManager()

def test_user():
    session['customer']='True'
    if session.get('vendor') is not None:session.pop('vendor')
    user = User_C.query.filter_by(username="admin333").first()
    login_user(user, remember=True)

@login_manager.user_loader
def load_user(id):
    print('alpha2')
    if 'vendor' in session and session['vendor']=='True':
        user = User_V.query.get(int(id))
        if user is not None and user.profile is None:user.init_profile()
        return user
    if 'customer' in session and session['customer']=='True':
        return User_C.query.get(int(id))
    return

@customer_api.route('/profile')
def profile():
    if test_mode:test_user()
    if not current_user.is_authenticated:
        # test_user()
        return 'login require'
    return jsonify(current_user.get_user_obj())

@customer_api.route('/update_profile', methods=['GET', 'POST'])
def update_profile():
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    try:
        data = request.get_json()
    except Exception as e:
        raise e
    for key, value in data.items():
        current_user.set_data(key,value)

    return jsonify(current_user.get_user_obj())

@customer_api.route('/ping')
def ping():
    return 'pong'

@customer_api.route('/add_to_cart/<id>')
def add_to_cart(id):
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    current_user.add_to_cart(id)
    return 'success'

@customer_api.route('/remove_from_cart/<id>')
def remove_from_cart(id):
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    current_user.remove_from_cart(id)
    return 'success'

@customer_api.route('/cart')
def cart():
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    return jsonify(current_user.cart())

@customer_api.route('/logout')
def logout():
# if 'customer' in session and session['customer']=='True':
    logout_user()
    # session.pop('customer',None)
    return 'logged out!'
# return 'not logged in'

@customer_api.route('/is_logged_in')
def state():
    if test_mode:test_user()

    return '{}'.format(current_user.is_authenticated)

@customer_api.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        print('login')
        if current_user.is_authenticated:
            # return jsonify(current_user.get_user_obj())
            return 'is logged in'
            # return redirect('/ping')
        data = request.form or request.get_json()
        user = User_C.query.filter_by(username=data['username']).first()
        if user is None or not user.check_password(data['password']):
            return 'Invalid username or password'
        login_user(user, remember=True)
        session['customer']='True'
        # return '{}'.format(current_user.is_authenticated)
        return 'success'
        # return jsonify(user.get_user_obj())
    return 'login require'

@customer_api.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if current_user.is_authenticated:
            # return jsonify(current_user.get_user_obj())
            return 'is logged in'
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
        last_name=data['last_name'],
        email=data['email'],
        mobile=data['mobile']
        )
        user.set_password(data['password'])
        user.set_record()
        user.add_user()
        return 'success'
        # return jsonify(user.get_user_obj())
    return 'login require'

@customer_api.route('/check')
def check():
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    return current_user.check()

@customer_api.route('/get_checks')
def get_checks():
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    return jsonify(current_user.get_checks())

@customer_api.route('/cancel_check/<id>')
def cancel_check(id):
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    return current_user.cancel_check(id)
