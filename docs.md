# Sheetsee.js
Sheetsee.js is a Javascript library that makes it easy to use a Google Spreadsheet as the database powering the tables, charts and maps on a website. Once set up, any changes to the spreadsheet will auto-saved by Google and be live on your when a visitor refreshes the page. 

Using Google Spreadsheets as the backend database is awesome because it is easy to edit, share and collaborate on. 

### Dependencies

Sheetsee.js depends on a few other awesome JavaScript libraries to make all this happen. First, [Tabletop.js](http://builtbybalance.com/Tabletop/) gets the data from the Google Spreadsheet and makes it nice and useable. Once you have your data Sheetsee.js makes it easy to set up tables or templates with [Mustache.js](http://mustache.github.io/), maps with [Mapbox.js](http://mapbox.com/mapbox.js/example/v1.0.0/) and [Leaflet.js](http://leafletjs.com/), and charts with [d3.js](http://d3js.org/). And [jQuery](http://jquery.com/) of course powers most of the interactions. It also has many sorting and filtering functions built in so that you can display different parts of your data if you want. Each of these are explained in more detail below.

### CSS

Sheetsee.js comes with a bare minimum stylesheet. This way you can customize your site to look the way you want to it or to match an existing site's design. 

### Client-side or Server-side

Sheetsee.js comes in two flavors, [client-side]() and [server-side](). The client-side is the most approachable and straightforward, you just include sheetsee.js and the dependencies on your page and use sheetsee.js as normal.

The server-side version is built with node.js and you'll need to understand node and be publishing to a server that runs node.js apps. This version saves a version of the data on the server so that the browser doesn't have to fetch from Google at every request, which can sometimes be slow. It also allows for offline development, huzzah! 

## Getting Started

This bit is the same for both client-side and server-side versions.

### Your Data

Your Google Spreadsheet should be set up with row one as your column headers and row two to beyond, your data. There shouldn't be any breaks or horizontal organization in the spreadsheet. Each header and row becomes an oject in the final array that Tabletop.js delivers of your data. Feel free to format the style of your spreadsheet as you wish; borders, colors and such do not transfer or affect your data exporting.

> example of how the data transforms from spreadsheet to final .json
> diagram of the no's in spreadsheets and how it reads the spreadsheets

    [{"name": "joe", "breed": "tabby", "age": 4}, {"name": "jesse", "breed": "siamese", "age": 2}]

### Hexcolor

You must add a column to your spreadsheet with the heading `hexcolor` (case insensitive). The maps, charts and such use colors and this is the easiest way to standardize that. The color scheme is up to you, all you need to do is but a hexidecimal color value in each cell. This [color picker](http://color.hailpixel.com/) by [Devin Hunt](https://twitter.com/hailpixel) is really fun.

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

## Working With Your Data

Tabletop.js will return all of your data, it will be passed into your site as **gData**. Sheetsee.js has functions built in to help you filter that data if you'd like.

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
    
It will return an array of objects formatted to go directly into a d3 chart witht he appropriate _units_ and _label keys_, like so:

    [{"label": "tabby", "units": 8, "hexcolor": "#ffffff"}, {"label": "siamese", "units": 2, "hexcolor": "#ffffff"}, {"label": "feral", "units": 2, "hexcolor": "#ffffff"}]
    
If you pass in an array of just one color it will repeat that color for all items. If you pass fewer colors than data elements it will repeat the sequences of colors for the remainder elements. 

### Sheetsee.addUnitsLabels(arrayObj, oldLabel, oldUnits) 

If you're using gData, the data directly from Tabletop, you'll need to format it before you use the d3 charts. You'll need to determine what part of your data you want to chart - what will be your label, what your charting, and what will be your units, how many of them are there.

    var gData =  [{"name": "joe", "breed": "tabby", "age": 4}, {"name": "jesse", "breed": "siamese", "age": 2}]
    
For istance, if from or original data we want to chart the age of each cat, we'll use:

   Sheetsee.addUnitsLabels(gData, "name", "age")
   
Which will return a simplified array, ready for the d3 charts:

    [{"label": "joe", "units": 4}, {"label": "jesse", "units": 2}]
    
    




