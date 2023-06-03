
let chord_width = 1000
let chord_height = chord_width

let beers =  ['Alcohol-free', 'Ale', 'Ambree', 'Belgian Blonde', 'Boozy', 'IPA',   'Lager',     'Sour',    'Stout', 'Wheat Beer', 'Winter Beer'];
let main_aromas = ['Hoppy', ' Hoppy', 'Hoppy',      'Sweet',     'Sweet', 'Hoppy', 'Hoppy',     'Sour',    'Body',    'Fruits',     'Spices'];
let main_colors = ['olive',  'olive', 'olive',       'purple',   'purple', 'olive', 'olive'  ,  'yellow',  'blue',     'red',     'aquamarine']

let innerRadius = Math.min(chord_width, chord_height) * 0.4 - 90
let outerRadius = innerRadius + 6

let three_color_cycler = d3.scaleOrdinal()
    .domain([0, 1])
    .range(["white", "goldenrod"])


let chord = d3.chordDirected()
.padAngle(10 / innerRadius)
.sortSubgroups(d3.descending)
.sortChords(d3.descending)

let arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

let ribbon = d3.ribbon()
    .radius(innerRadius - 1)
    .padAngle(1 / innerRadius)

function rename(name) {
    return name.substring(name.indexOf(".") + 1, name.lastIndexOf("."));
    }


d3.csv("website/chord/aroma_similarity.csv").then(function(data) {

    let names = Array.from(new Set(data.flatMap(d => [d.source, d.target]))).sort(d3.ascending)
    console.log(names);
    const index = new Map(names.map((name, i) => [name, i]));
    const matrix = Array.from(index, () => new Array(names.length).fill(0));
    const colorMap = new Map(); // Map to store colors

    for (const { source, target, value, colour } of data) {
    matrix[index.get(source)][index.get(target)] += value * 100;
    colorMap.set(`${source}-${target}`, colour); // Store color based on source-target pair
    }

    const svg = d3.create("svg")
    .attr("viewBox", [-chord_width / 2, -chord_height / 2, chord_width, chord_height]);

    let chords = chord(matrix)
    console.log("chords");
    console.log(chords);

    const group = svg.append("g")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .selectAll("g")
        .data(chords.groups)
        .join("g");

    chords = chords
        .map(d => {
            const { source, target } = d;
            const color = colorMap.get(`${names[source.index]}-${names[target.index]}`); // Get color based on source-target pair
            return { ...d, color };
        });

// Append path with the attribute fill the color of the colour column of data
    group.append("path")
        .attr("fill", d => main_colors[d.index])
        .attr("stroke", 'black')
        .attr("d", arc);


    group.append("text")
        .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
        .attr("dy", "0.35em")
        .attr("transform", d => `
            rotate(${(d.angle * 180 / Math.PI - 90)})
            translate(${outerRadius + 5})
            ${d.angle > Math.PI ? "rotate(180)" : ""}
        `)
        .attr("font-size", "20")
        .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
        .text(d => names[d.index]);

    group.append("title")
        .text(d => `${names[d.index]}
    ${d3.sum(chords, c => (c.source.index === d.index) * c.source.value)} outgoing →
    ${d3.sum(chords, c => (c.target.index === d.index) * c.source.value)} incoming ←`);

    svg.append("g")
        .attr("fill-opacity", 0.75)
        .selectAll("path")
        .data(chords)        
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("fill", d => d.color)
        .attr("d", ribbon)
        .append("title")
        .text(d => `${names[d.source.index]} → ${names[d.target.index]} ${d.source.value}`);

    // add the svg to the .chord div
    d3.select(".chord_diagram").node().append(svg.node());
});


//.attr("fill", d => color_cycler(d.index))




