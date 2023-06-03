
let selected_styles = [];

// create a radial button callback for the radial buttons changing the legend size
function mapRadialButtonCallback() {
    var size = this.value;
    // call the map_main(3) function of file heatmap.js to update the map
    map_main(size);
}

// Link the radial button callback to the radial buttons
d3.selectAll("input[name='legend_size']").on("change", mapRadialButtonCallback);

function setup_radial_graph(){
    //select the .lines class
    let radial_lines = d3.selectAll(".radial_lines");

    // loop 52 times to create 52 radial lines with the --i parameter
    for (var i = 0; i < 52; i++) {
        // create a .radial_line class object with style = "--i: i;" and append it to the radial_lines object
        radial_lines.append("div").attr("class", "radial_line").style("--i", i);
    }
    // Create a white circle in the middle of the radial lines
    radial_lines.append("div").attr("class", "white_circle");
}



function update_radial_graph(){
    // TODO MORALES: update the radial graph with the "selected_styles" list
}

async function display_warning(text){
    // select the .warning_label class
    let warning = d3.selectAll(".warning_label");
    // set the text of the warning to the text parameter
    warning.text(text);
    // set the opacity of the warning to 1
    warning.style("opacity", "1");
    // wait 2 seconds
    await new Promise(r => setTimeout(r, 1000));
    // set the opacity of the warning to 0
    warning.style("opacity", "0");
}

function rad_multi_style_change(style_click){
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
    update_radial_graph();

    // select all .radial_menu li elements inside nav with id = "radial_graph_style_chooser"
    let multi_radial_menu = d3.select("#radial_graph_style_chooser").selectAll("li");
    // set their background to white
    multi_radial_menu.style("background-color", "goldenrod");
    multi_radial_menu.style("z-index", "0");

    let style_div = d3.selectAll("#style_label_container")
    // clear style_div of all elements
    style_div.selectAll("*").remove();

    for (style in selected_styles){
        // create a new div element with class = "multi_style_label" and append it to style_div
        style_div.append("div").attr("class", "multi_style_label").text(selected_styles[style]).style("--i", style);
        
        let btn_id_string = "btn5_" + selected_styles[style].split(" ")[0].toLowerCase();
        let selected_labels = multi_radial_menu.select('a#' + btn_id_string)
            .node()
            .parentNode;
        selected_labels.style.setProperty("background-color", "darkgoldenrod");
        selected_labels.style.setProperty("z-index", "1");
    }
}

document.getElementById("btn5_alcohol_free").addEventListener("click", function() {
    rad_multi_style_change("Alcohol_free");  });

  document.getElementById("btn5_ale").addEventListener("click", function() {
    rad_multi_style_change("Ale");  });

  document.getElementById("btn5_ambree").addEventListener("click", function() {
    rad_multi_style_change("Ambree");  });

  document.getElementById("btn5_belgian").addEventListener("click", function() {
    rad_multi_style_change("Belgian Blonde");  });

  document.getElementById("btn5_boozy").addEventListener("click", function() {
    rad_multi_style_change("Boozy");  });

  document.getElementById("btn5_ipa").addEventListener("click", function() {
    rad_multi_style_change("IPA");  });

  document.getElementById("btn5_lager").addEventListener("click", function() {
    rad_multi_style_change("Lager");  });

  document.getElementById("btn5_other").addEventListener("click", function() {
    rad_multi_style_change("Other");  });

  document.getElementById("btn5_sour").addEventListener("click", function() {
    rad_multi_style_change("Sour");  });

  document.getElementById("btn5_stout").addEventListener("click", function() {
    rad_multi_style_change("Stout");  });

  document.getElementById("btn5_wheat").addEventListener("click", function() {
    rad_multi_style_change("Wheat Beer");  });

  document.getElementById("btn5_winter").addEventListener("click", function() {
    rad_multi_style_change("Winter Beer");  });


setup_radial_graph();