// define the data as global cache
let cache = new Map();

// Define the color scale
function setup_cache(n) {

  // Get the text of document.getElementById("style_choice") and set it as beer style
  cache.set("beer_style", document.getElementById("style_choice").innerHTML);
  cache.set("n", n);
  determine_ranges_and_labels([3, 3.9], [0,0.29]);

  // set labels are rounded to 2 decimals versions of the ranges
  let rating_step_list = cache.get('rating_step_list').map(d => d.toFixed(2));
  let rel_prod_step_list = cache.get('rel_prod_step_list').map(d => d.toFixed(2));

  // Append a '<' to the end of the rating labels
  rating_step_list.push(5.00);
  rel_prod_step_list.push(1.00);

  cache.set("rating_labels", rating_step_list);
  cache.set("rel_prod_labels", rel_prod_step_list);
  
  if (cache.get('n') == 3) {
    cache.set("colors", [
      ["#d3d3d3", "#97c5c5", "#52b6b6"],
      ["#c098b9", "#898ead", "#4e9daa"],
      ["#ad5b9c", "#955898", "#434e87"]
    ]);
  
  }
  else if (cache.get('n') == 4){
    cache.set("colors", [
      ["#d3d3d3", "#97c5c5", "#75bebe", "#52b6b6"],
      ["#cab6c5", "#aeb0bf", "#70a4b2", "#4e9daa"],
      ["#b77aab", "#9e76a6", "#666e9a", "#476993"],
      ["#ad5b9c", "#955898", "#60528d", "#434e87"]
    ]);
  } else {
    cache.set("colors", [
      ["#d3d3d3", "#b6cdcd", "#97c5c5", "#75bebe", "#52b6b6"],
      ["#cab6c5", "#aeb0bf", "#91aab9", "#70a4b2", "#4e9daa"],
      ["#c098b9", "#a593b3", "#898ead", "#6b89a6", "#4a839f"],
      ["#b77aab", "#9e76a6", "#8372a0", "#666e9a", "#476993"],
      ["#ad5b9c", "#955898", "#7c5592", "#60528d", "#434e87"]
    ]);
  }


}

legend = (svg) => {
    const k = 15;
    const n = cache.get('n');

    let legendMouseOver = function(d) {

      let d_color = d3.select(this).attr("fill")
      let selectedPaths = d3.selectAll("path").filter(function(event) {
        return d3.select(this).attr("fill") === d_color; });

      d3.selectAll("path")
        .transition()
        .duration(200)
        .style("opacity", .4)

      d3.selectAll("rect")
        .transition()
        .duration(200)
        .style("opacity", .4)

      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)

      selectedPaths
        .transition()
        .duration(200)
        .style("opacity", 1)
    }

    let legendMouseLeave = function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        
      d3.selectAll("path")
        .transition()
        .duration(200)
        .style("opacity", 1)

      d3.selectAll("rect")
        .transition()
        .duration(200)
        .style("opacity", 1)
    }
  
    const legendGroup = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10);
  
    const innerGroup = legendGroup.append('g')
      .attr('transform', `translate(-${k * n / 2}, -${k * n / 2}) rotate(-45 ${k * n / 2},${k * n / 2})`);
  
    innerGroup.append('defs').append('marker')
      .attr('id', 'arrows')
      .attr('markerHeight', 10)
      .attr('markerWidth', 10)
      .attr('refX', 6)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('stroke-width', 1.5)
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
      .attr('fill', ([i, j]) => cache.get('colors')[j][i])
    
    rects.on("mouseover", legendMouseOver)
      .on("mouseleave", legendMouseLeave);
  
    rects.append('title')
      .text(([i, j]) => "Rating range: " + cache.get('rating_labels')[i]+ " - "+ cache.get('rating_labels')[i+1] + "\n"
       + "Relative Production range: " + cache.get('rel_prod_labels')[j]+ " - "+ cache.get('rel_prod_labels')[j+1]);

    innerGroup.append('line')
      .attr('id', 'lineID')
      .attr('marker-end', `url(#${'arrows'})`)
      .attr('x1', 0)
      .attr('x2', n * k)
      .attr('y1', n * k)
      .attr('y2', n * k)
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);
  
    innerGroup.append('line')
      .attr('marker-end', `url(#${'arrows'})`)
      .attr('y2', 0)
      .attr('y1', n * k)
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);
  
    innerGroup.append('text')
      .attr('font-weight', 'bold')
      .attr('dy', '0.71em')
      .attr('transform', `rotate(90) translate(${n / 2 * k}, 6)`)
      .attr('text-anchor', 'middle')
      .text("Production*");
  
    innerGroup.append('text')
      .attr('font-weight', 'bold')
      .attr('dy', '0.71em')
      .attr('transform', `translate(${n / 2 * k}, ${n * k + 6})`)
      .attr('text-anchor', 'middle')
      .text("Rating");
  
    return legendGroup.node();
  };


// Create a function to draw the maps
async function drawMap(map_us, map_eu) {

  // Request the GeoJSON for the US
  let geojson_us = await d3.json("website/heatmap/us_borders.json")

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
  let geojson_eu = await d3.json("website/heatmap/europe_borders.json")

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

// function to load the data
function loadCSV(file, type) {

  const map = new Map();

  Promise.all([
    d3.csv(file)
  ]).then(function(files) {
    const csvData = files[0];
  
    // Process the CSV data and populate the map
    csvData.forEach(function(d) {

      // create an object for each row
      let key = '';
      let values = {
      rating: d.mean_rating,
      count: d.count_rating,
      rel_count : d.relative_count
      };

      if (type == "state") {
        key = d.state + '_' + d.meta_style;
      }
      else {
        key = d.country + '_' + d.meta_style;
      };

      map.set(key, values);
    });});

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

// Function to determine the ranges and labels 
function determine_ranges_and_labels(rating_range, rel_prod_range) {
  // Calculate rating_idx and prod_idx where the min and max values are located
  
  let max_rating = rating_range[1];
  let min_rating = rating_range[0];

  let max_rel_prod = rel_prod_range[1];
  let min_rel_prod = rel_prod_range[0];
  
  // create a list of size n with the steps for the rating
  let rating_step_list = [];
  let rel_prod_step_list = [];

  for (let i = 0; i < cache.get('n'); i++) {
      rating_step_list.push(min_rating + i * (max_rating - min_rating) / (cache.get('n') - 1));
      rel_prod_step_list.push(min_rel_prod + i * (max_rel_prod - min_rel_prod) / (cache.get('n') - 1));
  };

  // Update cache
  cache.set('rating_step_list', rating_step_list);
  cache.set('rel_prod_step_list', rel_prod_step_list);
};

// Function to calculate the color
function calculate_color(values) {

    // If the value is undefined, return the white color
    if (values === undefined) {
        return "white";
        };
  
        const rating = values['rating'];
        const relative_production = values['rel_count'];

        // find the min production among all beer styles
        let rating_idx = 0;
        let prod_idx = 0;

        if (rating < cache.get('rating_step_list')[0]) {
            rating_idx = 0;
        } else if (rating > cache.get('rating_step_list')[cache.get('n') - 1]) {
            rating_idx = cache.get('n') -1;
        } else {
          // find the row index
          for (let i = 0; i < cache.get('n'); i++) {
            if (rating >= cache.get('rating_step_list')[i] && rating < cache.get('rating_step_list')[i + 1]) {
              rating_idx = i;
              break;
            };
          };
        }
        if (relative_production < cache.get('rel_prod_step_list')[0]) {
            prod_idx = 0;
        } else if (relative_production > cache.get('rel_prod_step_list')[cache.get('n') - 1]) {
          prod_idx = cache.get('n') - 1 ;
        } else {
          // find the column index
          for (let i = 0; i < cache.get('n') - 1; i++) {
            if (relative_production >= cache.get('rel_prod_step_list')[i] && relative_production < cache.get('rel_prod_step_list')[i + 1]) {
              prod_idx = i;
              break;
            };
          };
        }
        
        return cache.get('colors')[prod_idx][rating_idx];
};

function get_tooltip_label(d, type) {
  if (type == "state") {
    let val = cache.get("us_beer_data").get(d.properties.name +'_'+ cache.get('beer_style'));
    if (val === undefined) {
      return "No data available";
    }
    else {
      // round values top 2 decimals
      let rounded_rating = Math.round(val['rating']*100);
      let rounded_rel_count = Math.round(val['rel_count'] * 100);
      
      return "Rating: " + rounded_rating/100 + "\nRelative Production: " + rounded_rel_count +'%';
    }
  } 
  else {
    let val = cache.get("country_beer_data").get(d.properties.name +'_'+ cache.get('beer_style'));
    if (val === undefined) {
      return "No data available";
    }
    else {
      // round values top 2 decimals
      let rounded_rating = Math.round(val['rating'] * 100);
      let rounded_rel_count = Math.round(val['rel_count'] * 100);
      return "Rating: " + rounded_rating/100 + "\nRelative Production: " + rounded_rel_count +'%';
    }
  };
};


// create a function to color all countries of map_eu and map_us depending on the current beer_style
let mouseOver = function(d) {
  let d_color = d3.select(this).attr("fill")

  let selectedPaths = d3.selectAll("rect").filter(function(event) {
    return d3.select(this).attr("fill") === d_color; });

  d3.selectAll("path")
    .transition()
    .duration(200)
    .style("opacity", .4)
  
  d3.selectAll("rect")
    .transition()
    .duration(200)
    .style("opacity", .4)

  selectedPaths
    .transition()
    .duration(200)
    .style("opacity", 1)

  d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "black")
}

let mouseLeave = function(d) {

  d3.selectAll("rect")
        .transition()
        .duration(200)
        .style("opacity", 1)

  d3.selectAll("path")
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "gray")

  d3.select(this)
    .transition()
    .duration(200)
    .style("stroke", "gray")
}

function color_maps(map_us, map_eu) {

  map_us.selectAll("path")
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .attr("fill", function (d) {
        
          return calculate_color(cache.get("us_beer_data").get(d.properties.name +'_'+ cache.get('beer_style')));
        });
  
  map_eu.selectAll("path")
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .attr("fill", function (d) {return calculate_color(cache.get("country_beer_data").get(d.properties.name +'_'+ cache.get('beer_style')));
        });
  // remove tooltip
  map_eu.selectAll("path")
  .select('title')
    .remove();

  map_us.selectAll("path")
  .select('title')
    .remove();

  // add tooltip
  map_eu.selectAll("path")
  .append('title')
    .text(d => d.properties.name + "\n" + get_tooltip_label(d, "country"));

  map_us.selectAll("path")
  .append('title')
    .text(d => d.properties.name + "\n" + get_tooltip_label(d, "state"));
};

// Create the watchers for the radial list

// create the function called
function map_style_change(new_style, map_us, map_eu) {
    // Change the text in the element with the id "style_choice", update cache['beer_style']
    cache.set('beer_style', new_style);
    
    document.getElementById("style_choice").innerHTML = new_style;
    // update the color of the maps
    color_maps(map_us, map_eu);
    };

//////////////////////////////////////////////////////////////////////////////////

// Define the width and height of each map
const mapWidth = 434;
const mapHeight = 450;

function map_main(n) {
  // Clear everything from #map_us and #map_europe
  d3.select("#map_us").selectAll("*").remove();
  d3.select("#map_europe").selectAll("*").remove();

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

  setup_cache(n);

  // Remove the legend if it exists
  map_us.selectAll("g").remove();

  // Append the legend
  map_eu.append(() => legend(map_eu))
  .attr('transform', 'translate(58, 200)')
  .attr('font-family', 'sans-serif')
  .attr('font-size', 10);

  Promise.all([drawMap(map_us, map_eu),load_files("website/heatmap/country_beers.csv", "country", "website/heatmap/us_beers.csv", "state")]).then(() => {
    color_maps(map_us, map_eu);
  });  
  document.getElementById("btn4_alcohol_free").addEventListener("click", function(event) {
    event.stopPropagation();
    map_style_change("Alcohol-free",map_us, map_eu);  });

  document.getElementById("btn4_ale").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Ale",map_us, map_eu);  });

  document.getElementById("btn4_Ambree").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Ambree",map_us, map_eu);  });

  document.getElementById("btn4_belgian").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Belgian Blonde",map_us, map_eu);  });

  document.getElementById("btn4_boozy").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Boozy",map_us, map_eu);  });

  document.getElementById("btn4_ipa").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("IPA",map_us, map_eu);  });

  document.getElementById("btn4_lager").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Lager",map_us, map_eu);  });

  document.getElementById("btn4_other").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Other",map_us, map_eu);  });

  document.getElementById("btn4_sour").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Sour",map_us, map_eu);  });

  document.getElementById("btn4_stout").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Stout",map_us, map_eu);  });

  document.getElementById("btn4_wheat").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Wheat Beer",map_us, map_eu);  });

  document.getElementById("btn4_winter").addEventListener("click", function(event) {
    event.stopPropagation();
      map_style_change("Winter Beer",map_us, map_eu);  });
};

map_main(3);
