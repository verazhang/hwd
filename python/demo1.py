import HTMLParser
import urllib  
import urllib2
import sys
from sgmllib import SGMLParser
#url = 'http://www.server.com/login'
#user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'  
#values = {'username' : 'cqc',  'password' : 'XXXX' }  
#headers = { 'User-Agent' : user_agent }  
#data = urllib.urlencode(values)  
#request = urllib2.Request(url, data, headers)  
#response = urllib2.urlopen(request)
#page = response.read()

url = "https://www.baidu.com/"

 
class ListName(SGMLParser):
    def __init__(self):
        SGMLParser.__init__(self)
        self.is_h4 = ""
        self.name = []
    def start_h4(self, attrs):
        self.is_h4 = 1
    def end_h4(self):
        self.is_h4 = ""
    def handle_data(self, text):
        if self.is_h4 == 1:
            self.name.append(text)
 
content = urllib2.urlopen('http://list.taobao.com/browse/cat-0.htm').read()
listname = ListName()
listname.feed(content)
for item in listname.name:
    print item.decode('gbk').encode('utf8')