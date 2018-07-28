from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required


app = Flask(__name__)
# db = SQLAlchemy(app)
# socketio = SocketIO(app)
app.config.update(
    DEBUG=True,
    # SECRET_KEY='secret_xxx',
    SQLALCHEMY_DATABASE_URI = 'mysql://username:password@localhost/db_name',
    SQLALCHEMY_TRACK_MODIFICATIONS = False,
)

# login_manager = LoginManager()
# login_manager.init_app(app)
from models.User_C import db
db.init_app(app)
from blueprints.customer import login_manager
login_manager.init_app(app)

# routes
from blueprints.customer import customer
app.register_blueprint(customer)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)
