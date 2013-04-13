var fs = require('fs')
var http = require('http')
var Tabletop = require('tabletop').Tabletop
var dns = require('dns')
var hasInternet = require('hasinternet')
var cheerio = require('cheerio')

var sheetData = []
var lastFetch 
var KEY = '0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE'
// console.log("doesn't exist:", !sheetData.length, "date now:", Date.now(), "last fetch:", lastFetch)

function requestHandler (request, response) {
	hasInternet(function answer(err, internet) {
		if (internet) freshData(request, response)
		else localData(buildPage(request, response))
	})
}

function localData(cb) {
	fs.readFile('data.json', function (err, data) {
	  if (err) throw err;
	 	var staleData = JSON.parse(data)
	  return staleData
	  cb(staleData)
	});
}

function fetchData() {

}

function freshData(request, response) {
	function tabletopCb(data, tabletop){
		loadSheet(data, tabletop)
		buildPage(request, response)
	}
	var options = {key: KEY, callback: tabletopCb, simpleSheet: true}
	if (!sheetData.length || (Date.now() - lastFetch) > 300000) {
		Tabletop.init(options)
	}
	else {
		buildPage(request, response)
	}
}




function loadSheet(data, tabletop) {
	sheetData = data
	lastFetch = Date.now()
	// console.log("this is sheetData:", sheetData) 
	fs.writeFile('data.json', JSON.stringify(sheetData))
}

function buildPage(request, response, data) {
	// var theData = data
	var fileLocation = __dirname + '/index.html';
	var fileStream = fs.readFile(fileLocation, 'utf8', function (err, contents){
		var $ = cheerio.load(contents)
		console.log("page", $)
		$("body").append("<script>alert('hello world');<\/script>");
		var completePage = $.html()
		console.log("complete page", completePage)
		return response.end(completePage)
	})
}




var server = http.createServer(requestHandler);
var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port 3000');