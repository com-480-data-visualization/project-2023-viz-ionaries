// define the data as global cache
let cache = new Map();

// Define the color scale
function setup_cache() {
  cache.set("beer_style", "Ale");
  cache.set("n", 5);
  cache.set("labels", ["low", "l","","h", "high"]);
  cache.set("colors", [
    ["#d3d3d3", "#b6cdcd", "#97c5c5", "#75bebe", "#52b6b6"],
    ["#cab6c5", "#aeb0bf", "#91aab9", "#70a4b2", "#4e9daa"],
    ["#c098b9", "#a593b3", "#898ead", "#6b89a6", "#4a839f"],
    ["#b77aab", "#9e76a6", "#8372a0", "#666e9a", "#476993"],
    ["#ad5b9c", "#955898", "#7c5592", "#60528d", "#434e87"]
  ]);
}

legend = (svg) => {
    const k = 15;
    const n = cache.get('n');
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
      .attr('fill', ([i, j]) => cache.get('colors')[j][i]);
  
    rects.append('title')
      .text(([i, j]) => `${"Val 1"}${cache.get('labels')[j] ? ` (${cache.get('labels')[j]})` : ''} 
      ${"Val 2"}${cache.get('labels')[i] ? ` (${cache.get('labels')[i]})` : ''}`);
  
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
  };


// Create a function to draw the maps
async function drawMap() {

  // Request the GeoJSON for the US
  let geojson_us = await d3.json("us_borders.json")

  let usaProjection = d3.geoAlbersUsa()
  .scale(600)
  .translate([217, 200])
  
  // Render GeoJSON feature paths
  map_us.selectAll("path")
    .data(geojson_us.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath().projection(usaProjection))
    .attr("stroke", "grey") // Color of the lines 
    .attr("fill", "white") // Fill color for the feature

  // Request the GeoJSON for europe
  let geojson_eu = await d3.json("europe_borders.json")

  let europeProjection = d3.geoMercator()
  .center([ 13, 52 ])
  .scale([ mapWidth / 1.8 ])
  .translate([ mapWidth / 2  + mapWidth / 10, mapHeight / 2 ])

  // Tell D3 to render a path for each GeoJSON feature
  map_eu.selectAll("path")
    .data(geojson_eu.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath().projection(europeProjection))
    .attr("stroke", "grey") // Color of the lines
    .attr("fill", "white") // Fill color for the feature
};

// Function to parse CSV data into a Map
function parseCSV(d, type) {

    // create an object for each row
    let values = {
        rating: d.mean_rating,
        count: d.count_rating,
        rel_count : d.relative_count
    };

    if (type == "state") {
      let key = [d.state, d.meta_style];
      // add the object to the map
      return [key, values];
    }
    else {
      let key = [d.country, d.meta_style];
      // add the object to the map
      return [key, values];
    };

  };

// function to load the data
function loadCSV(file, type) {

  const map = new Map();

  d3.csv(file, data => {
    map.set(parseCSV(data, type));
  });
  return map;
  };

async function load_files(file1, type1, file2, type2) {
  // Load the CSV files and store the results in two Maps

  Promise.all([loadCSV(file1, type1), loadCSV(file2, type2)])
  .then(([country_map, us_map]) => {
    // Load the maps to cache
    cache.set('country_beer_data', country_map);
    cache.set('us_beer_data', us_map);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

};

// Function to calculate the color
function calculate_color(values) {

    // If the value is undefined, return the first color
    console.log(values);

    if (values === undefined) {
        console.log("undefined");
        return cache.get('colors')[0];
        };
  
        const rating = values[rating];
        const production = values[count];
        const relative_production = values[rel_count];
        
        // Calculate row_indx and col_indx where the min and max values are located
        let row_indx = 0;
        let col_indx = 0;
        
        let max_rating = 5;
        let min_rating = 3.5;

        // find the min production among all beer styles

        if (rating < min_rating) {
            row_indx = min_rating;
        } else if (rating > max_rating) {
            row_indx = max_rating;
        } else {
            row_indx = Math.floor((rating - min_rating) / (max_rating - min_rating) * 4);
        }

        return cache.get('colors')[row_indx][col_indx];
};

// create a function to color all countries of map_eu and map_us depending on the current beer_style
function color_maps() {
    // remove color from all countries, add a 0.3 sec fade
    console.log("coloring maps");
    console.log(cache.get('beer_style'));
    console.log(map_us);
    console.log(map_eu);
    
    map_us.selectAll("path")
        .transition()
        .duration(1000)
        .attr("fill", function (d) {
          console.log(d);
          console.log(d.properties.name);
          console.log(cache.get("us_beer_data").get([d.properties.name, cache.get('beer_style')]));

            return calculate_color(cache.get("us_beer_data").get([d.properties.name, cache.get('beer_style')]));
          });

    map_eu.selectAll("path")
        .transition()
        .duration(300)
        .attr("fill", function (d) {
            return calculate_color(cache.get("country_beer_data").get([d.properties.name, cache.get('beer_style')]));
          });
};

// Create the watchers for the radial list

// create the function called
function style_change(new_style) {
    // Change the text in the element with the id "style_choice", update cache['beer_style']
    cache['beer_style'] = new_style;
    document.getElementById("style_choice").innerHTML = new_style;
    };

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

//////////////////////////////////////////////////////////////////////////////////

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

function map_main() {

  setup_cache();

  // Append the legend
  map_eu.append(() => legend(map_eu))
  .attr('transform', 'translate(56, 200)')
  .attr('font-family', 'sans-serif')
  .attr('font-size', 10);

  Promise.all([drawMap(),load_files("country_beers.csv", "country", "us_beers.csv", "state")]).then(() => {
    color_maps();
  });  
};

map_main();
