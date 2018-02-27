#!/usr/bin/env  python  
#!-*- coding:utf-8 -*-  
#@author    Amiber  
#@date  2012-12-01  
#@brief grap the table-data in static-web  
  
from bs4 import BeautifulSoup  
import urllib.request
import re  
import string
from pymongo import  MongoClient as MC
  
def earse(strline,ch) :  
    left = 0  
    right = strline.find(ch)  
      
    while right !=-1 :  
            strline = strline.replace(ch,'')  
            right = strline.find(ch)  
    return strline  
  
url = r"http://support.huawei.com/hedex/hdx.do?docid=EDOC1000079769"  
resContent = urllib.request.urlopen(url).read()  
#resContent = resContent.decode('gb18030').encode('utf8')  
soup = BeautifulSoup(resContent)  
print(soup('title')[0].string)  
tab= soup.findAll('table')  
trs = tab[len(tab)-1].findAll('tr')  
for trIter in trs :  
        tds = trIter.findAll('td')  
        for tdIter in tds :  
                span = tdIter('span')  
                for i in range(len(span)) :  
                        if span[i].string :  
                                print(earse(span[i].string,' ').strip()), 
                        else :  
                                pass  
        print
conn = MC('mongodb://localhost:27017/')
db = conn.mydb # 连接数据库名 
db.col.insert({"accout":21,"user_name":"xiao"})
for item in db.col.find():
    print(item)