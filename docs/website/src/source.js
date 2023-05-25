
// create a radial button callback for the radial buttons changing the legend size
function mapRadialButtonCallback() {
    var size = this.value;
    console.log("radialButtonCallback: size = " + size);
    // call the map_main(3) function of file heatmap.js to update the map
    map_main(size);
}

// Link the radial button callback to the radial buttons
d3.selectAll("input[name='legend_size']").on("change", mapRadialButtonCallback);
