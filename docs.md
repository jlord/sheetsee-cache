# Sheetsee.js
Sheetsee.js is a Javascript library that makes it easy to use a Google Spreadsheet as the database powering the tables, charts and maps on a website. Once set up, any changes to the spreadsheet will auto-saved by Google and be live on your when a visitor refreshes the page. 

Using Google Spreadsheets as the backend database is awesome because it is easy to edit, share and collaborate on. 

#### Dependencies

Sheetsee.js depends on a few other awesome JavaScript Libraries to make all this happen. First, Tabletop.js gets the data from the Google Spreadsheet and makes it nice and useable. Once you have your data Sheetsee.js makes it easy to set up tables or templates with Mustache.js, maps with (Mapbox.js)[http://mapbox.com/mapbox.js/example/v1.0.0/] and Leaflet.js and charts with d3.js. jQuery of course powers most of the interactions. It also has many sorting and filtering functions built in so that you can display different parts of your data if you want. Each of these are explained in more detail below.

#### CSS

Sheetsee.js comes with a bare minimum stylesheet. This way you can customize your site to look the way you want to it or to match an existing site's design. 

#### Client-side or Server-side

Sheetsee.js comes in two flavors, client-side and server-side. The client-side is the most approachable and straightforward, you just include sheetsee.js and the dependencies on your page and use sheetsee.js as normal.

The server-side version is built with node.js and you'll need to understand node and be publishing to a server that runs node.js apps. This version saves a version of the data on the server so that the browser doesn't have to fetch from Google at every request, which can sometimes be slow. It also allows for offline development, huzzah! 

