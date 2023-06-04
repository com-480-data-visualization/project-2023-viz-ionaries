var violin_aroma = "Fruits";
var violin_style = "Sour"
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    violin_width = 700 - margin.left - margin.right,
    violin_height = 600 - margin.top - margin.bottom;



// declare function 
function violin_plot(style, aroma){
  // add the title
  document.getElementById("violin_plot_title").innerHTML = "Violin Plot of " + aroma + " for " + style + " Beers";
    // append the svg object to the body of the page
  var svg = d3.select("#violin_plot")
  .append("svg")
    .attr("width", violin_width + margin.left + margin.right)
    .attr("height", violin_height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

   d3.csv("website/violin/data/"+ aroma + "_" + style+".csv").then(function(data) {
    // Build and Show the Y scale
    var y = d3.scaleLinear()
      .domain([0,0.8]) 
      .range([violin_height, 0])
    svg.append("g").call( d3.axisLeft(y) )

    // Build and Show the X scale. 
    var x = d3.scaleBand()
      .range([ 0, violin_width ])
      .domain(["3.0", "3.5", "4.0", "4.5", "5.0"]) // The grades we will look at
      .padding(0.05)     
    svg.append("g")
      .attr("transform", "translate(0," + violin_height + ")")
      .call(d3.axisBottom(x))

      
    // Features of the histogram
    var histogram = d3.histogram()
          .domain(y.domain())
          .thresholds(y.ticks(20))
          .value(d => d)

    // Compute the binning for each group of the dataset
    var sumstat = d3.nest()  
      .key(function(d) { return d.overall_step;})
      .rollup(function(d) {   
        input = d.map(function(g) { return g[aroma];})    // Select the aroma
        bins = histogram(input)
        return(bins)
      })
      .entries(data)

    var maxNum = 0
    for ( i in sumstat ){
      allBins = sumstat[i].value
      lengths = allBins.map(function(a){return a.length;})
      longuest = d3.max(lengths)
      if (longuest > maxNum) { maxNum = longuest }
    }

    var xNum = d3.scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum,maxNum])

    // Add the shape to this svg
    svg
      .selectAll("myViolin2")
      .data(sumstat)
      .enter()
      .append("g")
        .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } )
      .append("path")
          .datum(function(d){ return(d.value)})
          .style("stroke", "none")
          .style("fill","#80423e")
          .attr("d", d3.area()
              .x0(function(d){ return(xNum(-d.length)) } )
              .x1(function(d){ return(xNum(d.length)) } )
              .y(function(d){ return(y(d.x0)) } )
              .curve(d3.curveCatmullRom)
          )
  })
}




// CODE for beer selector 

function vio_multi_style_change(style_click){

  document.getElementById("vio_style_choice").innerHTML = style_click;
  
}

document.getElementById("btn1_alcohol_free").addEventListener("click", function() {
  vio_multi_style_change("Alcohol_free");  
  // clear the svg container
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Alcohol-free";
  violin_plot("Alcohol-free", violin_aroma);
  });

document.getElementById("btn1_ale").addEventListener("click", function() {
  vio_multi_style_change("Ale");
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Ale";
  violin_plot("Ale", violin_aroma);
});

document.getElementById("btn1_ambree").addEventListener("click", function() {
  vio_multi_style_change("Ambree");  
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Ambree";
  violin_plot("Ambree", violin_aroma);});

document.getElementById("btn1_belgian").addEventListener("click", function() {
  vio_multi_style_change("Belgian Blonde");  
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Belgian Blonde";
  violin_plot("Belgian Blonde", violin_aroma);});

document.getElementById("btn1_boozy").addEventListener("click", function() {
  vio_multi_style_change("Boozy");
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Boozy";
  violin_plot("Boozy", violin_aroma);});

document.getElementById("btn1_ipa").addEventListener("click", function() {
  vio_multi_style_change("IPA");
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "IPA";
  violin_plot("IPA", violin_aroma);});

document.getElementById("btn1_lager").addEventListener("click", function() {
  vio_multi_style_change("Lager");
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Lager";
  violin_plot("Lager", violin_aroma);});

document.getElementById("btn1_other").addEventListener("click", function() {
  vio_multi_style_change("Other");
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Other";
  violin_plot("Other", violin_aroma);});

document.getElementById("btn1_sour").addEventListener("click", function() {
  vio_multi_style_change("Sour");
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Sour";
  violin_plot("Sour", violin_aroma);});

document.getElementById("btn1_stout").addEventListener("click", function() {
  vio_multi_style_change("Stout");
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Stout";
  violin_plot("Stout", violin_aroma);});

document.getElementById("btn1_wheat").addEventListener("click", function() {
  vio_multi_style_change("Wheat Beer");
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Wheat Beer";
  violin_plot("Wheat Beer", violin_aroma);});

document.getElementById("btn1_winter").addEventListener("click", function() {
  vio_multi_style_change("Winter Beer");
  d3.select("#violin_plot").selectAll("*").remove();
  violin_style = "Winter Beer";
  violin_plot("Winter Beer", violin_aroma);});

// Get all the radio buttons
const form = document.getElementById("aroma_selector");

const radioButtons = form.querySelectorAll('input[type="radio"]');


// Attach a click event listener to each radio button
radioButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Check if the button is selected
    if (button.checked) {
      // clear the svg container
      d3.select("#violin_plot").selectAll("*").remove();
      // Get the value of the selected radio button
      let selectedValue = button.value;
      violin_aroma = selectedValue;
      // Call the function with the selected value  
      violin_plot(violin_style, selectedValue)


    }
  });
});

// Mark the selected radio button as checked
document.getElementById("fruits").checked = true;

violin_plot(violin_style, violin_aroma);