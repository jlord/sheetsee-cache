var fs = require('fs')
var http = require('http')
var Tabletop = require('tabletop').Tabletop

var sheetData = []
var lastFetch 
var KEY = '0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE'

// What to do when our server gets a request
function requestHandler (request, response) {
	var options = {key: KEY, callback: loadSheet, simpleSheet: true}
	console.log("doesn't exist:", !sheetData.length, "date now:", Date.now(), "last fetch:", lastFetch)
	if (!sheetData.length || (Date.now() - lastFetch) > 300000) {
		Tabletop.init(options)
		// var fileLocation = __dirname + '/index.html';
		// var fileStream = fs.createReadStream(fileLocation)
		// console.log(fileStream)
		response.end(JSON.stringify(sheetData))
	}
	else {
		// var fileLocation = __dirname + '/index.html';
		// var fileStream = fs.createReadStream(fileLocation)
		// console.log(fileStream)
		response.end(JSON.stringify(sheetData))
	}
}

function loadSheet(data, tabletop, callback) {
	sheetData = data
	lastFetch = Date.now()
	console.log(sheetData)
	fs.writeFile(KEY + '.json', JSON.stringify(sheetData))
}

// function buildPage() {
// 	var fileLocation = __dirname + '/index.html';
// 	var fileStream = fs.createReadStream(fileLocation)
// 	console.log("file stream", fileStream)
// 	return fileStream
//   // fileStream.pipe(response);
// }

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