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

_DOC_ID='EDOC1000036635'
_DATABASE_NAME ='knl'

def ModelProductDoc(docid,proid,pro,user_id):
    return {'_id':cUIDStr(),
            'docid':docid,
            'proid':proid,
            'pro':pro,
            'user_id':user_id,
            'created_at':GetNowTime(),
            'updated_at':GetNowTime()
        }

def ModelNullNode():
    return {'_id':'' }

def ModelDocTreeNode(title,targetid,href,ohref,libid,libversion,toclib,tocv,hib,topicid,sub,content,user_id,pro,parentid):
    return {'_id':cUIDStr(),
            'title':title,
            'targetid':targetid,
            'href':href,
            'ohref':ohref,
            'libid':libid,
            'libversion':libversion,
            'toclib':toclib,
            'tocv':tocv,
            'hib': hib,
            'topicid':topicid,
            'sub':sub,
            'content':content + '',
            'user_id':user_id,
            'pro':pro,
            'parentid':parentid,
            'created_at':GetNowTime(),
            'updated_at':GetNowTime()
          }

def GetNowTime():
    return time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))

def cUIDStr():
    return "".join([str(uuid.uuid1()),"-","%f"%sp.rand()])

def getTreeJson(tjson):  
    fin1 = open(tjson, encoding="utf-8")  
    nvt = json.load(fin1)
    global _PRO_TREE 
    global _PRO_NAME 
    _PRO_TREE = nvt['navtree']
    _PRO_NAME = nvt['pro']
    fin1.close()                                            #关闭文件  

def getTreeContentJson(tcjson):  
    fin2 = open(tcjson, encoding="utf-8") 
    global _PRO_TREE_CONTENT  
    _PRO_TREE_CONTENT = json.load(fin2)
    fin2.close() 

def getTreeNodeContent(_id):
    for cnt in _PRO_TREE_CONTENT:
        if cnt['_id'] == _id :
           return cnt['content']
    return ''
        
def getTreeNode(node,parentnode):
    for n in node: 
        if len(n['children']) > 1 :
           getTreeNode(n['children'],n)
        print(n['_id'],n['title'])
        _DOC_CONTENT.append(ModelDocTreeNode(n['title'],n['targetid'],n['href'],n['ohref'],n['libid'],n['libversion'],n['toclib'],n['tocv'],n['hib'],n['topicid'],n['sub'],getTreeNodeContent(n['targetid']),'5406',_PRO_NAME,parentnode['_id']))
    
def insertData(jsonObj,table):
    _DB_CONN[table].insert(jsonObj)
    
def main():
    conn = MC('mongodb://localhost:27017/')
    global _DB_CONN 
    _DB_CONN = conn[_DATABASE_NAME] # 连接数据库名 
    global _DOC_CONTENT
    _DOC_CONTENT = []
    getTreeJson('../public/data/tree.json')
    getTreeContentJson('../public/data/docs.json')
#    logger.info('类型名称%s,%s',_PRO_NAME,json.dumps(_PRO_TREE))
    getTreeNode(_PRO_TREE,ModelNullNode())
    print(len(_DOC_CONTENT))
    insertData(_DOC_CONTENT,'document_content')
    
    
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
