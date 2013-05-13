# Sheetsee.js
Sheetsee.js is a Javascript library that makes it easy to use a Google Spreadsheet as the database powering the tables, charts and maps on a website. Once set up, any changes to the spreadsheet will auto-saved by Google and be live on your site when a visitor refreshes the page. 

Using Google Spreadsheets as the backend database is awesome because it is easy to use, share and collaborate with. 

To use sheetsee.js you'll definitely need to know HTML and CSS and know JavaScript or be not afraid of it and just type what these docs tell you to type. Also, see [JavaScript for Cats](http://www.jsforcats.com), [Eloquent JavaScript](http://eloquentjavascript.net/) or [Mozilla's Developer Network](https://developer.mozilla.org/en-US/docs/JavaScript).

### Dependencies

Sheetsee.js depends on a few other awesome JavaScript libraries to make all this happen. First, [Tabletop.js](http://builtbybalance.com/Tabletop/) gets the data from the Google Spreadsheet and makes it nice. Once you have your data Sheetsee.js makes it easy to set up tables or templates with [Mustache.js](http://mustache.github.io/), maps with [Mapbox.js](http://mapbox.com/mapbox.js/example/v1.0.0/), and charts with [d3.js](http://d3js.org/). And [jQuery](http://jquery.com/) of course powers most of the interactions. It also has many sorting and filtering functions built in so that you can display different parts of your data if you want. Each of these are explained in more detail below.

### CSS

Sheetsee.js comes with a bare minimum stylesheet. This way you can customize your site to look the way you want to it or to match an existing site's design. 

### Client-side or Server-side

Sheetsee.js comes in two flavors, [client-side]() and [server-side](). The client-side is the most approachable and straightforward, you just include sheetsee.js and the dependencies on your page and use sheetsee.js as normal.

The server-side version is built with [Node.js](http://www.nodejs.org) and you'll need to understand Node and be publishing to a server that runs Node.js apps. This version saves the data on the server so that the browser doesn't have to fetch from Google at every request, which can sometimes be slow. You can set when the cache expires. It also allows for offline development, huzzah! 

## The Short & Sweet

1. Link to Sheetsee.js, jquery.js, mapbox.js, icanhas.js and d3.js in your HTML header.
2. Create place holder divs in your HTML for any chart, map or table you want to have.
3. Create templates for tables in `<script>` tags.
4. Create a script tag that waits for the document to be read and then executes any of the map, chart or tables you've specified in it.
5. Set it and forget. Now all you need to do is edit the spreadsheet and users will get the latest information everytime they visit. 

## Getting Started

This bit is the same for both client-side and server-side versions.

### Your Data

Your Google Spreadsheet should be set up with row one as your column headers, row two and beyond, your data. There shouldn't be any breaks or horizontal organization in the spreadsheet. Each header and row becomes an oject in the final array that Tabletop.js delivers of your data. Feel free to format the style of your spreadsheet as you wish; borders, colors and such do not transfer or affect your data exporting.

> example of how the data transforms from spreadsheet to final .json
> diagram of the no's in spreadsheets and how it reads the spreadsheets

    [{"name": "joe", "breed": "tabby", "age": 4}, {"name": "jesse", "breed": "siamese", "age": 2}]

#### Hexcolor

You must add a column to your spreadsheet with the heading _hexcolor_ (case insensitive). The maps, charts and such use colors and this is the easiest way to standardize that. The color scheme is up to you, all you need to do is fill the column with hexidecimal color values. This [color picker](http://color.hailpixel.com/) by [Devin Hunt](https://twitter.com/hailpixel) is really fun.

> show example of hexcolor column

#### Geocoding

If you intend to map your data and only have addresses you'll need to geocode the addresses into lat/long coordinates. Mapbox built a [plugin](http://mapbox.com/tilemill/docs/guides/google-docs/#geocoding)
 that does this for you in Google Docs. You can also use websites like [latlong.net](http://www.latlong.net/) to get the coordinates and paste them into rows with column headers _lat_ and _long_.
 
> image of lat and long column headers

#### Publishing Your Spreadsheet

You need to do this in order to generate a unique key for your spreadsheet which Tabletop.js will use to get your spreadsheet data.

> show how to publish and get key

### Your Website

Before you get started with Sheetsee.js you should plan out your website. Design it, create the basic markup and stylesheet. 

For now, create empty `div` placeholders for the map, chart and tables you plan on including.

## Hooking Up Your Data

Here the paths diverge:

### Client-side Hookup

Your Key

### Server-side Hookup

#### Running Locally

## Working With Your Data

Tabletop.js will return all of your data, it will be passed into your site as an _array of objects_ called **gData**. Sheetsee.js has functions built in to help you filter that data if you'd like.

### Sheetsee.getMatches(data, filter, category)

Takes **data** as an _array of objects_, a _string_ you'd like to **filter** and a _string_ of the **category** you want it to look in (a column header from your spreadsheet).

    getMatches(catData, "tabby", "breed")

Returns an _array of objects_ matching the category's filter.

    [{"name": "joe", "breed": "tabby"}, {"name": "jesse", "breed": "tabby"}]


### Sheetsee.getOccurance(data, category)

Takes **data** as an _array of objects_ and a _string_ for **category** (a column header from your spreadsheet) you want tally how often an element occured.

    getOccurance(catData, "breed")

Returns an object with keys and values for each variation of the category and its occurance. 

    {"tabby": 8, "siamese": 2, "feral": 1}

### Sheetsee.makeColorArrayOfObject(data, colors)

If you use `getOccurance()` and want to then chart that data with d3.js, you'll need to make it into an _array_ (instead of an object) and add colors back in (since the hexcolor column applies to the datapoints in your original dataset and not this new dataset).

This function takes in your data, as an _object_, and an _array_ of hexidecimal color strings which you define. 

    var mostPopBreeds = getOccurance(catData, "breed")
    var breedColors = ["#fffff", "#ffffff", "fffff"]
    
    var breedData = makeColorArrayOfObjects(mostPopBreeds, breedColors)
    
It will return an array of objects formatted to go directly into a d3 chart with the appropriate _units_ and _label keys_, like so:

    [{"label": "tabby", "units": 8, "hexcolor": "#ffffff"}, {"label": "siamese", "units": 2, "hexcolor": "#ffffff"}, {"label": "feral", "units": 2, "hexcolor": "#ffffff"}]
    
If you pass in an array of just one color it will repeat that color for all items. If you pass fewer colors than data elements it will repeat the sequences of colors for the remainder elements. 

### Sheetsee.addUnitsLabels(arrayObj, oldLabel, oldUnits) 

If you're using gData, the data directly from Tabletop, you'll need to format it before you use the d3 charts. You'll need to determine what part of your data you want to chart - what will be your label, what your charting, and what will be your units, how many of them are there (this should be a number).

    var gData =  [{"name": "joe", "breed": "tabby", "age": 4}, {"name": "jesse", "breed": "siamese", "age": 2}]
    
For istance, if from our original data above we want to chart the age of each cat, we'll use:

    Sheetsee.addUnitsLabels(gData, "name", "age")
   
Which will return an array, ready for the d3 charts:

    [{"label": "joe", "breed": "tabby", "units": 4}, {"label": "jesse", "breed": "siamese", "units": 2}]


## Make a Map

Sheetsee.js uses Mapbox.js, a Leaflet.js plugin, to make maps. 

Create an empty `<div>` in your HTML, with an id.

    <div id="map"></div>

Next you'll need to create geoJSON out of your data so that it can be mapped.

### Sheetsee.createGeoJSON()

Something, somthing.
    
     var geoJSON = createGeoJSON

### Sheetsee.loadMap(mapDiv)

To create a simple map, with no data, you simply call `.loadMap() and pass in a _string_ of the **mapDiv** (with no #) from your HTML.

    var map = Sheetsee.loadMap("map")

### Sheetsee.addTileLayer(map, tileLayer)

To add a tile layer, aka a custom map scheme/design/background, you'll use this function which takes in your **map** and the source of the **tileLayer**. This source can be a Mapbox id, a URL to a TileJSON or your own generated TileJSON. See [Mapbox's Documentation](http://mapbox.com/mapbox.js/api/v1.0.2/#L.mapbox.tileLayer) for more information.   

    Sheetsee.addTileLayer(map, 'examples.map-20v6611k')

You can add tiles from awesome mapmakers like [Stamen](examples.map-20v6611k) or create your own in Mapbox's [Tilemill](http://www.mapbox.com/tilemill) or [online](https://tiles.mapbox.com/newmap#3.00/0.00/0.00). 

### Sheetsee.addMarkerLayer(geoJSON, map)

To add makers to your map, use this function and pass in your **geoJSON** so that it can get the coordinates and your **map** so that it places the markers there.

    var markerLayer = Sheetsee.addMarkerLayer(geoJSON, map)

### Sheetsee.addPopups(geoJSON, map, markerLayer)

To customize the marker popup content in your map use this function and pass in your **geoJSON** with the details you'll use in your popup, your **map** and **markerLayer**. 

     Sheetsee.addPopups(geoJSON, map, markerLayer)

**customize geoJSON** 
**customize popup content**

## Make a Table

Sheetsee.js supports making multiple tables or templates with Handlebars. It currently supports sorting and filtering on just one table. For each of these you'll need a `<div>` in your html, a `<script>` template and a `<script>` that calls table making functions.

#### Your HTML Placeholder `<div>`

This is as simple as an empty `<div>` with an id. This id should match the script tempate id in the next section.

     <div id="siteTable"></div>

#### Your `<script>` Template

Your template is the mockup of what you'd like your table to look like and what content it should show. Most of this is up to you but if you want users to be able to click on headers and sort that column you must make a table row with table headers with the class _tHeader_.

The variables inside the {{}} must match the column headers in your spreadsheet. Lowercase (?) and remember spaces are ommited, so "Place Name" will become "placename".

    <script id="siteTable" type="text/html">
        <table>
        <tr><th class="tHeader">City</th><th class="tHeader">Place Name</th><th class="tHeader">Year</th><th class="tHeader">Image</th></tr>
          {{#rows}}
            <tr><td>{{city}}</td><td>{{placename}}</td><td>{{year}}</td><td>{{image}}</td></tr>
          {{/rows}}
      </table>
    </script>

#### Your `<script>` Execution

    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() { // IE6 doesn't do DOMContentLoaded
            Sheetsee.makeTable(gData, "#siteTable")
            Sheetsee.initiateTableFilter(gData, "#tableFilter", "#siteTable")
        }) 
    </script>

 Learn more about the things you can do with [Handlebars](). 

**is it handlebars or mustache http://icanhazjs.com/**
**how to set up non-tables yourself**


### Sheetsee.makeTable(data, targetDiv)

You'll call this to make a table out of a **data** and tell it what **targetDiv** in the html to render it in (this should also be the same id as your script template id).

    Sheetsee.makeTable(gData, "#siteTable")

## Table Filter/Search

If you want to have an input to allow users to search/filter the data in the table, you'll add this to your html:

    <input id="tableFilter" type="text" placeholder="filter by.."></input>
    <span class="clear button">Clear</span>
    <span class="noMatches">no matches</span>

### Sheetsee.initiateTableFilter(data, filterDiv, tableDiv)

You will then call this function to make that input live:

    Sheetsee.initiateTableFilter(gData, "#TableFilter", "#siteTable")

## Make a Chart

Sheetsee.js comes with a d3.js bar, pie and line chart. Each requires your data be an _array of objects_, formatted to contain "label" and "units" keys. See the section above on Your Data to learn about formatting.

You'll have to experiement with the charts to find the correct size your `<div>` will need to be to hold the chart with your data in it nicely. 

You can also make your own d3 chart in a separate .js file, link to that and pass your data on to it. I'd love to see people building some other charts that will work with Sheetsee.

### Bar Chart

To create a bar chart you'll need to add a placeholder `<div>` in your HTML with an id. 

    <div id="barChart"></div>

In your CSS, give it dimensions.

    #barChart {height: 400px; max-width: 600px; background: #F8CDCD;}

In a `<script>` tag set up your options. 

    var barOptions = {m: [60, 60, 30, 150], w: 600, h: 400, div: "#barChart", xaxis: "no. of pennies", hiColor: "#FF317D"} 

* **m** is margins: top, right, bottom, left
* **w** and **h** are width and height, this should match your CSS specs
* **div** is the id for the `<div>` in your HTML
* **xaxis** is optional text label for your x axis
* **hiColor** is the highlight color of your choosing! 

Then call the `d3BarChart()` function with your **data** and **options**.

    Sheetsee.d3BarChart(data, barOptions)

### Line Chart

To create a line chart you'll need to add a placeholder `<div>` in your html with an id. 

    <div id="lineChart"></div>

In your CSS, give it dimensions.

    #lineChart {height: 400px; max-width: 600px; background: #F8CDCD;}

In a `<script>` tag set up your options. 

    var lineOptions = {m: [80, 100, 120, 100], w: 600, h: 400, div: "#lineChart", yaxis: "no. of pennies", hiColor: "#14ECC8"}

* **m** is your margins: top, right, bottom, left
* **w** and **h** are width and height, this should match your CSS specs
* **div** is the id for the `<div>` in your HTML
* **yaxis** is optional text label for your y axis
* **hiColor** is the highlight color of your choosing! 

Then call the `d3LineChart()` function with your **data** and **options**.

    Sheetsee.d3LineChart(data, lineOptions)

### Pie Chart

To create a bar chart you'll need to add a placeholder `<div>` in your html with an id. 

    <div id="pieChart"></div>

In your CSS, give it dimensions.

    #pieChart {height: 400px; max-width: 600px; background: #F8CDCD;}

In a `<script>` tag set up your options. 

    var pieOptions = {m: [80, 80, 80, 80], w: 600, h: 400, div: "#pieChart", hiColor: "#14ECC8"}

* **m** is your margins: top, right, bottom, left
* **w** and **h** are width and height, this should match your CSS specs
* **div** is the id for the `<div>` in your HTML
* **hiColor** is the highlight color of your choosing! 

Then call the `d3PieChart()` function with your **data** and **options**.

    Sheetsee.d3PieChart(data, pieOptions)


## Awesome Possibilities

1. Small newsrooms with data for stories but small dev teams.
2. Friends or groups collaborating on data for a website/project.
3. Using iftt.com to auto populate spreadsheets which are hooked to a website with Sheetsee.js.

## Big Time Thanks

Thanks to Code for America for providing the platform me to build the first version of sheetsee.js for Macon, Georga. 

Thanks to Dan Sinker at Open News for having faith and getting things together to make this Code Sprint happen and thanks to Matt Green at WBEZ for being a willing partner. 

Thanks to Max Ogden for emotional support, teaching me JavaScript and working on the harder parts of Sheetsee.js - especially for making Tabletop.js for Node.js.

Thanks to all the authors and contributors to Tabletop.js, Mapbox.js, Leaflet.js, jQuery, ICanHas.js and d3.js. Thanks to Google and the Internet for existing and to all those who've written tutorials or asked or answered a question on StackOverflow. 

Thanks to Mom and Dad for getting a computer in 1996 and the mIRC scripts I started writing that I suppose would eventually lead me here.
 
