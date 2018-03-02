from pymongo import MongoClient
conn = MongoClient('mongodb://localhost:27017/')
db = conn.testdb
data = [{'_id': 1, 'a':'a'},{'_id': 2, 'a':'b'}]
print(type(data),data)
db.collection.insert(data) 