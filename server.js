var fs = require('fs')
var http = require('http')
var Tabletop = require('tabletop').Tabletop
var dns = require('dns')

var sheetData = []
var lastFetch 
var KEY = '0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE'
// console.log("doesn't exist:", !sheetData.length, "date now:", Date.now(), "last fetch:", lastFetch)

function requestHandler (request, response) {
fs.readFile('data.json', function (err, data) {
  if (err) throw err;
 	var staleData = JSON.parse(data)
  console.log("click", staleData);
});
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

function freshData() {

}

function checkWww(cb){
	dns.lookup('www.google.com', function(err, addresses) {
	  if (err) return cb(err) // no www
	  	console.log(cb)
	  return cb(false) // www
	})
}

function loadSheet(data, tabletop) {
	sheetData = data
	lastFetch = Date.now()
	// console.log("this is sheetData:", sheetData) 
	fs.writeFile('data.json', JSON.stringify(sheetData))
}

function buildPage() {
	var fileLocation = __dirname + '/index.html';
	var fileStream = fs.createReadStream(fileLocation)
	// console.log("file stream", fileStream) // to term
	return fileStream
}

// Create the server
var server = http.createServer(requestHandler);
// Tell the server to start listening for requests
var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port 3000');