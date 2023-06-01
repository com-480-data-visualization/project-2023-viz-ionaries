
let regression_chache = new Map();

regression_chache.set("current_style", "Lager");

function update_regression_graph() {

    let current_style = regression_chache.get("current_style");
    let regression_coeffs = regression_chache.get(current_style);

    // clear the .positive_regression and .negative_regression divs
    d3.selectAll(".positive_regression").selectAll("*").remove();
    d3.selectAll(".negative_regression").selectAll("*").remove();

    // Iterate over the regression_coeffs map
    let i = 0;
    regression_coeffs.forEach(function(value, key) {

        if (value > 0) {
            // Add a rectagle that goes from 0 to value, 0 being the left side of the .positive_regression div
            let pos = d3.select(".positive_regression").append("div").attr("class", "regression_bar");
            pos.style("--w", 100*value/0.08);
            pos.style("--i", i);
            
            // Add and empty div to the .negative_regression div, change --w and --i
            let neg = d3.select(".negative_regression").append("div").attr("class", "regression_bar");
            neg.style("--w", 0);
            neg.style("--i", i);
            neg.style("--n", 1);

        }
        else {
            let pos = d3.select(".positive_regression").append("div").attr("class", "regression_bar");
            pos.style("--w", 0);
            pos.style("--i", i);
        
            // Add and empty div to the .negative_regression div, change --w and --i
            let neg = d3.select(".negative_regression").append("div").attr("class", "regression_bar");
            neg.style("--w", -100*value/0.08);
            neg.style("--i", i);
            neg.style("--n", 1);
        };
        i++;

    });
};

async function load_csv_files() {
    // load the regression_coeffs_all.csv file

    let temp_dict = new Map();
    let keys = ["Alcohol-free", "Ale", "Ambree", "Belgian Blonde", "Boozy", "IPA", "Lager", "Other", "Sour", "Stout", "Wheat Beer", "Winter Beer"];


    for (style of keys) {
        let temp_dict = new Map();

        await d3.csv("website/regression/regression_coeffs_" + style + ".csv").then(function(data) {
            data.forEach(function(d) {
                temp_dict.set(d.beer_style, d.coeff);
            });

            regression_chache.set(style, temp_dict);
        });

    }

}

Promise.all([load_csv_files()]).then(() => {
    update_regression_graph();
  }); 

// create the function called
function style_change(new_style) {
    document.getElementById("regression_style_choice").innerHTML = new_style;

    regression_chache.set("current_style", new_style);
    update_regression_graph()
};


document.getElementById("btn1_alcohol_free").addEventListener("click", function() {
    style_change("Alcohol-free");  });

document.getElementById("btn1_ale").addEventListener("click", function() {
    style_change("Ale" );  });

document.getElementById("btn1_Ambree").addEventListener("click", function() {
    style_change("Ambree" );  });

document.getElementById("btn1_belgian").addEventListener("click", function() {
    style_change("Belgian Blonde" );  });

document.getElementById("btn1_boozy").addEventListener("click", function() {
    style_change("Boozy" );  });

document.getElementById("btn1_ipa").addEventListener("click", function() {
    style_change("IPA" );  });

document.getElementById("btn1_lager").addEventListener("click", function() {
    style_change("Lager" );  });

document.getElementById("btn1_other").addEventListener("click", function() {
    style_change("Other" );  });

document.getElementById("btn1_sour").addEventListener("click", function() {
    style_change("Sour" );  });

document.getElementById("btn1_stout").addEventListener("click", function() {
    style_change("Stout" );  });

document.getElementById("btn1_wheat").addEventListener("click", function() {
    style_change("Wheat Beer" );  });

document.getElementById("btn1_winter").addEventListener("click", function() {
    style_change("Winter Beer" );  });

load_csv_files();