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

_DOC_ID=['EDOC1000036635']
_DATABASE_NAME ='knl'
_DOC_CONTENT = []
_DOC_TREE_CONTENT = []
_PRO_NAME =''

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
def ModelDocNewTreeNode(title,targetid,href,ohref,libid,libversion,toclib,tocv,hib,topicid,sub,content,user_id,pro,parentid):
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
    logger.info('二级菜单获取列表参数集%s,%s,%s,%s,%s,%s,%s,%s', docid,hib, libid, url, libv, a, g, title)
    return "".join(d)

def processJson(inputJsonFile):  
    fin = open(inputJsonFile, 'r')  
    for eachLine in fin:  
        line = eachLine.strip().decode('utf-8')                #去除每行首位可能的空格，并且转为Unicode进行处理  
        line = line.strip(',')                                 #去除Json文件每行大括号后的逗号  
        js = None  
        try:  
            js = json.loads(line)                              #加载Json文件  
        except:  
            print ('bad line')  
            continue
#对未加载完的数据重新进行加载
        js["xxx"] = xxx                                        #对您需要修改的项进行修改，xxx表示你要修改的内容  
        outStr = json.dumps(js, ensure_ascii = False) + ','    #处理完之后重新转为Json格式，并在行尾加上一个逗号  
    fin.close()                                                #关闭文件  

def getSubMenu(docid,libid,toclib,topicid,hib,libv,KnlDocTreeNode) :  
    muneUrl =r'http://support.huawei.com/hedex/navi/navi.do?libId='+libid+'&libVersion='+libv+'&tocLib='+toclib+'&tocV='+libv+'&hib='+hib+'&topicId='+topicid
    print('获取子菜单',muneUrl)
    logger.info('获取子菜单%s', muneUrl)
    muneContent = urllib.request.urlopen(muneUrl).read()   
    muneSoup = ElementTree.fromstring(muneContent)
    lst_node = muneSoup.getiterator("topic")
    for idx,node in enumerate(lst_node):  
#        logger.info('节点信息%s,%s,%s,%s,%s,%s,%s',docid,libid,toclib,topicid,hib,libv, json.dumps(node.attrib))
        changUrl = getTocUrl(docid,getHib(hib,idx),libid,node.attrib['url'],libv,'','',node.attrib['txt'])
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
    logger.info('抓取网页路径%s', cUrl)
    cResContent = urllib.request.urlopen(cUrl).read()   
    cSoup = BeautifulSoup(cResContent,"html.parser")  
    strHtml= cSoup('body')
#   删除评论区域信息
    delEl = cSoup.find_all('iframe')
    for ifr in delEl:
        ifr.extract()
#   删除版本信息
#    delEl = strHtml.find('div',class_='hrcopyright')
#    for ifr in delEl:
#        ifr.extract()
#    delEl = strHtml.find('div',class_='hwcopyright')
#    for ifr in delEl:
#        ifr.extract()
#   删除其余多余文档内容
#    delEl = strHtml.find(id="fbimgDiv")
#    for ifr in delEl:
#        ifr.extract()
#    delEl = strHtml.find('script')
#    for ifr in delEl:
#        ifr.extract()
    logger.info('抓取网页长度%d', len(strHtml))
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
    _PRO_NAME = title.string
    KnlDoc = ModelProductDoc(docid,title.string,title.string,'5406')
    for liIter in lis : 
        print("********************************************************")
        print(liIter['id'],liIter['hib'],liIter['libid'],liIter['libv'])
        logger.info('获取信息%s,%s,%s,%s', liIter['id'],liIter['hib'],liIter['libid'],liIter['libv'])
        aTag = liIter.findAll('a')
        for aIter in aTag :  
            print(aIter.string,'http://support.huawei.com'+aIter['href'])
            logger.info('链接%s,%s', aIter.string,'http://support.huawei.com'+aIter['href'])
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
    resetTree(KnlDoc)
    insertData(KnlDoc,'document')
    insertData(_DOC_TREE_CONTENT,'document_content')
    with open("../public/js/tree.json", "w") as trf:
        trf.write(json.dumps(KnlDoc))
    with open("../public/js/docs.json", "w") as docf:
        docf.write(json.dumps(_DOC_TREE_CONTENT))
def resetTree(kd):
    tree = KnlDoc['navtree']
    getTreeNode(tree,{'_id':''})
    
def getTreeNodeContent(_id):
    for cnt in _DOC_CONTENT:
        if cnt['_id'] == _id :
           return cnt['content']
    return ''
     
def getTreeNode(node,parentnode):
    for n in node: 
        if len(n['children']) > 1 :
           getTreeNode(n['children'],n)
        print(n['_id'],n['title'])
        _DOC_TREE_CONTENT.append(ModelDocNewTreeNode(n['title'],n['targetid'],n['href'],n['ohref'],n['libid'],n['libversion'],n['toclib'],n['tocv'],n['hib'],n['topicid'],n['sub'],getTreeNodeContent(n['targetid']),'5406',_PRO_NAME,parentnode['_id']))
  
def main():
    conn = MC('mongodb://localhost:27017/')
    global _DB_CONN 
    _DB_CONN = conn[_DATABASE_NAME] # 连接数据库名 
    for docid in _DOC_ID:
        crawlerUrl(docid)
    
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


#re = urllib2.Request(url)  
#resouce = urllib2.urlopen(re).read()  
#open("wall.jpg","wb").write(resouce)