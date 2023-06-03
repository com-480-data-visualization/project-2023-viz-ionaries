
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    violin_width = 460 - margin.left - margin.right,
    violin_height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#violin_plot")
  .append("svg")
    .attr("width", violin_width + margin.left + margin.right)
    .attr("height", violin_height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("preprocessing/data/website_preparation/violin2/Sweet_Winter Beer.csv").then(function(data) {
    console.log(typeof(data))
  // Build and Show the Y scale
  var y = d3.scaleLinear()
    .domain([0,1])          // Note that here the Y scale is set manually
    .range([violin_height, 0])
  svg.append("g").call( d3.axisLeft(y) )

  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3.scaleBand()
    .range([ 0, violin_width ])
    .domain(["3.0", "3.5", "4.0", "4.5", "5.0"])
    .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  svg.append("g")
    .attr("transform", "translate(0," + violin_height + ")")
    .call(d3.axisBottom(x))

  // Features of the histogram
  var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)

  // Compute the binning for each group of the dataset
  var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.overall_step;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { return g["Sweet"];})    // Keep the variable called Sepal_Length
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(data)
    console.log("sumstat passed")
  // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
  var maxNum = 0
  for ( i in sumstat ){
    allBins = sumstat[i].value
    lengths = allBins.map(function(a){return a.length;})
    longuest = d3.max(lengths)
    if (longuest > maxNum) { maxNum = longuest }
  }

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  var xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum,maxNum])

  // Add the shape to this svg!
  svg
    .selectAll("myViolin2")
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
    .append("path")
        .datum(function(d){ return(d.value)})     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill","#69b3a2")
        .attr("d", d3.area()
            .x0(function(d){ return(xNum(-d.length)) } )
            .x1(function(d){ return(xNum(d.length)) } )
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )
})









// CODE for beer selector

function vio_multi_style_change(style_click){
  console.log("vio_multi_style_change called")
  // if the style is already selected, remove it from the list
  if (selected_styles.includes(style_click)){
      selected_styles = selected_styles.filter(e => e !== style_click);
  }
  else{
      if (selected_styles.length >= 6){
          // if the style is not selected, and there are already 3 styles selected, do nothing
          display_warning("You can only select up to 6 styles");
          return;
      }
      selected_styles.push(style_click);
  }

  // select all .radial_menu li elements inside nav with id = "radial_graph_style_chooser"
  let multi_radial_menu = d3.select("#violin_graph_style_chooser").selectAll("li");
  // set their background to white
  multi_radial_menu.style("background-color", "goldenrod");
  multi_radial_menu.style("z-index", "0");

  let style_div = d3.selectAll("#vio_style_label_container")
  // clear style_div of all elements
  style_div.selectAll("*").remove();

  for (style in selected_styles){
      // create a new div element with class = "multi_style_label" and append it to style_div
      style_div.append("div").attr("class", "multi_style_label").text(selected_styles[style]).style("--i", style);
      
      let btn_id_string = "btn1_" + selected_styles[style].split(" ")[0].toLowerCase();
      let selected_labels = multi_radial_menu.select('a#' + btn_id_string)
          .node()
          .parentNode;
      selected_labels.style.setProperty("background-color", "darkgoldenrod");
      selected_labels.style.setProperty("z-index", "1");
  }
}

document.getElementById("btn1_alcohol_free").addEventListener("click", function() {
  vio_multi_style_change("Alcohol_free");  });

document.getElementById("btn1_ale").addEventListener("click", function() {
  vio_multi_style_change("Ale");  });

document.getElementById("btn1_ambree").addEventListener("click", function() {
  vio_multi_style_change("Ambree");  });

document.getElementById("btn1_belgian").addEventListener("click", function() {
  vio_multi_style_change("Belgian Blonde");  });

document.getElementById("btn1_boozy").addEventListener("click", function() {
  vio_multi_style_change("Boozy");  });

document.getElementById("btn1_ipa").addEventListener("click", function() {
  vio_multi_style_change("IPA");  });

document.getElementById("btn1_lager").addEventListener("click", function() {
  vio_multi_style_change("Lager");  });

document.getElementById("btn1_other").addEventListener("click", function() {
  vio_multi_style_change("Other");  });

document.getElementById("btn1_sour").addEventListener("click", function() {
  vio_multi_style_change("Sour");  });

document.getElementById("btn1_stout").addEventListener("click", function() {
  vio_multi_style_change("Stout");  });

document.getElementById("btn1_wheat").addEventListener("click", function() {
  vio_multi_style_change("Wheat Beer");  });

document.getElementById("btn1_winter").addEventListener("click", function() {
  vio_multi_style_change("Winter Beer");  });