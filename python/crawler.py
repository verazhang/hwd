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
import string
import time
import uuid
import re

_DOC_ID='EDOC1000079769'
_DATABASE_NAME ='knl'
_DOC_CONTENT = []

#
#console.log(j, h, c, l, b, a, null, k)
#1.2.1 30002949_02_10003 ne40e_troublecase_zh(troublecase)/ne/dc_ne_trouble_100429.html EDOC100007976930002949 02 null null 单板无法注册故障处理
#<topic id="30002949_02_10003" url="ne40e_troublecase_zh(troublecase)/ne/dc_ne_trouble_100429.html" txt="单板无法注册故障处理" libId="30002949" libVersion="02" sub="1"/>
def ModelProductDoc(docid,proid,pro,user_id):
    return {'_id':cUIDStr(),
            'docid':docid,
            'proid':proid,
            'pro':pro,
            'user_id':user_id,
            'navtree' : [],
            'created_at':GetNowTime(),
            'updated_at':GetNowTime()
        }

def ModelDocTreeNode(title,targetid,href,ohref,libid,libversion,toclib,tocv,hib,topicid):
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
            'children':[]
          }

def ModelDocContent(content,user_id):
    if content == None:
        return ''
    else:
        return {'_id':cUIDStr(),
            'content':content + '',
            'user_id':user_id,
            'created_at':GetNowTime(),
            'updated_at':GetNowTime()
            }

def GetNowTime():
    return time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))

def cUIDStr():
#    return "".join([str(uuid.uuid1()),"-", "%f"%time.time(),"-","%f"%sp.rand()])
    return "".join([str(uuid.uuid1()),"-","%f"%sp.rand()])

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
#   print("getTocUrl:"+"".join(d))
    return "".join(d)

def print_node(node):  
    print("======================")
    print("node.attrib:%s" % node.attrib) 
    print("node.attrib['libId']:%s" % node.attrib['libId'])

def getSubMenu(libid,toclib,topicid,hib,libv,KnlDocTreeNode) :  
    muneUrl =r'http://support.huawei.com/hedex/navi/navi.do?libId='+libid+'&libVersion=02&tocLib='+toclib+'&tocV=02&hib='+hib+'&topicId='+topicid
    muneContent = urllib.request.urlopen(muneUrl).read()   
    muneSoup = ElementTree.fromstring(muneContent)
    lst_node = muneSoup.getiterator("topic")
    for idx,node in enumerate(lst_node):  
        changUrl = getTocUrl(hib+'.%d'%(idx+1),topicid,node.attrib['url'],libid,libv,'','',node.attrib['txt'])
        docc = ModelDocContent(getUrlContent(changUrl),'5406')
        targetid = getTargetID(docc)
        if targetid !='':
           _DOC_CONTENT.append(docc)
        KnlDocTreeNode['children'].append(ModelDocTreeNode(node.attrib['txt'],targetid,changUrl,node.attrib['url'],node.attrib['libId'],node.attrib['libVersion'],node.attrib['libId'],node.attrib['libVersion'],hib,node.attrib['id']))
    return 

def getUrlContent(cUrl):
    if cUrl.find("http://support.huawei.com") == -1:
        cUrl = 'http://support.huawei.com' + cUrl
    cResContent = urllib.request.urlopen(cUrl).read()   
    cSoup = BeautifulSoup(cResContent,"html.parser")  
    strHtml= cSoup('html')
#    print('抓取网页长度%d'%len(strHtml)+'\r')
    if len(strHtml)>0 :
       return strHtml[0].prettify()
    return ''

def getTargetID(docc):
    if isinstance(docc,str) :
       return ''
    return docc['_id']

def insertData(jsonObj,table):
    _DB_CONN[table].insert(jsonObj)

def main():
    conn = MC('mongodb://localhost:27017/')
    global _DB_CONN 
    _DB_CONN = conn[_DATABASE_NAME] # 连接数据库名 
    url = r"http://support.huawei.com/hedex/hdx.do?docid="+_DOC_ID
    resContent = urllib.request.urlopen(url).read()   
    soup = BeautifulSoup(resContent,"html.parser")  
    ul= soup.findAll(id='rootUL')  
    lis = ul[len(ul)-1].findAll('li')
    KnlDoc = ModelProductDoc(_DOC_ID,'NE40E&80E&5000E','NE40E&80E&5000E','5406')
    for liIter in lis : 
#        print("********************************************************")
#        print(liIter['id'],liIter['hib'],liIter['libid'],liIter['libv'])
        aTag = liIter.findAll('a')
        for aIter in aTag :  
#            print(aIter.string,'http://support.huawei.com'+aIter['href'],)
            docc = ModelDocContent(getUrlContent(aIter['href']),'5406')
            targetid = getTargetID(docc)
            if targetid !='':
                _DOC_CONTENT.append(docc)
            KnlDocTreeNode = ModelDocTreeNode(aIter.string,targetid,aIter['href'],aIter['href'],liIter['libid'],liIter['libv'],liIter['libid'],liIter['libv'],liIter['hib'],liIter['id'])
            KnlDoc['navtree'].append(KnlDocTreeNode)
        if liIter['sub'] == '1':
            getSubMenu(liIter['libid'],liIter['libid'],liIter['id'],liIter['hib'],liIter['libv'],KnlDocTreeNode)
        
        print("抓取网页文档*********************************************",len(_DOC_CONTENT))
    insertData(KnlDoc,'doc')
    insertData(_DOC_CONTENT,'doccontent')
    
if __name__ == '__main__':
   main()


#re = urllib2.Request(url)  
#resouce = urllib2.urlopen(re).read()  
#open("wall.jpg","wb").write(resouce)