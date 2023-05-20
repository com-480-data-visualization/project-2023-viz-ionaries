
var colors = [
    "#e8e8e8", "#e4d9ac", "#c8b35a",
    "#cbb8d7", "#c8ada0", "#af8e53",
    "#9972af", "#976b82", "#804d36"
  ];
  
  const color = (value) => {
    if (!value) return "#ccc";
    if (!Array.isArray(value)) {
      value = [value]; // Wrap the non-iterable value in an array
    }
    let [a, b] = value;
    return colors[y(b) + x(a) * n];
  };

  let countiesData; // Variable to hold the loaded data

  
  // Function to render the map using the loaded US data
  
/// The svg
var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
.scale(70)
.center([0,20])
.translate([width / 2, height / 2]);

// Data and color scale
(async function() {
    const data = await d3.csv("cdc-diabetes-obesity.csv", d => ({
      ...d,
      diabetes: +d.diabetes,
      obesity: +d.obesity
    }));
  
    y = d3.scaleQuantile(Array.from(data.values(), d => d[1]), d3.range(n))
    x = d3.scaleQuantile(Array.from(data.values(), d => d[0]), d3.range(n))
    // Use the loaded data
    console.log(data); // Display the data (replace with your desired logic)

    d3.json("counties-albers-10m.json").then(function(us) {
        // Call the function to render the map using the loaded data

        renderMap(us);
      }).catch(function(error) {
        // Handle any error that occurs during loading
        console.error(error);
      });
    
      function renderMap(us) {
        // Append county paths
        svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .join("path")
      .attr("fill", d => color(d))
      .attr("d", path)
      .append("title")
      
      }

  })();

var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");


  n = Math.floor(Math.sqrt(colors.length))
  labels = ["low", "", "high"]
  
  path = d3.geoPath()
  
  format = (value) => {
      if (!value) return "N/A";
      let [a, b] = value;
      return `${a}% ${data.title[0]}${labels[x(a)] && ` (${labels[x(a)]})`}
    ${b}% ${data.title[1]}${labels[y(b)] && ` (${labels[y(b)]})`}`;
    }
  