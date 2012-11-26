from flask import Flask
import urllib2,json

app=Flask(__name__)



def temp():
    url=urllib2.urlopen("http://weather.yahooapis.com/forecastrss?w=2459115")
    d=url.read()
    y = "temp="
    x = d.find(y)
    x = d[x+6:x+9]
    return x


def forecast():
    d1 = ["tornado", "tropical storm", 'hurricane',"severe thunderstorms","thunderstorms","mixed rain and snow",
	"mixed rain and sleet",
	"mixed snow and sleet",
	"freezing drizzle",
	"drizzle",
	"freezing rain",
	"showers",
	"showers",
	"snow flurries",
	"light snow showers",
	"blowing snow",
	"snow",
	"hail",
	"sleet",
	"dust",
	"foggy",
	"haze",
	"smoky",
	"blustery",
	"windy",
	"cold",
	"cloudy",
	"mostly cloudy (night)",
	"mostly cloudy (day)",
	"partly cloudy (night)",
	"partly cloudy (day)",
	"clear (night)",
	"sunny",
	"fair (night)",
	"fair (day)",
	"mixed rain and hail",
	"hot",
	"isolated thunderstorms",
	"scattered thunderstorms",
	"scattered thunderstorms",
	"scattered showers",
	"heavy snow",
	"scattered snow showers",
	"heavy snow",
	"partly cloudy",
	"thundershowers",
	"snow showers",
    "isolated thundershowers"]
    url=urllib2.urlopen("http://weather.yahooapis.com/forecastrss?w=2459115")
    d=url.read()
    y = "code="
    x = d.find(y)
    x = d[x+6:x+9]
    return d1[int(x)]
    

if __name__=="__main__":
    app.debug=True
    app.run()
