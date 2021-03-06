
import json

import urllib
import pprint

UPCOMING_KEY = "74fb5c7bc0"

def sendRequest(requestString):
    request = urllib.urlopen(requestString)
    result  = json.loads(request.read())
    return result;

def getStateId(x):
    request = urllib.urlopen("http://upcoming.yahooapis.com/services/rest/?api_key=74fb5c7bc0&method=metro.getStateList&country_id=1&format=json")
    result = json.loads(request.read())
    states = {"name": "id"}
    for item in result['rsp']['state']:
        states[item['name']] = item['id']         
    return states[x]

def getEvent(event,zip_code):
    request = "http://upcoming.yahooapis.com/services/rest/?api_key=74fb5c7bc0&method=event.search&search_text=" + event + "&location=" + str(zip_code) +"&format=json"

    return sendRequest(request)

def getEventInfo(event,zip_code,detail):
    x = getEvent(event,zip_code)
    info = {"id" : detail}
    for item in x['rsp']['event']:
        info[item['id']] = item[detail]
    return info;

def getEventByID(id):
    request = "http://upcoming.yahooapis.com/services/rest/?api_key=74fb5c7bc0&method=event.getInfo&event_id=" + str(id) + "&format=json"
    x = sendRequest(request)
    return x

def getEventIDInfo(id,detail):
    x = getEventByID(id)
    info = {"id" : detail}
    for item in x['rsp']['event']:
        info[item['id']] = item[detail]
        retval = info[id].replace("&#39;s","s")
        retval = retval.replace("&#39;","\'")
        retval = retval.replace("&amp;","&")
        retval = retval.replace("&quot;","\"")
        retval = retval.replace("<br>", " ")
        retval = retval.replace("<a>", " ")
        retval = retval.replace("<\a>", " ")
        retval = retval.replace("<h1>", " ")
        retval = retval.replace("<h4>", " ")
        retval = retval.replace("<a href=", " ")
        retval = retval.replace("/>", " ")
        retval = retval.replace("</h4>", " ")
        return retval




