
// Define the width and height of each map
const mapWidth = 434;
const mapHeight = 450;

let beer_style = "Ale";

// Define the color scale

  const colors = [
    ["#d3d3d3", "#b6cdcd", "#97c5c5", "#75bebe", "#52b6b6"],
    ["#cab6c5", "#aeb0bf", "#91aab9", "#70a4b2", "#4e9daa"],
    ["#c098b9", "#a593b3", "#898ead", "#6b89a6", "#4a839f"],
    ["#b77aab", "#9e76a6", "#8372a0", "#666e9a", "#476993"],
    ["#ad5b9c", "#955898", "#7c5592", "#60528d", "#434e87"]
  ];

const n = 5;
const labels = ["low", "l","","h", "high"];

legend = (svg) => {
    const k = 15;
    const arrow = 'arrow-' + Date.now(); // Generate a unique ID for the arrow marker
  
    const legendGroup = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10);
  
    const innerGroup = legendGroup.append('g')
      .attr('transform', `translate(-${k * n / 2}, -${k * n / 2}) rotate(-45 ${k * n / 2},${k * n / 2})`);
  
    innerGroup.append('defs').append('marker')
      .attr('id', arrow)
      .attr('markerHeight', 10)
      .attr('markerWidth', 10)
      .attr('refX', 6)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0L9,3L0,6Z');
  
    const rects = innerGroup.selectAll('rect')
      .data(d3.cross(d3.range(n), d3.range(n)))
      .enter()
      .append('rect')
      .attr('width', k)
      .attr('height', k)
      .attr('x', ([i]) => i * k)
      .attr('y', ([, j]) => (n - 1 - j) * k)
      .attr('fill', ([i, j]) => colors[j][i]);
  
    rects.append('title')
      .text(([i, j]) => `${"Val 1"}${labels[j] ? ` (${labels[j]})` : ''} ${"Val 2"}${labels[i] ? ` (${labels[i]})` : ''}`);
  
    innerGroup.append('line')
      .attr('marker-end', `url(#${arrow})`)
      .attr('x1', 0)
      .attr('x2', n * k)
      .attr('y1', n * k)
      .attr('y2', n * k)
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);
  
    innerGroup.append('line')
      .attr('marker-end', `url(#${arrow})`)
      .attr('y2', 0)
      .attr('y1', n * k)
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);
  
    innerGroup.append('text')
      .attr('font-weight', 'bold')
      .attr('dy', '0.71em')
      .attr('transform', `rotate(90) translate(${n / 2 * k}, 6)`)
      .attr('text-anchor', 'middle')
      .text("Val2");
  
    innerGroup.append('text')
      .attr('font-weight', 'bold')
      .attr('dy', '0.71em')
      .attr('transform', `translate(${n / 2 * k}, ${n * k + 6})`)
      .attr('text-anchor', 'middle')
      .text("Val2");
  
    return legendGroup.node();
  }

// define the data
let beer_data_us = new Map();
let beer_data_eu = new Map();

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

// Append the legend
map_eu.append(() => legend(map_eu))
  .attr('transform', 'translate(56, 200)')
  .attr('font-family', 'sans-serif')
  .attr('font-size', 10);


// A projection tells D3 how to orient the GeoJSON features
let usaProjection = d3.geoAlbersUsa()
  .scale(600)
  .translate([217, 200])

let europeProjection = d3.geoMercator()
  .center([ 13, 52 ])
  .scale([ mapWidth / 1.8 ])
  .translate([ mapWidth / 2  + mapWidth / 10, mapHeight / 2 ])

// The path generator uses the projection to convert the GeoJSON
// geometry to a set of coordinates that D3 can understand

us_pathGenerator = d3.geoPath().projection(usaProjection)
us_geoJsonUrl = "us_borders.json"

eu_pathGenerator = d3.geoPath().projection(europeProjection)
eu_geoJsonUrl = "europe_borders.json"

// Request the GeoJSON for the US
d3.json(us_geoJsonUrl).then(geojson => {
    
    // Tell D3 to render a path for each GeoJSON feature
    map_us.selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", us_pathGenerator) // This is where the magic happens
      .attr("stroke", "grey") // Color of the lines themselves
      .attr("fill", "white") // Color uses to fill in the 
    
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
Promise.all([
    d3.csv("test.csv")
  ]).then(function(files) {
    const csvData = files[0];
  
    // Process the CSV data and populate the map
    csvData.forEach(function(d) {
        // create an object for each row
        let values = {
            rate: d.rate,
            rank: d.rank
        };
        // add the object to the map
        beer_data_us.set(d.name, values);
    });
  
    // Call the "ready" function with the populated map
    ready(null, beer_data_us);
  }).catch(function(error) {
    // Handle any errors that occur during loading or processing
    console.error(error);
  });

// Function to calculate the color
function calculate_color(values) {

    // If the value is undefined, return the first color
    if (values === undefined) {
        return colors[0];
        }
    
        
        const rating = values[beer_style + "_rating"];
        const production = values[beer_style + "_prod"];
        const relative_production = values[beer_style + "_rel_prod"];
        
        // Calculate row_indx and col_indx where the min and max values are located
        let row_indx = 0;
        let col_indx = 0;
        
        max_rating = 5;
        min_rating = 3.5;

        // find the min production among all beer styles

        if (rating < min_rating) {
            row_indx = min_rating;
        } else if (rating > max_rating) {
            row_indx = max_rating;
        } else {
            row_indx = Math.floor((rating - min_rating) / (max_rating - min_rating) * 4);
        }

        return colors[row_indx][col_indx];
}

// create a function to color all countries of map_eu and map_us depending on the current beer_style
function color_maps() {
    // remove color from all countries, add a 0.3 sec fade
    map_us.selectAll("path")
        .transition()
        .duration(300)
        .attr("fill", function (d) {
            return calculate_color(beer_data_us.get(d.properties.name));
          })
            // Add a tooltip
            .append("title")
            .text(function (d) {
                return d.properties.name + ": " + beer_data_us.get(d.properties.name);
            }
            );

    map_eu.selectAll("path")
        .transition()
        .duration(300)
        .attr("fill", function (d) {
            return calculate_color(beer_data_eu.get(d.properties.name));
          })
            // Add a tooltip
            .append("title")
            .text(function (d) {
                return d.properties.name + ": " + beer_data_eu.get(d.properties.name);
            }
            );
}


function ready(error) {
    
    color_maps();
}

// Create the watchers for the radial list

// create the function called
function style_change(new_style) {
    // Change the text in the element with the id "style_choice"
    beer_style = new_style;
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



