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
import json
import time
import uuid
import re

_DOC_ID=['EDOC1000036635']
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

def ModelDocTreeNode(title,targetid,href,ohref,libid,libversion,toclib,tocv,hib,topicid,sub):
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

def getTocUrl(docid,hib, libid, url, libv, a, g, title):
    basePath = '/hedex/'
    f = ""
    if url != '':
        f = url.replace("%", "%25")
        f = f.replace("+", "%2B")
        f = f.replace("#", "%23")
        f = f.replace("&", "%26")
    urlSeparator = '/'
    e = "pages/"
    h = "resources/"
    if g == True:
        h = ""
    d = [basePath, e, libid, urlSeparator,hib, urlSeparator,libid, urlSeparator,libv, urlSeparator, h, f, "?ft=0&fe=10", "&hib=", hib, "&id=", libid, "&text=", urllib.request.quote(urllib.request.quote(title)), "&docid=", docid]
#   print("getTocUrl:"+"".join(d))
    return "".join(d)

def print_node(node):  
    print("======================")
    print("node.attrib:%s" % node.attrib) 
    print("node.attrib['libId']:%s" % node.attrib['libId'])

def processJson(inputJsonFile):  
    fin = open(inputJsonFile, 'r')  
#    fout = open(outputJsonFile, 'w')  
    for eachLine in fin:  
        line = eachLine.strip().decode('utf-8')                #去除每行首位可能的空格，并且转为Unicode进行处理  
        line = line.strip(',')                                 #去除Json文件每行大括号后的逗号  
        js = None  
        try:  
            js = json.loads(line)                              #加载Json文件  
        except Exception,e:  
            print 'bad line'  
            continue
#对未加载完的数据重新进行加载
        js["xxx"] = xxx                                        #对您需要修改的项进行修改，xxx表示你要修改的内容  
        outStr = json.dumps(js, ensure_ascii = False) + ','    #处理完之后重新转为Json格式，并在行尾加上一个逗号  
#        fout.write(outStr.strip().encode('utf-8') + '\n')      #写回到一个新的Json文件中去  
    fin.close()                                                #关闭文件  
#    fout.close()  

def getSubMenu(docid,libid,toclib,topicid,hib,libv,KnlDocTreeNode) :  
    muneUrl =r'http://support.huawei.com/hedex/navi/navi.do?libId='+libid+'&libVersion='+libv+'&tocLib='+toclib+'&tocV='+libv+'&hib='+hib+'&topicId='+topicid
    print('获取子菜单',muneUrl)
    muneContent = urllib.request.urlopen(muneUrl).read()   
    muneSoup = ElementTree.fromstring(muneContent)
    lst_node = muneSoup.getiterator("topic")
    for idx,node in enumerate(lst_node):  
        changUrl = getTocUrl(docid,getHib(hib,idx),topicid,node.attrib['url'],libv,'','',node.attrib['txt'])
        docc = ModelDocContent(getUrlContent(changUrl),'5406')
        targetid = getTargetID(docc)
        if targetid !='':
           _DOC_CONTENT.append(docc)
        subDocTreeNode = ModelDocTreeNode(node.attrib['txt'],targetid,changUrl,node.attrib['url'],node.attrib['libId'],node.attrib['libVersion'],node.attrib['libId'],node.attrib['libVersion'],hib,node.attrib['id'],node.attrib['sub'])
        print(node.attrib['txt'],node.attrib['sub'],node.attrib['libId'],node.attrib['libId'],node.attrib['id'],getHib(hib,idx),node.attrib['libVersion'])
        if node.attrib['sub'] == '1':
            print('获取下一级菜单\r')
#            getSubMenu(node.attrib['libId'],node.attrib['libId'],node.attrib['id'],getHib(hib,idx),node.attrib['libVersion'],subDocTreeNode)
            getSubMenu(docid,libid,toclib,node.attrib['id'],getHib(hib,idx),node.attrib['libVersion'],subDocTreeNode)
        KnlDocTreeNode['children'].append(subDocTreeNode)
    return 

def getUrlContent(cUrl):
    if cUrl.find("http://support.huawei.com") == -1:
        cUrl = 'http://support.huawei.com' + cUrl
    cResContent = urllib.request.urlopen(cUrl).read()   
    cSoup = BeautifulSoup(cResContent,"html.parser")  
    strHtml= cSoup('body')
#   删除评论区域信息
    strHtml.find('iframe').extract()
#   删除版本信息
    strHtml.find('div',class_='hrcopyright').extract()
    strHtml.find('div',class_='hwcopyright').extract()
#   删除其余多余文档内容
    strHtml.find(id="fbimgDiv").extract()
    strHtml.find('script').extract()
#   print('抓取网页长度%d'%len(strHtml)+'\r')
    if len(strHtml)>0 :
       return strHtml[0].prettify()
    return ''

def getTargetID(docc):
    if isinstance(docc,str) :
       return ''
    return docc['_id']

def getHib(hib,idx):
	return hib+'.%d'%(idx+1)

def insertData(jsonObj,table):
    _DB_CONN[table].insert(jsonObj)

def crawlerUrl(docid):
    url = r"http://support.huawei.com/hedex/hdx.do?docid="+docid
#    proxy=urllib.request.ProxyHandler({'http':proxy_addr})
#    opener=urllib.request.build_opener(proxy,urllib.request.HTTPHandler)
#    urllib.request.install_opener(opener)
    resContent = urllib.request.urlopen(url).read()   
    soup = BeautifulSoup(resContent,"html.parser")  
    ul= soup.findAll(id='rootUL')  
    lis = ul[len(ul)-1].findAll('li')
    title = soup.find(id="libName_A_link")
    print(title.string)
    KnlDoc = ModelProductDoc(docid,title.string,title.string,'5406')
    for liIter in lis : 
        print("********************************************************")
        print(liIter['id'],liIter['hib'],liIter['libid'],liIter['libv'])
        aTag = liIter.findAll('a')
        for aIter in aTag :  
            print(aIter.string,'http://support.huawei.com'+aIter['href'],)
            docc = ModelDocContent(getUrlContent(aIter['href']),'5406')
            targetid = getTargetID(docc)
            if targetid !='':
                _DOC_CONTENT.append(docc)
            KnlDocTreeNode = ModelDocTreeNode(aIter.string,targetid,aIter['href'],aIter['href'],liIter['libid'],liIter['libv'],liIter['libid'],liIter['libv'],liIter['hib'],liIter['id'],liIter['sub'])
            KnlDoc['navtree'].append(KnlDocTreeNode)
        if liIter['sub'] == '1':
            try:
               getSubMenu(docid,liIter['libid'],liIter['libid'],liIter['id'],liIter['hib'],liIter['libv'],KnlDocTreeNode)
            except:
               print('获取子菜单报错')
        print("抓取网页文档*********************************************",len(_DOC_CONTENT))
    insertData(KnlDoc,'doc')
    insertData(_DOC_CONTENT,'doccontent')
    with open("tree.json", "w") as trf:
         json.dumps(KnlDoc, trf)
    with open("doc.json", "w") as docf:
         json.dumps(_DOC_CONTENT, docf)

def main():
    conn = MC('mongodb://localhost:27017/')
    global _DB_CONN 
    _DB_CONN = conn[_DATABASE_NAME] # 连接数据库名 
    for docid in _DOC_ID:
        crawlerUrl(docid)
    
    
if __name__ == '__main__':
   main()


#re = urllib2.Request(url)  
#resouce = urllib2.urlopen(re).read()  
#open("wall.jpg","wb").write(resouce)