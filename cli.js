#!/usr/bin/env node

var argv = require('optimist').argv;
var fs = require('fs')
var http = require('http')
var Tabletop = require('tabletop')
var dns = require('dns')
var hasInternet = require('hasinternet')
var cheerio = require('cheerio')
var filed = require('filed')
var router = require('router')


console.log(argv)

if (argv.init) initialize(argv.init)

argv._.forEach(function(option) {
  
  if (option === "update") console.log("update!")
})

var key = ""

if (argv.expire) console.log("set expiration!")

if (argv.import) { key = argv.import; getData() }
if (argv.update) getData()


function getData() {
  console.log("running")
  function tabletopCb(data, tabletop, makePage) {
    // console.log(data)
    convertToJSON(data, tabletop, makePage)
  }
  var options = {key: key, callback: tabletopCb, simpleSheet: true}
  Tabletop.init(options)
}

function convertToJSON(data, tabletop, cb) {
  console.log("convertToJSON")
  // sheetData = data
  // lastFetch = Date.now()
  fs.writeFile('new_' + key +'.json', JSON.stringify(data), cb)
}

function initialize(key) {
  console.log("got this key", key)
  getData()
}

function makePage() {
  console.log("i run!")
  var jsonFile = "new_" + key + ".json"
  var fileLocation = __dirname + '/index.html'
  var fileStream = fs.readFile(fileLocation, function (err, contents){
    var $ = cheerio.load(contents)
    $("head").append("<script type='text/javascript' src='" + jsonFile + "'></script>")
    var completePage = $.html()
    console.log(completePage)
  })
}

// function buildPage(data) {
//   var fileLocation = __dirname + '/index.html'
//   var fileStream = fs.readFile(fileLocation, function (err, contents){
//     var $ = cheerio.load(contents)
//     $("head").append("<script type='text/javascript'>var gData = " + JSON.stringify(data) + "</script>")
//     var completePage = $.html()
//     return res.end(completePage)
//   })
// }