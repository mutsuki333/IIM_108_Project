# import re, uuid
from bson.objectid import ObjectId
from flask_pymongo import PyMongo

mongo = PyMongo()
img_mongo = PyMongo()

class Vendors_Set():
    vendor_ID = None
    def __init__(self,objID=None):
        self.vendor_ID=objID

    def set_ID(self,objID):
        self.vendor_ID=objID
    def set_profile(self,obj):
        mongo.db.vendor.update_one({'_id':self.vendor_ID},{'$set':{'info':obj}})

    # def upload_img(self,file_type,file):
    #     if file_type is not None:
    #         filename='{}.{}'.format(str(uuid.uuid4().hex),file_type.split('.')[-1])
    #     else:
    #         filename = '{}.jpg'.format(str(uuid.uuid4().hex))
    #     return '{}'.format(img_mongo.save_file(filename,file))


    def new_category(self,name):
        if self.vendor_ID is None:
            return [False,"vendor_ID is None"]
        obj = mongo.db.vendor.find_one({'_id':self.vendor_ID})
        if obj is None: return [False,"No vendor object"]
        if mongo.db.items.find_one({'vendorID':self.vendor_ID,'category_name':name}) is not None:
            return [False,"category name duplicated"]
        new_cat = mongo.db.items.insert_one({
        'vendorID':self.vendor_ID,
        'category_name':name,
        'new_item_index':0,
        'item_order':[],
        'items':[]
        })
        num = len(obj['products'])
        mongo.db.vendor.update_one({'_id':self.vendor_ID},
        {'$push':{'products':{'index':num+1,'name':name,'key':'{}'.format(new_cat.inserted_id)}}})
        return [True,"new category added"]

    def item_list(self):
        if self.vendor_ID is None:
            return [False,"vendor_ID is None"]
        obj=[]
        for x in mongo.db.items.find({'vendorID':self.vendor_ID}):
            x.pop('_id')
            x.pop('vendorID')
            obj.append(x)
        return [True,obj]

        # obj = mongo.db.vendor.find_one({'_id':self.vendor_ID})
        # if obj is None: return [False,"No vendor object"]
        # list = {}
        # for x in obj['products']:
        #     mongo.db.items.find
        #     print(x['key'])

    def update_items(self,name,obj):
        if self.vendor_ID is None:
            return [False,"vendor_ID is None"]
        doc = mongo.db.items.find_one({'vendorID':self.vendor_ID,'category_name':name})
        if doc is None: return [False,"No category"]
        if mongo.db.items.find_one({'vendorID':self.vendor_ID,
        'category_name':name,'items.name':obj.get('name')}) is None:
            if obj.get('index') is None:
                obj['index'] = doc['new_item_index'] + 1
                result = mongo.db.items.update({'vendorID':self.vendor_ID,'category_name':name},
                {'$push':{'items':obj,'item_order':obj['index']},'$inc':{'new_item_index':1}})
            else:
                result = mongo.db.items.update_one({'vendorID':self.vendor_ID,'category_name':name},
                {'$set':{'items.$[elem]':obj}},upsert=True,
                array_filters=[{'elem.index': obj['index']}]
                )
        else:
            result = mongo.db.items.update_one({'vendorID':self.vendor_ID,'category_name':name},
            {'$set':{'items.$[elem]':obj}},upsert=True,
            array_filters=[{'elem.index': obj.get('index'),'elem.name':obj['name']}]
            )
            if result.modified_count == 0: return [False,'name duplicated']
        if result is None:
            return [False,"No category name {}".format(name)]
        return [True,"success"]
