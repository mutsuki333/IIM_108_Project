from flask import Flask, url_for, request, redirect, Blueprint
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
import uuid


files = Blueprint('files', __name__, url_prefix='/files')
db =  PyMongo()

@files.route('/upload/<filename>')
def file(filename):
    return db.send_file(filename=filename)

@files.route('/upload', methods=["POST"])
@files.route('/upload/<base>/<filename>', methods=["POST"])
def upload(filename=None,base=None):
    filename = filename or request.args.get('filename')
    if base is None:
        base = request.args.get('base') or 'fs'
    if filename is None:
        filename = '{}.jpg'.format(str(uuid.uuid4().hex))
    id_str=db.save_file(filename,request.files["file"],base=base)
    return url_for('files.file_id',id_str=id_str,base=base)

@files.route('/', methods=['POST'])
@files.route('/<base>', methods=['POST'])
@files.route('/<base>/<filename>', methods=['POST'])
def items(base=None,filename=None):
    filename = filename or request.args.get('filename')
    base = base or request.args.get('base')
    if filename is None:
        filename = '{}.jpg'.format(str(uuid.uuid4().hex))
    if base is None:
        id_str = db.save_file(filename,request.files["file"])
        return url_for('files.file_id',id_str=id_str)
    else:
        id_str = db.save_file(filename,request.files["file"],base=base)
        return url_for('files.file_id',id_str=id_str,base=base)

@files.route('/')
@files.route('/<base>')
@files.route('/<base>/<id_str>')
def file_id(id_str=None,base=None):
    id_str = id_str or request.args.get('id_str')
    base = base or request.args.get('base')
    if base is None:return db.send_file(id_str=id_str)
    else:return db.send_file(base=base,id_str=id_str)

@files.route('/delete')
@files.route('/delete/<base>/<id_str>')
def delete_id(id_str=None,base=None):
    id_str = id_str or request.args.get('id_str')
    base =  base or request.args.get('base')
    print(base)
    if base is None:return db.delete_id(id_str=id_str)
    else:return db.delete_id(base=base,id_str=id_str)
