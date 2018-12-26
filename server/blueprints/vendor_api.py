from flask import Flask, url_for, request, redirect, jsonify, Blueprint, session
from flask_login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

from models.User_V import User_V
from models.User_C import User_C

test_mode=True

vendor_api = Blueprint('vendor_api', __name__, url_prefix='/vendor_api')
login_manager = LoginManager()

def test_user():
    user = User_V.query.filter_by(username="admin333").first()
    if user.profile is None:user.init_profile()
    login_user(user, remember=True)



@login_manager.user_loader
def load_user(id):
    print('alpha1')
    if 'vendor' in session and session['vendor']=='True':
        user = User_V.query.get(int(id))
        if user is not None and user.profile is None:user.init_profile()
        return user
    if 'customer' in session and session['customer']=='True':
        return User_C.query.get(int(id))
    return

@vendor_api.route('/ping')
def ping():
    return 'pong'

@vendor_api.route('/profile')
def profile():
    if test_mode:test_user()
    if not current_user.is_authenticated:
        # test_user()
        return 'login require'
    return jsonify(current_user.get_user_obj())

@vendor_api.route('/update_user_profile', methods=['GET', 'POST'])
def update_user_profile():
    if test_mode:test_user()
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
    if test_mode:test_user()
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
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    result = current_user.Ctl.new_category(name)
    if not result[0]:return result[1]
    return '{}'.format(result[1])
    # current_user.init_profile()
    # return jsonify(current_user.get_user_obj()['obj'])

@vendor_api.route('/delete_category/<name>')
def delete_category(name):
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    result = current_user.Ctl.delete_category(name)
    if not result[0]:return result[1]
    return '{}'.format(result[1])

@vendor_api.route('/item_list')
def item_list():
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    result = current_user.Ctl.item_list()
    if not result[0]:return result[1]
    return jsonify(result[1])

@vendor_api.route('/update_items/<cat_name>', methods=['POST'])
@vendor_api.route('/update_items/<cat_name>/<item_index>', methods=['POST'])
def update_items(cat_name,item_index=None):
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    try:
        data = request.get_json()
    except Exception as e:
        raise e
    if item_index is None:
        result = current_user.Ctl.update_items(cat_name,data)
    else:
        result = current_user.Ctl.update_items_index(cat_name,data,item_index)
    return result[1]
    # if not result[0]:return result[1]
    # return redirect(url_for('vendor_api.item_list'))

@vendor_api.route('/delete_items/<cat_name>/<item_name>')
def delete_items(cat_name,item_name):
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    result = current_user.Ctl.delete_items(cat_name,item_name)
    print(result)
    if not result[0]:return result[1]
    return result[1]

@vendor_api.route('/logout')
def logout():
# if 'vendor' in session and session['vendor']=='True':
    logout_user()
    if 'vendor' in session and session['vendor']=='True':
        session.pop('vendor',None)
    if 'customer' in session and session['customer']=='True':
        session.pop('customer',None)
    return 'logged out!'
# return 'not logged in'

@vendor_api.route('/is_logged_in')
def state():
    if test_mode:test_user()
    return '{}'.format(current_user.is_authenticated)

@vendor_api.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if current_user.is_authenticated:
            # return jsonify(current_user.get_user_obj())
            return 'is logged in'
        data = request.form or request.get_json()
        user = User_V.query.filter_by(username=data.get('username')).first()
        if user is None or not user.check_password(data.get('password')):
            return 'Invalid username or password'
        login_user(user, remember=True)
        session['vendor']='True'
        return 'success'
        # return jsonify(user.get_user_obj())
    return 'login require'

@vendor_api.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if current_user.is_authenticated:
            # return jsonify(current_user.get_user_obj())
            return 'is logged in'
        data = request.form or request.get_json()
        q = User_V.query.filter_by(username=data.get('username')).first()
        if q is not None:
            return 'Please use a different username.'
        user = User_V(
            username=data.get('username'),
            first_name=data['first_name'],
            last_name=data['last_name'],
            mobile=data['mobile'],
            email=data['email']
        )
        user.set_password(data.get('password'))
        user.init_profile()
        del data['username']
        del data['first_name']
        del data['last_name']
        del data['mobile']
        del data['password']
        del data['email']
        user.Ctl.set_profile(data)
        user.add_user()
        return 'success'
        # return jsonify(user.get_user_obj())
    return 'login require'

@vendor_api.route('/get_checks')
def get_checks():
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    return jsonify(current_user.get_checks())

@vendor_api.route('/cancel_check/<order>/<index>')
def cancel_check(order,index):
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    current_user.cancel_check(order,index)
    return 'success'

@vendor_api.route('/accomplish_check/<order>/<index>')
def accomplish_check(order,index):
    if test_mode:test_user()
    if not current_user.is_authenticated:
        return 'login require'
    current_user.accomplish_check(order,index)
    return 'success'
