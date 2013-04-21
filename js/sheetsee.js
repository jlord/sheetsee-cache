// 
// Filtering + Organizing Data
//

// create geoJSON from your spreadsheets coordinates
function createGeoJSON(data){
	var geoJSON = []
	data.forEach(function(lineItem){
		var feature = {
			type: 'Feature',
			"geometry": {"type": "Point", "coordinates": [lineItem.long, lineItem.lat]},
			"properties": {
				"image": "hello",
				"url": "hi",
				"marker-color": "#FFE7E7",
				"marker-size": "small",
				"title": lineItem.placename,
				"city": lineItem.city
			}
		}
		geoJSON.push(feature)
	})
	return geoJSON
}

// out of the data, filter something from a category
function getMatches(data, filter, category) {
  var matches = []
  data.forEach(function (element) {
    var projectType = element[category]
    if (projectType === filter) filteredProjects.push(element)
  })
  return matches
}

function mostFrequent(data) {
  var stateCount = {};
  for (var i = 0; i < data.length; i++)  {
   if (!stateCount[data[i].state]) {
       stateCount[data[i].state] = 0;
   }
   stateCount[data[i].state]++
}
    var sortable = [];
    for (var state in stateCount) {
      sortable.push([state, stateCount[state]]);
  }
      sortable.sort(function(a, b) {return b[1] - a[1]})
      return  sortable;
}

function getOccurance(data) {
  var occuranceCount = {}
  for (var i = 0; i < data.length; i++)  {
   if (!occuranceCount[data[i].state]) {
       occuranceCount[data[i].state] = 0;
   }
   occuranceCount[data[i].state]++
  }
  return occuranceCount
}

function makeArrayOfObject(data) {
  var keys = Object.keys(data)
  return keys.map(function(key){ 
    var h = {label: key, units: data[key], hexcolor: "#FDBDBD"}        
    return h
  })
}

// 
// Mapbox + Leaflet Map
//

// load basic map with tiles
function loadMap() {
	var map = L.mapbox.map('map', 'jllord.pennies')
	// map.addLayer(L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'));
	map.touchZoom.disable()
	map.doubleClickZoom.disable()
	map.scrollWheelZoom.disable()
	return map
}

function addMarkerLayer() {
	map.markerLayer.setGeoJSON(geoJSON)
	map.setView(geoJSON[0].geometry.coordinates.reverse(), 4)
}

function addPopups() {
	map.markerLayer.on('click', function(e) {
    var feature = e.layer.feature
    var popupContent = 
        '<h2>' + feature.properties.title + '</h2>' +
        '<p>' + feature.properties.city + '</p>'
    e.layer.bindPopup(popupContent,{
        closeButton: false,
    })
	})
}

// 
// D3 Bar Chart
//
function renderGraph(data, noOfItems, divTown) {
//  m = [t0, r1, b2, l3]
var m = [30, 60, 10, 200],
    w = 600 - m[1] - m[3],
    h = (noOfItems * 30) - m[0] - m[2];

var format = d3.format(",.0f");

var x = d3.scale.linear().range([0, w]),
    y = d3.scale.ordinal().rangeRoundBands([0, h], .1);

var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h).tickFormat(d3.format(".2s")),
    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

var svg = d3.select(divTown).append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  // Parse numbers, and sort by value.
  data.forEach(function(d) { d.units = +d.units; });

  // Set the scale domain.
  x.domain([0, d3.max(data, function(d) { return d.units; })]);
  y.domain(data.map(function(d) { return d.label; }));

  var bar = svg.selectAll("g.bar")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(0," + y(d.label) + ")"; });

  bar.append("rect")
    .attr("width", function(d) { return x(d.units); })
    .attr("height", y.rangeBand())
    .style("fill", function(d) { return d.hexcolor; });

  bar.append("text")
    .attr("class", "value")
    .attr("x", function(d) { return x(d.units); })
    .attr("y", y.rangeBand() / 2)
    .attr("dx", 12)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text(function(d) { return format(d.units); });
      
  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
};
