# import re, uuid
from bson.objectid import ObjectId
from flask_pymongo import PyMongo

mongo = PyMongo()
# img_mongo = PyMongo()

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
        if mongo.db.category.find_one({'vendorID':self.vendor_ID,'category_name':name}) is not None:
            return [False,"category name duplicated"]
        new_cat = mongo.db.category.insert_one({
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

    # def delete_category(self,name):
    #     if self.vendor_ID is None:
    #         return [False,"vendor_ID is None"]
    #     obj = mongo.db.vendor.find_one({'_id':self.vendor_ID})
    #     if obj is None: return [False,"No vendor object"]
    #     if mongo.db.category.find_one({'vendorID':self.vendor_ID,'category_name':name}) is None:
    #         return [False,"no category"]



    def item_list(self):
        if self.vendor_ID is None:
            return [False,"vendor_ID is None"]
        obj=[]
        for x in mongo.db.category.find({'vendorID':self.vendor_ID}):
            x.update({'item':[]})
            for y in mongo.db.items.find({'categoryID':x.get('_id')}):
                y.pop('_id')
                y.pop('categoryID')
                x['item'].append(y)
            # print(x)
            x.pop('_id')
            x.pop('vendorID')
            obj.append(x)
        return [True,obj]

    def update_items(self,name,obj):
        if self.vendor_ID is None:
            return [False,"vendor_ID is None"]
        doc = mongo.db.category.find_one({'vendorID':self.vendor_ID,'category_name':name})
        if doc is None: return [False,"No category"]
        if mongo.db.items.find_one({'categoryID':ObjectId(doc['_id']),'item.name':obj.get('name')})is None:
        # if mongo.db.items.find_one({'vendorID':self.vendor_ID,'category_name':name,'items.name':obj.get('name')})
            result = mongo.db.items.insert_one({'categoryID':ObjectId(doc['_id']),'index':doc['new_item_index'] + 1,'item':obj})
            mongo.db.category.update_one({'vendorID':self.vendor_ID,'category_name':name},
            {'$push':{'items':'{}'.format(result.inserted_id),'item_order':doc['new_item_index']},'$inc':{'new_item_index':1}})
            # result = mongo.db.items.update_one({'vendorID':self.vendor_ID,'category_name':name},
            # {'$set':{'items.$[elem]':obj}},upsert=True,
            # array_filters=[{'elem.index': obj['index']}]
            # )
        else:
            result = mongo.db.items.update_one({'categoryID':ObjectId(doc['_id']),'item.name':obj.get('name')},
            {'$set':{'item':obj}})
            if result.modified_count == 0: return [False,'name duplicated']
        if result is None:
            return [False,"No category name {}".format(name)]
        return [True,"success"]
