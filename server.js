var fs = require('fs')
var http = require('http')
var Tabletop = require('tabletop').Tabletop

var sheetData = []
var lastFetch 
var KEY = '0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE'
// console.log("doesn't exist:", !sheetData.length, "date now:", Date.now(), "last fetch:", lastFetch)

function requestHandler (request, response) {
	var options = {key: KEY, callback: function(data, tabletop){
		loadSheet(data, tabletop)
		buildPage().pipe(response)
	}, simpleSheet: true}

	if (!sheetData.length || (Date.now() - lastFetch) > 300000) {
		Tabletop.init(options)
	}
	else {
		buildPage().pipe(response)
	}
}

function loadSheet(data, tabletop) {
	sheetData = data
	lastFetch = Date.now()
	console.log("this is sheetData:", sheetData)
	fs.writeFile('data.json', JSON.stringify(sheetData))
}

function buildPage() {
	var fileLocation = __dirname + '/index.html';
	var fileStream = fs.createReadStream(fileLocation)
	console.log("file stream", fileStream)
	return fileStream
}

// Create the server
var server = http.createServer(requestHandler);
// Tell the server to start listening for requests
var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port 3000');

// when you get a request, check date of last cache
// if no cache or cache > 5 mins old
// delete old cache
// go to Google and get data, save to cache
// 