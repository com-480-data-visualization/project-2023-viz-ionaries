
// Define the width and height of each map
const mapWidth = 434;
const mapHeight = 450;

// Create the first map
const map_us = d3.select("#map_us")
  .append("svg")
  .attr("width", mapWidth)
  .attr("height", mapHeight);

// Create the second map
const map_eu = d3.select("#map_europe")
.append("svg")
.attr("width", mapWidth)
.attr("height", mapHeight);

// A projection tells D3 how to orient the GeoJSON features
let usaProjection = d3.geoAlbersUsa()
  .scale(600)
  .translate([217, 200])

let europeProjection = d3.geoMercator()
  .center([ 13, 52 ])
  .scale([ mapWidth / 1.8 ])
  .translate([ mapWidth / 2, mapHeight / 2 ])

// The path generator uses the projection to convert the GeoJSON
// geometry to a set of coordinates that D3 can understand

us_pathGenerator = d3.geoPath().projection(usaProjection)
us_geoJsonUrl = "us_borders.json"

eu_pathGenerator = d3.geoPath().projection(europeProjection)
eu_geoJsonUrl = "https://gist.githubusercontent.com/spiker830/3eab0cb407031bf9f2286f98b9d0558a/raw/7edae936285e77be675366550e20f9166bed0ed5/europe_features.json"

// Request the GeoJSON for us
d3.json(us_geoJsonUrl).then(geojson => {
    // Tell D3 to render a path for each GeoJSON feature
    map_us.selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", us_pathGenerator) // This is where the magic happens
      .attr("stroke", "grey") // Color of the lines themselves
      .attr("fill", "white") // Color uses to fill in the lines
  })

// Request the GeoJSON for europe
d3.json(eu_geoJsonUrl).then(geojson => {
    // Tell D3 to render a path for each GeoJSON feature
    map_eu.selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", eu_pathGenerator) // This is where the magic happens
      .attr("stroke", "grey") // Color of the lines themselves
      .attr("fill", "white") // Color uses to fill in the lines
  })


// Load external data and boot
d3.queue()
  .defer(d3.json, "us_borders.json")
  .defer(d3.csv, "cdc-diabetes-obesity.csv", function(d) { data.set(d.county, [+d.diabetes, +d.obesity]); })
  .await(ready);

function ready(error, topo) {
    i = 0;
}


// Create the watchers for the radial list

// create the function called
function style_change(new_style) {
    // Change the text in the element with the id "style_choice"
    document.getElementById("style_choice").innerHTML = new_style;
    }

document.getElementById("btn_alcohol_free").addEventListener("click", function() {
    style_change("Alcohol Free");  });

document.getElementById("btn_ale").addEventListener("click", function() {
    style_change("Ale");  });

document.getElementById("btn_Ambree").addEventListener("click", function() {
    style_change("Ambree");  });

document.getElementById("btn_belgian").addEventListener("click", function() {
    style_change("Belgian");  });

document.getElementById("btn_boozy").addEventListener("click", function() {
    style_change("Boozy");  });

document.getElementById("btn_ipa").addEventListener("click", function() {
    style_change("IPA");  });

document.getElementById("btn_lager").addEventListener("click", function() {
    style_change("Lager");  });

document.getElementById("btn_other").addEventListener("click", function() {
    style_change("Other");  });

document.getElementById("btn_sour").addEventListener("click", function() {
    style_change("Sour");  });

document.getElementById("btn_stout").addEventListener("click", function() {
    style_change("Stout");  });

document.getElementById("btn_wheat").addEventListener("click", function() {
    style_change("Wheat Beer");  });

document.getElementById("btn_winter").addEventListener("click", function() {
    style_change("Winter Beer");  });


