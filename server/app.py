from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
import sys

# db_user=sys.argv[1]
# db_host=sys.argv[2]

db_user='root'
db_host='localhost'

app = Flask(__name__)
# db = SQLAlchemy(app)
# socketio = SocketIO(app)
app.config.update(
    DEBUG=True,
    SECRET_KEY='secret_xxx',
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://{}:admin333@{}/customer'.format(db_user,db_host),
    SQLALCHEMY_TRACK_MODIFICATIONS = False,

)

# models User_C initialization
from models.User_C import db as cdb
cdb.init_app(app)
from models.User_C import shopDB as user_shop_mongo
user_shop_mongo.init_app(app,uri='mongodb://localhost:27017/shopping')
# models User_V initialization
from models.User_V import mongo, db
mongo.init_app(app, uri='mongodb://localhost:27017/vendors')
db.init_app(app)
# models Vendors_Set initialization
from models.Vendors_Set import mongo as vendors_db
vendors_db.init_app(app, uri='mongodb://localhost:27017/vendors')

# blueprints initialization
from blueprints.customer_api import login_manager as cl
cl.init_app(app)
from blueprints.vendor_api import login_manager as vl
vl.init_app(app)
from blueprints.files import db as fd
fd.init_app(app, uri='mongodb://localhost:27017/img')
from blueprints.site_api import db as sd
fd.init_app(app, uri='mongodb://localhost:27017/vendors')


# routes
from blueprints.customer_api import customer_api
app.register_blueprint(customer_api)
from blueprints.vendor_api import vendor_api
app.register_blueprint(vendor_api)
from blueprints.site_api import site_api
app.register_blueprint(site_api)

from blueprints.files import files
app.register_blueprint(files)

from blueprints.vendor import vendor
app.register_blueprint(vendor)

@app.route('/')
def index():
    return 'Home'

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)
