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
function reqHandler (req, res) {
	var route = router()
  route.get('/', serveRoot)
	route.get('/js/*', serveStatic)
	route.get('/css/*', serveStatic)
	route.get('/img/*', serveStatic)
	route(req, res)
}

function serveRoot(req, res) {
	hasInternet(function answer(err, internet) {
		if (internet) return freshData(req, res)
		console.log("you are offline, fetching stored data")
		localData(req, res, buildPage)
	})
}

// if you're offline
function localData(req, res, cb) {
	fs.readFile(KEY + '.json', function (err, data) {
	  if (err) throw err;
	 	var staleData = JSON.parse(data)
	  cb(req, res, staleData)
	})
}

// if online
function freshData(req, res) {
	function tabletopCb(data, tabletop){
		loadSheet(data, tabletop)
		buildPage(req, res, data)
	}
	var options = {key: KEY, callback: tabletopCb, simpleSheet: true}
	if (!sheetData.length || (Date.now() - lastFetch) > 300000) {
		console.log("you are online with old data, fetching new")
		Tabletop.init(options)
	}
	else {
		console.log("you are online with fresh data")
		localData(req, res, buildPage)
	}
}

function loadSheet(data, tabletop) {
	sheetData = data
	lastFetch = Date.now()
	fs.writeFile(KEY +'.json', JSON.stringify(sheetData))
}

function buildPage(req, res, data) {
	var fileLocation = __dirname + '/index.html';
	var fileStream = fs.readFile(fileLocation, function (err, contents){
		var $ = cheerio.load(contents)
		$("head").append("<script type='text/javascript'>var gData = JSON.parse('" + JSON.stringify(data) + "')</script>");
		var completePage = $.html()
		return res.end(completePage)
	})
}

function serveStatic (req, res) {
  filed(__dirname +	req.url).pipe(res);
}

var server = http.createServer(reqHandler)
var port = process.env.PORT || 3000
server.listen(port)
console.log('Listening on port 3000')