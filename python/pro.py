#!/usr/bin/env  python3  
#!-*- coding:utf-8 -*-  
#@author    mlop  
#@date  2018-03-02
#pip install numpy 
#pip install scipy

from pymongo import  MongoClient as MC 
from xml.etree import ElementTree
from bs4 import BeautifulSoup  
import urllib.request
import scipy as sp
import logging
import logging.config
import string
import json
import time
import uuid
import re
import os

_PRO_LIST=[]
_DATABASE_NAME ='knl'

def ModelProductList(proname,type,family):
    return {'_id':cUIDStr(),
            'proname':proname,
            'type':type,
            'family':family,
            'created_at':GetNowTime(),
            'updated_at':GetNowTime()
        }

def GetNowTime():
    return time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))

def cUIDStr():
    return "".join([str(uuid.uuid1()),"-","%f"%sp.rand()])

def processJson(inputJsonFile):  
    fin = open(inputJsonFile, encoding="utf-8")  
    file = json.load(fin)
    for eachLine in file: 
        print(eachLine)
        _PRO_LIST.append(ModelProductList(eachLine['name'],eachLine['type'],eachLine['family']))
    print(len(_PRO_LIST))
    fin.close() 

def insertData(jsonObj,table):
    _DB_CONN[table].insert(jsonObj)

def main():
    conn = MC('mongodb://localhost:27017/')
    global _DB_CONN 
    _DB_CONN = conn[_DATABASE_NAME] # 连接数据库名 
    processJson('../public/data/pro.json')
    insertData(_PRO_LIST,'pro_type')
    
def setup_logging(
    default_path='logging.json', 
    default_level=logging.INFO,
    env_key='LOG_CFG'
):
    path = default_path
    value = os.getenv(env_key, None)
    if value:
        path = value
    if os.path.exists(path):
        with open(path, 'rt') as f:
            config = json.load(f)
        logging.config.dictConfig(config)
    else:
        logging.basicConfig(level=default_level)


logger = logging.getLogger(__name__)
if __name__ == '__main__':
    setup_logging()
    main()
