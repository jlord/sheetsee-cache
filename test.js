var MapList = require('./')

var URL = "https://docs.google.com/spreadsheet/pub?key=0Ao5u1U6KYND7dGN5QngweVJUWE16bTRob0d2a3dCbnc&output=html"
var mapID = "jllord.mta"
var wrapperDiv = "#wrap"

new MapList(URL, mapID, wrapperDiv)