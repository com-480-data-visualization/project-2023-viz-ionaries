
function radial_style_graph(data, { 
    path, 
    children,
    tree = d3.tree, 
    separation = tree === d3.tree ? (a, b) => (a.parent == b.parent ? 1 : 2) / a.depth : (a, b) => a.parent == b.parent ? 1 : 2,
    label,
    width = 640,
    height = 400,
    margin = 80,
    radius = Math.min(width - 2*margin, height - 2*margin) / 2, 
  } = {}) {
    
    const root = path != null ? d3.stratify().path(path)(data)
        : d3.hierarchy(data, children);
  
    // Compute labels and titles.
    const descendants = root.descendants();
    const L = label == null ? null : descendants.map(d => label(d.data, d));
  
    // Compute the layout.
    tree().size([2 * Math.PI, radius]).separation(separation)(root);
  
    const svg = d3.create("svg")
        .attr("viewBox", [-margin - radius, -margin - radius, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15);
  
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", 'goldenrod')
      .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y));
  
    const node = svg.append("g")
      .selectAll("a")
      .data(root.descendants())
      .join("a")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);
  
    node.append("circle")
        .attr("fill", 'darkgoldenrod')
        .attr("r", 3);
  
    if (L) node.append("text")
        .attr("transform", d => `rotate(${d.x >= Math.PI ? 180 : 0})`)
        .attr("dy", "0.32em")
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .attr("paint-order", "stroke")
        .attr("stroke", 'papayawhip')
        .attr("stroke-width", 5)
        .text((d, i) => L[i]);
  
    return svg.node();
  }

  fetch("website/style_radial_table/meta_style_dict.json")
  .then(response => response.json())
  .then(json_data => {
    // Use the 'json_data' variable containing the loaded JSON data here
    console.log(json_data);
    let chart = radial_style_graph(json_data, {
        label: d => d.name,
        tree: d3.cluster,
        width: 1000,
        height: 1000,
        margin: 210
      });

    // add chart to style_radial_table div
    d3.select("#style_radial_table").node().append(chart)
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch or parsing
    console.error(error);
  });

