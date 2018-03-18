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

def ModelUnit(title):
    return {'_id':cUIDStr(),
            'title':title,
            'unitid':cUIDStr1(),
            'children':[],
            'created_at':GetNowTime(),
            'updated_at':GetNowTime()
        }

def GetNowTime():
    return time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))

def cUIDStr():
    return "".join([str(uuid.uuid1()),"-","%f"%sp.rand()])

def cUIDStr1():
    return "".join(["%f"%sp.rand()])

def insertData(jsonObj,table):
    _DB_CONN[table].insert(jsonObj)

def main():
    conn = MC('mongodb://localhost:27017/')
    global _DB_CONN 
    _DB_CONN = conn[_DATABASE_NAME] # 连接数据库名 
    unit1 = ['湖北省公司','北京公司']
    unit11 = ['武汉市分公司','孝感分公司','随州分公司']
    unit12 = ['朝阳区分公司','西城区分公司','东城区分公司','海淀区分公司']
    _UNIT_LIST =[]
    for u1 in unit1:
        u = ModelUnit(u1)
        if u1 =='湖北省公司':
           for usub in unit11:
               u['children'].append(ModelUnit(usub))
           _UNIT_LIST.append(u)
        if u1 =='北京公司':
           for usub in unit12:
               u['children'].append(ModelUnit(usub))
           _UNIT_LIST.append(u)
    insertData(_UNIT_LIST,'unit')
    
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
