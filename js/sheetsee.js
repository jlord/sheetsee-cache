// 
// Filtering + Organizing Data
//
$(document).on("click", ".tHeader", sendToSort)


function sortThings (data, sorter, sorted) {
console.log("hi i'm sorting things by: ", sorter)
data.sort(function(a,b){
  if(a[sorter]<b[sorter]) return -1;
  if(a[sorter]>b[sorter]) return 1;
  return 0;
})
if (sorted === "descending") data.reverse()
makeTable(data, "#siteTable")
var header 
$("#siteTable .tHeader").each(function(i, el){
  var contents = resolveDataTitle($(el).text())
  if (contents === sorter) header = el
})
$(header).attr("data-sorted", sorted)
}

function resolveDataTitle(string) {
  var adjusted = string.toLowerCase().replace(/\s/g, '').replace(/\W/g, '')
  return adjusted
}

function sendToSort(event) {
  var sorted = $(event.target).attr("data-sorted")
  if (sorted) {
    if (sorted === "descending") sorted = "ascending"
    else sorted = "descending"
  }
  else {
    sorted = "ascending"
  }
  var sorter = resolveDataTitle(event.target.innerHTML)
  sortThings(gData, sorter, sorted)
}

function makeTable(data, targetDiv) {
  var siteTable = ich.siteTable({
    rows: data 
  })
  $(targetDiv).html(siteTable) 
}

// 
// Map
//
// create geoJSON from your spreadsheets coordinates
function createGeoJSON(data) {
	var geoJSON = []
	data.forEach(function(lineItem){
		var feature = {
			type: 'Feature',
			"geometry": {"type": "Point", "coordinates": [lineItem.long, lineItem.lat]},
			"properties": {
				"image": "hello",
				"url": "hi",
				"marker-size": "small",
        "marker-color": lineItem.hexcolor,
        "id": lineItem.id,
        "year": lineItem.year,
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
       stateCount[data[i].state] = 0
   }
   stateCount[data[i].state]++
}
    var sortable = [];
    for (var state in stateCount) {
      sortable.push([state, stateCount[state]])
  }
      sortable.sort(function(a, b) {return b[1] - a[1]})
      return  sortable;
}



function addUnitsLabels(arrayObj, oldLabel, oldUnits) {
  for (var i = 0; i < arrayObj.length; i++) {
    arrayObj[i].label = arrayObj[i].oldLabel
    arrayObj[i].units = arrayObj[i].oldUnits
    delete arrayObj[i].oldLabel
    delete arrayObj[i].oldUnits
  }
return arrayObj
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

function makeColorArrayOfObject(data, color) {
  var keys = Object.keys(data)
  var counter = 0
  var colorIndex = color.length % counter
  if (counter < color.length) {
    colorIndex = counter
  }
  return keys.map(function(key){ 
    console.log("counter", counter, "color length", color.length, "colorINdex", colorIndex)
    var h = {label: key, units: data[key], hexcolor: color[colorIndex]} 
    counter++       
    return h
  })
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
	var map = L.mapbox.map('map')
      map.setView(geoJSON[0].geometry.coordinates.reverse(), 4)
	// map.addLayer(L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'));
	map.touchZoom.disable()
	map.doubleClickZoom.disable()
	map.scrollWheelZoom.disable()
	return map
}
function addTileLayer(map) {
  var layer = L.mapbox.tileLayer('tmcw.map-2f4ad161')
  layer.addTo(map)
}

function addMarkerLayer(geoJSON, map) { 
console.log("addMarkerLayer geoJSON: ", geoJSON) 
var markerLayer = L.mapbox.markerLayer(geoJSON)
  markerLayer.setGeoJSON(geoJSON)
  // map.fitBounds(geoJSON)
  markerLayer.addTo(map)
  markerLayer.on('click', function(e) {
    var feature = e.layer.feature
    var popupContent = '<h2>' + feature.properties.title + '</h2>' + '<small>' + feature.properties.year + '</small>'
    e.layer.bindPopup(popupContent,{
    closeButton: false,
    })
  })
}

function addPopups() {
  console.log("I got called!")
	map.markerLayer.on('click', function(e) {
    var feature = e.layer.feature
    var popupContent = '<h2>' + feature.properties.year + '</h2>'
    e.layer.bindPopup(popupContent,{
        closeButton: false,
    })
	})
}

// 
// D3 Bar Chart
//
function renderGraph(data, noOfItems, divTown) {
  console.log(data)

//  m = [t0, r1, b2, l3]
var m = [30, 60, 10, 200],
    w = 600 - m[1] - m[3],
    h = (noOfItems * 30) - m[0] - m[2];

var format = d3.format(",.0f");

var x = d3.scale.linear().range([0, w]),
    y = d3.scale.ordinal().rangeRoundBands([0, h], .1);

var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h).tickFormat(d3.format("1s")),
    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

var svg = d3.select(divTown).append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  // Parse numbers, and sort by value.
  // data.forEach(function(d) { d.units = +d.units; });
 //  data.sort(function(a, b) { return b.units - a.units; });

  // Set the scale domain.
  x.domain([0, d3.max(data, function(d) { return d.units; })]); // 0 to max of units
  y.domain(data.map(function(d) { return d.label; })); // makes array of labels

  var synchronizedMouseOver = function() {
    var rect = d3.select(this)
    var indexValue = rect.attr("index_value")

    var barSelector = "." + "rect-" + indexValue;
    var selectedBar = d3.selectAll(barSelector);
    selectedBar.style("fill", "#FF5C5C");

    var valueSelector = "." + "value-" + indexValue;
    var selectedValue = d3.selectAll(valueSelector);
    selectedValue.style("fill", "#FF5C5C");

    var textSelector = "." + "labels-" + indexValue;
    var selectedText = d3.selectAll(textSelector);
    selectedText.style("fill", "#FF5C5C");

};

var synchronizedMouseOut = function() {
    var rect = d3.select(this);
    var indexValue = rect.attr("index_value");

    var barSelector = "." + "rect-" + indexValue;
    var selectedBar = d3.selectAll(barSelector);
    selectedBar.style("fill", function(d) { return d.hexcolor})

    var valueSelector = "." + "value-" + indexValue
    var selectedValue = d3.selectAll(valueSelector)
    selectedValue.style("fill", "#333333")

    var textSelector = "." + "labels-" + indexValue;
    var selectedText = d3.selectAll(textSelector);
    selectedText.style("fill", "#333")
};

  var bar = svg.selectAll("g.bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(0," + y(d.label) + ")"; })
    // .attr("index_value", function(d, i) { return "index-" + i; })
    // .attr("uniqueID", function(d, i) { return "text-" + "index-" + i; })
    
svg.selectAll("g.labels")
  .data(data) // Instruct to bind dataSet to text elements
  .enter().append("g") // Append legend elements
    // .attr("xlink:href", function(d) { return d.link; })
      .append("text")
        .attr("text-anchor", "end")
        .attr("x", -3)
        //.attr("y", function(d, i) { return legendOffset + i*20 - 10; })
        .attr("y", function(d, i) { return 14 + i*26; })
        .attr("dx", 0)
        .attr("dy", "5px") // Controls padding to place text above bars
        .text(function(d) { return d.label;})
        .style("fill", "#333")
        .attr("index_value", function(d, i) { return "index-" + i; })
        .attr("class", function(d, i) { return "labels-" + "index-" + i + " aLabel "; })
        .on('mouseover', synchronizedMouseOver)
        .on("mouseout", synchronizedMouseOut);

  bar.append("rect")
    .attr("width", function(d) { return x(d.units)})
    .attr("height", y.rangeBand())
    .attr("index_value", function(d, i) { return "index-" + i; })
    .style("fill", function(d) { return d.hexcolor})
    .on('mouseover', synchronizedMouseOver)
    .on("mouseout", synchronizedMouseOut)
    .attr("class", function(d, i) { return "rect-" + "index-" + i; })

  bar.append("text")
    .attr("x", function(d) { return x(d.units); })
    .attr("y", y.rangeBand() / 2)
    .attr("dx", 12)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("index_value", function(d, i) { return "index-" + i; })
    .text(function(d) { return format(d.units); })
    .attr("class", function(d, i) { return "value-" + "index-" + i; })
    .on('mouseover', synchronizedMouseOver)
    .on("mouseout", synchronizedMouseOut)
      
  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);

  // svg.append("g")
  //   .attr("class", "y axis")
  //   .call(yAxis)

d3.select("input").on("change", change)

// var sortTimeout = setTimeout(function() {
//   d3.select("input").property("checked", true).each(change);
// }, 2000);

function change() {
  // clearTimeout(sortTimeout);

  // Copy-on-write since in betweens are evaluated after a delay.
  var y0 = y.domain(data.sort(this.checked
      ? function(a, b) { return b.units - a.units; }
      : function(a, b) { return d3.ascending(a.label, b.label); })
      .map(function(d) { return d.label }))
      .copy()

  var transition = svg.transition().duration(750),
      delay = function(d, i) { return i * 50; }

  transition.selectAll(".bar")
      .delay(delay)
      .attr("transform", function(d) { return "translate(0," + y(d.label) + ")" })

  transition.selectAll(".aLabel")
      .delay(delay)
      .attr("transform", function(d) { return "translate(0," + y(d.label) + ")" })


}
}

/////////////////////////////////////////////////////////

function makePie(data){
var width = 600,
    height = 400,
    radius = Math.min(width, height) / 2.3;

var color = d3.scale.category20c() // d3.scale.ordinal()
    // .range(data.map(function(d) { return d.hexcolor; }));

//   y.domain(); // makes array of labels

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var arcOver = d3.svg.arc()
    .outerRadius(radius + .1)

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.units; });

var svg = d3.select("#holder").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");

var data = data

  data.forEach(function(d) {
    d.units = +d.units
  })
function synchronizedMouseOver(d) {
  d3.select(this).select("path").transition()
     .duration(500)
     .attr("d", arcOver);
  var slice = d3.select(this);
  var indexValue = slice.attr("index_value");

  var pathSelector = "." + "path-" + indexValue;
  var selectedPath = d3.selectAll(pathSelector);
  selectedPath.style("fill", "#333")

  var textSelector = "." + "labels-" + indexValue
  var selectedText = d3.selectAll(textSelector)
  //selectedText.style("fill", "#FF9BFF")
  selectedText.transition()
    .duration(150)
    .style("font-size", "12px").style("font-weight", "bold")
  selectedText.attr("class", function(d, i) { return "labels-" + indexValue + " bigg "; })
}
function synchronizedMouseOut(d) {
  d3.select(this).select("path").transition()
     .duration(150)
     .attr("d", arc);
  var slice = d3.select(this);
  var indexValue = slice.attr("index_value");

  var pathSelector = "." + "path-" + indexValue;
  var selectedPath = d3.selectAll(pathSelector);
  selectedPath.style("fill", function(d) { return color(d.data.label); })

  var textSelector = "." + "labels-" + indexValue;
  var selectedText = d3.selectAll(textSelector);
  selectedText.transition()
    .duration(200)
    .style("font-size", "10px").style("font-weight", "normal").style("fill", "#333")
  
}

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      // .attr("class", "arc")
      // .attr("class", "slice")
      .attr("index_value", function(d, i) { return "index-" + i; })
      .attr("class", function(d, i) { return "slice-" + "index-" + i + " slice arc"; })
      .on("mouseover", synchronizedMouseOver)
      .on("mouseout", synchronizedMouseOut)

  g.append("path")
      .attr("d", arc)
      .attr("index_value", function(d, i) { return "index-" + i; })
      .attr("class", function(d, i) { return "path-" + "index-" + i; })
      .style("fill", function(d) { return color(d.data.label); })
      .attr("fill", function (d, i) { return color(i); })

  // g.append("text")
  //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
  //     .attr("dy", ".35em")
  //     .attr("dx", ".35em")
  //     .style("text-anchor", "middle")
  //     .text(function(d) { return d.data.units })

var labelr = radius + 8 // radius for label anchor
  g.append("text")
    .attr("transform", function(d) {
        var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x*x + y*y);
        return "translate(" + (x/h * labelr) +  ',' +
           (y/h * labelr) +  ")"; 
    })
    .attr("dy", ".35em")
    .attr("fill", "#333")
    .attr("text-anchor", function(d) {
        // are we past the center?
        return (d.endAngle + d.startAngle)/2 > Math.PI ?
            "end" : "start";
    })
    .text(function(d, i) { return d.value.toFixed(1); });

svg.selectAll("g.labels")
  .data(data)
  .enter().append("g") // Append legend elements
      .append("text")
        .attr("text-anchor", "start")
        .attr("x", width / 2.5)
        .attr("y", function(d, i) { return 14 + i*26; })
        .attr("dx", 0)
        .attr("dy", "-140px") // Controls padding to place text above bars
        .text(function(d) { return d.label + ", " + d.units;})
        .style("fill", "#333")
        .attr("index_value", function(d, i) { return "index-" + i; })
        .attr("class", function(d, i) { return "labels-" + "index-" + i + " aLabel "; })
        .on('mouseover', synchronizedMouseOver)
        .on("mouseout", synchronizedMouseOut)

}

function makeLineChart(data){

var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// var parseDate = d3.time.format("%d-%b-%y").parse,
//     bisectDate = d3.bisector(function(d) { return d.date; }).left,
//     formatValue = d3.format(",.2f"),
//     formatCurrency = function(d) { return "$" + formatValue(d); };

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.units); })
    .y(function(d) { return y(d.label); });

var svg = d3.select("#holder").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = data

  x.domain([data[0].units, data[data.length - 1].units]);
  y.domain(d3.extent(data, function(d) { return d.label; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      //.on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.units) + "," + y(d.label) + ")");
    focus.select("text").text(d.label);
  }

}








// function sortChart(chartInfo) {
//   console.log('hey why')
//   chartInfo.data.forEach(function(d) { d.units = +d.units; });
//   chartInfo.data.sort(function(a, b) { return b.units - a.units; });
//   console.log("chartinfodata is", chartInfo.data)
//  // chartInfo.y.domain(chartInfo.data.map(function(d) { return d.label; })); 

//   chartInfo.bar.transition()
//       .duration(1000)
//       .delay(function(d, i) { return i * 50; })
//       // .attr("transform", function(d, i) { return "translate(0," + chartInfo.y(d.label, i) + ")"; })
//       .attr("transform", function(d, i) { return "translate(0," + chartInfo.y(d.units, i) + ")"; });

//   return  chartInfo
// }

// function sortChart() {
//     index.sort(function(a, b) { return data[a] - data[b]; });

//   y.domain(index);

//   bar.transition()
//       .duration(750)
//       .delay(function(d, i) { return i * 50; })
//       .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

// }


