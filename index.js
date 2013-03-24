window.Tabletop = require('./tabletop.js').Tabletop

module.exports = MapList


function MapList(URL, mapID, wrapperDiv){
	this.URL = URL
	this.mapID = mapID
	this.wrapperDiv = wrapperDiv
	if (typeof this.wrapperDiv === "string")
		this.wrapperDiv = document.querySelector(wrapperDiv)

	this.makeDivs()

	Tabletop.init( { key: URL,
                 	 callback: function(data, tabletop) { console.log(data) },
                   simpleSheet: true } )

	this.makeMap()
}

MapList.prototype.makeDivs = function(){
	this.mapDiv = document.createElement("div")
	this.mapDiv.id = "map"
	this.listDiv = document.createElement("div")
	this.listDiv.id = "list"

	this.wrapperDiv.appendChild(this.mapDiv)
	this.wrapperDiv.appendChild(this.listDiv)
}

MapList.prototype.makeMap = function(){
	mapbox.auto('map', this.mapID);
}


