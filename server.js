// dependencies
var fs = require('fs')
var http = require('http')
var Tabletop = require('tabletop').Tabletop
var dns = require('dns')
var hasInternet = require('hasinternet')
var cheerio = require('cheerio')
var filed = require('filed')
var router = require('router')

// globals
var sheetData = []
var lastFetch 
var KEY = '0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE'

// ready, set, go!
function requestHandler (request, response) {
	var route = router()
	console.log(request.url)
  route.get('/', function (request, response) {
  	hasInternet(function answer(err, internet) {
			if (internet) freshData(request, response)
			else {
				console.log("you are offline, fetching stored data")
				localData(request, response, buildPage)
			}
		})
  })
	route.get('/js/*', serveStatic)
	route(request, response)
}

// if you're offline
function localData(request, response, cb) {
	fs.readFile(KEY + '.json', function (err, data) {
	  if (err) throw err;
	 	var staleData = JSON.parse(data)
	  cb(request, response, staleData)
	});
}

// if online
function freshData(request, response) {
	function tabletopCb(data, tabletop){
		loadSheet(data, tabletop)
		buildPage(request, response, data)
	}
	var options = {key: KEY, callback: tabletopCb, simpleSheet: true}
	if (!sheetData.length || (Date.now() - lastFetch) > 300000) {
		console.log("you are online with old data, fetching new")
		Tabletop.init(options)
	}
	else {
		console.log("you are online with fresh data")
		localData(request, response, buildPage)
	}
}

function loadSheet(data, tabletop) {
	sheetData = data
	lastFetch = Date.now()
	fs.writeFile(KEY +'.json', JSON.stringify(sheetData))
}

function buildPage(request, response, data) {
	var fileLocation = __dirname + '/index.html';
	var fileStream = fs.readFile(fileLocation, function (err, contents){
		var $ = cheerio.load(contents)
		$("head").append("<script type='text/javascript'>var gData = JSON.parse('" + JSON.stringify(data) + "')</script>");
		var completePage = $.html()
		return response.end(completePage)
	})
}

function serveStatic (request, response) {
    filed(__dirname +	 request.url).pipe(response);
}

var server = http.createServer(requestHandler)
var port = process.env.PORT || 3000
server.listen(port)
console.log('Listening on port 3000')