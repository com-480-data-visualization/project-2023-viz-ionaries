// using d3 for convenience
var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var stepH = Math.floor(window.innerHeight * 2);
	step.style("height", stepH + "px");

	var figureHeight = window.innerHeight / 1.05;
	var figureMarginTop = (window.innerHeight - figureHeight) / 2;

	figure
		.style("height", figureHeight + "px")
		.style("top", figureMarginTop + "px");

	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
	// response = { element, direction, index }

	// add color to current step only
	step.classed("is-active", function (d, i) {
		return i === response.index;
	});

	// update graphic based on step
	show_div(figure, 'hidden_div_'+ response.index);
}

function init() {

	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();

	// 2. setup the scroller passing options
	// 		this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
			step: "#scrolly article .step",
			offset: 0.33,
			debug: false
		})
		.onStepEnter(handleStepEnter);
}

// Create a function to load one of the external html files depending on the input number
function show_div(figure, divId) {

	// find the ones that are shown
	var shownDivs = figure.selectAll('.show');
	// and hide them with a transition
	shownDivs.classed('show', false);

	var div = document.getElementById(divId);
	div.classList.add('show');
}
// kick things off
init();