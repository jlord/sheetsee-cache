window.Tabletop = require('./tabletop.js').Tabletop
var fs = require('fs')


module.exports = MapList

function MapList(URL, mapID, wrapperDiv){
  var self = this
	this.URL = URL
	this.mapID = mapID
	this.wrapperDiv = wrapperDiv
	if (typeof this.wrapperDiv === "string")
		this.wrapperDiv = document.querySelector(wrapperDiv)

	this.makeDivs()

	Tabletop.init( { key: URL,
                 	 callback: function(data, tabletop) {self.readyData(data, tabletop, self.makeMap)},
                   simpleSheet: true } )

	
  this.sheetData = []
}


MapList.prototype.readyData = function(data, tabletop, callback){
  this.sheetData = data

  fs.writeFile('./data.json', "hey there", function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });

 // if (sheetData !== sheetData.JSON.parse) {
 //   fs.writeStream(sheetData, sheetData.JSON)
 // }
  console.log("the dttas", this.sheetData)
  callback(this.sheetData)


}
	 

MapList.prototype.makeDivs = function(){
	this.mapDiv = document.createElement("div")
	this.mapDiv.id = "map"
	this.listDiv = document.createElement("div")
	this.listDiv.id = "alert"

	this.wrapperDiv.appendChild(this.mapDiv)
	this.wrapperDiv.appendChild(this.listDiv)
}

MapList.prototype.makeMap = function(data){
	// this works -- mapbox.auto('map', this.mapID);



	var map = mapbox.map('map');
  map.addLayer(mapbox.layer().id('jllord.pennies'));

  // Create an empty markers layer
  var markerLayer = mapbox.markers.layer();

  // Add interaction to this marker layer. This
  // binds tooltips to each marker that has title
  // and description defined.
  map.addLayer(markerLayer);

  var alert = document.getElementById('alert');

  markerLayer.factory(function(f) {
      var elem = mapbox.markers.simplestyle_factory(f);
      MM.addEvent(elem, 'click', function(e) {
          // clear the alert box
          alert.innerHTML = '';
          console.log("this is f:", f)
          // add a header and paragraph, and fill them with content
          // from the feature, which we've stored as the variable 'f'
          var h1 = alert.appendChild(document.createElement('h1'));
          var p = alert.appendChild(document.createElement('p'));
          // pull the title and description attributes of the feature.
          // you could customize this to pull other attributes
          h1.innerHTML = f.properties.title;
          p.innerHTML = f.properties.description;
          // prevent this event from bubbling down to the map and clearing
          // the content
          e.stopPropagation();
      });
      return elem;
  });

  // clear the content of alert when the user clicks on a map area other
  // than a tooltip
  MM.addEvent(map.parent, 'click', function() {
      alert.innerHTML = '';
  });

  map.zoom(5).center({ lat: 37, lon: -77 });


  // See the 'adding a single marker example for help with adding a marker
  data.forEach( function(data) {
    markerLayer.add_feature( {
        geometry: {
            coordinates: [data.long, data.lat]
        },
        properties: {
            'marker-color': '#000',
            'marker-symbol': 'star-stroked',
            title: data.city,
            description: data.image
        }
    })
  })

  // Attribute map
  map.ui.attribution.add()
      .content('<a href="http://mapbox.com/about/maps">Terms &amp; Feedback</a>');
}