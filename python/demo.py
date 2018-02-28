#!/usr/bin/env  python  
#!-*- coding:utf-8 -*-  
#@author    Amiber  
#@date  2012-12-01  
#@brief grap the table-data in static-web  
  
from bs4 import BeautifulSoup  
import urllib.request
import re  
import string
from xml.etree import ElementTree
#from pymongo import  MongoClient as MC
#console.log(j, h, c, l, b, a, null, k)
#1.2.1 30002949_02_10003 ne40e_troublecase_zh(troublecase)/ne/dc_ne_trouble_100429.html EDOC100007976930002949 02 null null 单板无法注册故障处理
#<topic id="30002949_02_10003" url="ne40e_troublecase_zh(troublecase)/ne/dc_ne_trouble_100429.html" txt="单板无法注册故障处理" libId="30002949" libVersion="02" sub="1"/>
#待添加函数，获取版本号
def getTocUrl(j, i, c, l, b, a, g, k):
    basePath = '/hedex/'
    f = ""
    if c != '':
        f = c.replace("%", "%25")
        f = f.replace("+", "%2B")
        f = f.replace("#", "%23")
        f = f.replace("&", "%26")
    urlSeparator = '/'
    e = "pages/"
    h = "resources/"
    docid = 'EDOC1000079769'
    if g == True:
        h = ""
    d = [basePath, e, l, urlSeparator, '02', urlSeparator, l, urlSeparator, b, urlSeparator, h, f, "?ft=0&fe=10", "&hib=", j, "&id=", i, "&text=", urllib.request.quote(urllib.request.quote(k)), "&docid=", docid]
    print("getTocUrl:"+"".join(d))
    return "".join(d)

def print_node(node):  
    print("======================")
    print("node.attrib:%s" % node.attrib) 
    print("node.attrib['libId']:%s" % node.attrib['libId'])

def getsubmenu(libid,toclib,topicid,hib,libv) :  
    muneUrl =r'http://support.huawei.com/hedex/navi/navi.do?libId='+libid+'&libVersion=02&tocLib='+toclib+'&tocV=02&hib='+hib+'&topicId='+topicid
    muneContent = urllib.request.urlopen(muneUrl).read()   
    muneSoup = ElementTree.fromstring(muneContent)
    lst_node = muneSoup.getiterator("topic")
    for idx,node in enumerate(lst_node):  
        print_node(node)
        getTocUrl(hib+'.%d'%(idx+1),topicid,node.attrib['url'],libid,libv,'','',node.attrib['txt'])
    return  
  
url = r"http://support.huawei.com/hedex/hdx.do?docid=EDOC1000079769"  
resContent = urllib.request.urlopen(url).read()   
soup = BeautifulSoup(resContent,"html.parser")  
ul= soup.findAll(id='rootUL')  
lis = ul[len(ul)-1].findAll('li')
for liIter in lis : 
        print("********************************************************")
        print(liIter['id'],liIter['hib'],liIter['libid'],liIter['libv'])
        aTag = liIter.findAll('a')  
        for aIter in aTag :  
                print(aIter.string,'http://support.huawei.com'+aIter['href'])
        if liIter['sub'] == '1':
           getsubmenu(liIter['libid'],liIter['libid'],liIter['id'],liIter['hib'],liIter['libv'])
        print

#conn = MC('mongodb://localhost:27017/')
#db = conn.mydb # 连接数据库名 
#db.col.insert({"accout":21,"user_name":"xiao"})
#for item in db.col.find():
#    print(item)