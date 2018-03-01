#!/usr/bin/env  python  
#!-*- coding:utf-8 -*-  
#@author    Amiber  
#@date  2012-12-01  
#@brief grap the table-data in static-web  
from pymongo import  MongoClient as MC 
from xml.etree import ElementTree
from bs4 import BeautifulSoup  
import urllib.request
import string
import time
import uuid
import re




_DATABASE_NAME ='knl'
#
#console.log(j, h, c, l, b, a, null, k)
#1.2.1 30002949_02_10003 ne40e_troublecase_zh(troublecase)/ne/dc_ne_trouble_100429.html EDOC100007976930002949 02 null null 单板无法注册故障处理
#<topic id="30002949_02_10003" url="ne40e_troublecase_zh(troublecase)/ne/dc_ne_trouble_100429.html" txt="单板无法注册故障处理" libId="30002949" libVersion="02" sub="1"/>
def ProductDoc(docid,proid,pro,user_id):
    return {'_id':str(uuid.uuid1()),
            'docid':docid,
            'proid':proid,
            'pro':pro,
            'user_id':user_id,
            'created_at':GetNowTime(),
            'updated_at':GetNowTime()
        }

def DocTreeNode(title,targetid,href,ohref,libid,libversion,toclib,tocv,hib,topicid):
    return {'_id':str(uuid.uuid1()),
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
            'children':[]
          }

def DocContent(content,user_id):
    if content != '' or type(content) !="<class 'NoneType'>":
        return {'_id':str(uuid.uuid1()),
            'content':urllib.request.quote(content),
            'user_id':user_id,
            'created_at':GetNowTime(),
            'updated_at':GetNowTime()
           }
    return ''


def GetNowTime():
    return time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
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
        changUrl = getTocUrl(hib+'.%d'%(idx+1),topicid,node.attrib['url'],libid,libv,'','',node.attrib['txt'])
        docc = DocContent(getUrlContent(changUrl),'5406')
        targetid = getTargetID(docc)
        if targetid !='':
           docContent.append(docc)
        KnlDocTreeNode['children'].append(DocTreeNode(node.attrib['txt'],targetid,changUrl,node.attrib['url'],node.attrib['libId'],node.attrib['libVersion'],node.attrib['libId'],node.attrib['libVersion'],hib,node.attrib['id']))
    return 
def getUrlContent(cUrl):
    if cUrl.find("http://support.huawei.com") == -1:
        cUrl = 'http://support.huawei.com' + cUrl
    cResContent = urllib.request.urlopen(cUrl).read()   
    cSoup = BeautifulSoup(cResContent,"html.parser")  
    strHtml= cSoup('html')
    print('抓取网页长度%d'%len(strHtml)+'\r')
    if len(strHtml)>0 :
       return strHtml[0]
    return ''

def getTargetID(docc):
    if docc['_id'] !='' :
       return docc['_id']
    return ''

def insertData(jsonObj,table):
    db[table].insert(jsonObj)


conn = MC('mongodb://localhost:27017/')
db = conn[_DATABASE_NAME] # 连接数据库名 


docid = 'EDOC1000079769'
docContent = []
url = r"http://support.huawei.com/hedex/hdx.do?docid=EDOC1000079769"
resContent = urllib.request.urlopen(url).read()   
soup = BeautifulSoup(resContent,"html.parser")  
ul= soup.findAll(id='rootUL')  
lis = ul[len(ul)-1].findAll('li')
for liIter in lis : 
    print("********************************************************")
    print(liIter['id'],liIter['hib'],liIter['libid'],liIter['libv'])
    KnlDoc = ProductDoc(docid,'NE40E&80E&5000E','NE40E&80E&5000E','5406')
    aTag = liIter.findAll('a')  
    for aIter in aTag :  
        print(aIter.string,'http://support.huawei.com'+aIter['href'],)
        docc = DocContent(getUrlContent(aIter['href']),'5406')
        targetid = getTargetID(docc)
        if targetid !='':
           docContent.append(docc)
        KnlDocTreeNode = DocTreeNode(aIter.string,targetid,aIter['href'],aIter['href'],liIter['libid'],liIter['libv'],liIter['libid'],liIter['libv'],liIter['hib'],liIter['id'])
        KnlDoc['navtree']=KnlDocTreeNode
    if liIter['sub'] == '1':
        getsubmenu(liIter['libid'],liIter['libid'],liIter['id'],liIter['hib'],liIter['libv'])
    insertData(KnlDoc,'doc')
    print("********************************************************",len(docContent))
    if len(docContent)>0:
       print('\r\n\r\n抓取网页文档',len(docContent))
       insertData(docContent,'doccontent')


#insertData({"accout":21,"user_name":"xiao"},'test')
#db.col.insert({"accout":21,"user_name":"xiao"})
#for item in db.col.find():
#    print(item)