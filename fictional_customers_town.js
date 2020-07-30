function updateGraph() {

    var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5};
    var props = {
	    width: 1000 - margin.right,
	    height: 500 - margin.top - margin.bottom,
	    marginTop: margin.top,
	    marginBottom: margin.bottom,
	    marginRight: margin.right,
	    marginLeft: margin.left
    }

    var marginLeft = props.marginLeft;
    var marginRight = props.marginRight;
    var marginTop = props.marginTop;
    var marginBottom = props.marginBottom;

    var periods = new Array(" ","2011-01","2011-02","2011-03","2011-04","2011-05","2011-06","2011-07","2011-08","2011-09","2011-10","2011-11","2011-12","2012-01","2012-02","2012-03","2012-04","2012-05","2012-06","2012-07","2012-08","2012-09","2012-10","2012-11","2012-12","2013-01","2013-02","2013-03","2013-04","2013-05","2013-06","2013-07","2013-08","2013-09","2013-10","2013-11","2013-12","2014-01","2014-02","2014-03","2014-04","2014-05","2014-06","2014-07","2014-08","2014-09","2014-10","2014-11","2014-12","2015-01","2015-02","2015-03","2015-04","2015-05","2015-06","2015-07","2015-08","2015-09","2015-10","2015-11","2015-12","2016-01","2016-02","2016-03","2016-04","2016-05","2016-06","2016-07","2016-08","2016-09","2016-10","2016-11","2016-12","2017-01","2017-02","2017-03","2017-04","2017-05","2017-06","2017-07","2017-08","2017-09","2017-10","2017-11","2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06","2018-07","2018-08","2018-09","2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12")

    var iterFrom = 1
    var iterTo = 107

    //create the SVG container and set the origin"
    var svg = d3.select("#chart1")
		.append("svg")
		.attr("width", props.width + marginLeft + marginRight)
		.attr("height", props.height + marginTop + marginBottom + 130);

    // Various accessors that specify the four dimensions of data to visualize.
    //function x(d) { return d.count; }
	//function y(d) { return d.inv_avg; }
    //function radius(d) { return d.life_amt; }
    //function x(d) { return d.life_amt; }
    function x(d) { return d.period_amt; }
    function y(d) { return d.inv_avg; }
    function radius(d) { return d.count; }
    function color(d) { return d.region; }
    function key(d) { return d.post_town; }

    // Chart dimensions are specified in getDefaultProps
    // and called in componentDidMount

    var height = props.height;
    var width = props.width;
    var margin = {top: props.marginTop,
		  right: props.marginRight,
		  bottom: props.marginBottom,
		  left: props.marginLeft};

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.log().domain([100000, 17000000]).range([0, width]), // for period_amt
    //var xScale = d3.scaleLog().domain([100000, 17000000]).range([0, width]),
    //var xScale = d3.scale.log().domain([10000000, 1200000000]).range([0, width]), // for life_amt
    //var xScale = d3.scale.log().domain([1500, 2800]).range([0, width]), // for life_avg
	yScale = d3.scale.linear().domain([28, 35]).range([height, 0]),
	//yScale = d3.scaleLinear().domain([28, 35]).range([height, 0]),
	//radiusScale = d3.scale.sqrt().domain([10, 325000]).range([1, 120]),
	//radiusScale = d3.scale.linear().domain([10, 325000]).range([1, 120]),
	radiusScale = d3.select("#mySqr").property("checked")? d3.scale.sqrt().domain([10, 325000]).range([1, 120]) : d3.scale.linear().domain([10, 325000]).range([1, 120]),
	//radiusScale = d3.select("#mySqr").property("checked")? d3.scale.sqrt().domain([10, 325000]).range([1, 120]) : d3.scaleLinear().domain([10, 325000]).range([1, 120]),
	colorScale = d3.scale.category20();
	//colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(10, d3.format(".2s"));
    //var xAxis = d3.axisBottom(xScale).ticks(10, d3.format(".2s"));
    var yAxis = d3.svg.axis().scale(yScale).orient("left");
    //var yAxis = d3.axisLeft(yScale);

    var svg = d3.select("svg")
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the x-axis.
    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

    // Add the y-axis.
    svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

    // Add an x-axis label.
    svg.append("text")
	.attr("class", "x label")
	.attr("text-anchor", "end")
	.attr("x", width)
	.attr("y", height - 6)
	.text("Period Revenue");

    // Add a y-axis label.
    svg.append("text")
	.attr("class", "y label")
	.attr("text-anchor", "end")
	.attr("y", 6)
	.attr("dy", ".75em")
	.attr("transform", "rotate(-90)")
	.text("Average Invoice");


    // Add the year label; the value is set on transition.
    var label = svg.append("text")
	    .attr("class", "year label")
	    .attr("text-anchor", "end")
	    .attr("y", height + 130)
	    .attr("x", width)
	    .text(periods[iterFrom]);

    // Load the data.
    d3.json("fictional_customer_town.json", function(nations) {

	// A bisector since many nation's data is sparsely-defined.
	var bisect = d3.bisector(function(d) {
	    // d here is an array of two values, the first value is the year, the second
	    // is the relevant data (in this case either income, population or life expectancy)
	    //console.log("d");
	    //console.log(d);
	    //here we return the year (so we compare with the year to find the index)
	    return d[0];
	});

	function interpolateValues(values, year) {

		//locate the insertion point for 'year' in 'values' array to maintain sorted order
	    //the final two arguments '0' and 'values.length -1' are used to specify a subset of
	    //the array which should be considered. bisect.left returns the insertion point (index)

	    var i = bisect.left(values, year, 0, values.length - 1),
		a = values[i];
		//console.log("a = " + a);
		//return a[1]
		//return values[year][1]
		//console.log("a = " + a);
	    //if (i > 0 && !a[0] === null && !a[1] === null) {
	    if (i > 0) {
		//https://en.wikipedia.org/wiki/Linear_interpolation
		var b = values[i - 1],
		    t = (year - a[0]) / (b[0] - a[0]);
		    //console.log("b = " + b);
		return a[1] * (1 - t) + b[1] * t;
	    }
	    return a[1];
	}

	function returnValues(values, year) {

	    var i = bisect.left(values, year, 0, values.length - 1),
		a = values[i];
		return a[1]
	}


	// Interpolates the dataset for the given (fractional) year.
	function interpolateData(year) {
	    return nations.map(function(d) {

//		    console.log("d.income");
//		    console.log(d.income);

		return {
		    post_town: d.post_town,
		    region: d.region,
		    period: returnValues(d.period, year),
		    count: returnValues(d.count, year),
		    life_amt: returnValues(d.life_amt, year),
		    life_avg: returnValues(d.life_avg, year),
		    inv_avg: interpolateValues(d.inv_avg, year),
		    len_avg: returnValues(d.len_avg, year),
			period_amt: interpolateValues(d.period_amt, year),
			period_avg: returnValues(d.period_avg, year)
		};
	    });
	}

	// Positions the dots based on data.
	function position(dot) {
	    dot.attr("cx", function(d) { return xScale(x(d)); })
		.attr("cy", function(d) { return yScale(y(d)); })
		.attr("r", function(d) { return radiusScale(radius(d)); });
	}

	function positionVoronoi(dot) {

	}
	// Defines a sort order so that the smallest dots are drawn on top.
	function order(a, b) {
	    return radius(b) - radius(a);
	}

	// Add a dot per town.
	var dot = svg.append("g")
	    .attr("class", "dot")
	    .selectAll(".dot")
	    .data(interpolateData(1))
	    .enter().append("circle")
	    .attr("class", "dot")
	    .attr("id", function(d) { return (d.post_town)
				      .replace(/\s/g, '').replace(/\./g,'').replace(/\,/g,'')
				      .replace(/\'/g,''); })
	    .style("fill", function(d) { return colorScale(color(d)); })
	    .call(position)
	    .sort(order);


	//Initiate the voronoi function
	//Use the same variables of the data in the .x and .y as used in the cx and cy
	//of the dot call

	var voronoi = d3.geom.voronoi()
		.x(function(d) { return xScale(x(d)); })
		.y(function(d) { return yScale(y(d)); })
		.clipExtent([[0, 0], [width, height]]);

	var voronoiTiling =  svg.selectAll("path")
	    .data(voronoi(interpolateData(iterFrom))) //Use voronoi() with your dataset inside
	    .enter().append("path")
	    .attr("d", function(d, i) {return d.join("L")? "M" + d.join("L") + "Z":"M 1,1 Z"; })
	    .datum(function(d, i) { return d.point; })
	//give each cell a unique id where the unique part corresponds to the dot ids
	//id is country name modulo spaces commas and fullstops
	    .attr("id", function(d,i) { return "voronoi" + d.post_town.replace(/\s/g, '')
					.replace(/\./g,'')
					.replace(/\,/g,'')
					.replace(/\'/g,''); })
	    .style("stroke", "rgb(0,128,128)")
	    //.style("visibility", d3.select("input").property("checked") ? "hidden" : "visible" )
	    .style("visibility", d3.select("#myVor").property("checked") ? "hidden" : "visible" )
	    .style("fill", "none")
	    .style("opacity", 0.5)
	    .style("pointer-events", "all")
	    .on("mouseover", showTooltip)
	    .on("mouseout", removeTooltip);
	    //"AAAAAAAAAAAAAAAAAAAA");
		//console.log(d3.select("#mySqr").property("checked"));
	// Add a title.
	dot.append("title")
	    .text(function(d) { return d.post_town; });

	// Add an overlay for the year label.
	var box = label.node().getBBox();

	var overlay = svg.append("rect")
		.attr("class", "overlay")
		.attr("x", box.x)
		.attr("y", box.y)
		.attr("width", box.width)
		.attr("height", box.height)
		.on("mouseover", enableInteraction);

	// Start a transition that interpolates the data based on year.
	svg.transition()
	    .duration(30000)
	    .ease("linear")
	    .tween("year", tweenYear) // remove semicolon if you uncomment below!!!
	    .each("end", enableInteraction);

	// After the transition finishes, you can mouseover to change the year.
	//p
	// Tweens the entire chart by first tweening the year, and then the data.
	// For the interpolated data, the dots and label are redrawn.

	function showTooltip(d, i) {

	    d3.select("#countryname1").remove();
	    d3.select("#countryname2").remove();
	    d3.select("#countryname3").remove();

	    d3.selectAll(".dot").style("opacity", 0.2);
	    var circle = d3.select("#" + d.post_town.replace(/\s/g, '')
				   .replace(/\./g,'')
				   .replace(/\,/g,'')
				   .replace(/\'/g,''));

	    circle.style("opacity", 1);

		formatDecimalComma = d3.format(",.2f");
		formatComma = d3.format(",");

	    svg.append("text")
		.attr("id", "countryname1")
		.attr("y", height - 60)
		.attr("x", 10)
		.text(d.post_town + ': ' + d.period)
		.style("font-family", "Helvetica Neue")
		.style("font-size", 14)
		.style("fill", colorScale(color(d)));

	    svg.append("text")
		.attr("id", "countryname2")
		.attr("y", height - 40)
		.attr("x", 10)
		.text('Active Customers: ' + formatComma(d.count) + ', Average Lifetime: ' + (d.len_avg)  +  ' months, Average Lifetime Revenue: ' + formatDecimalComma(d.life_avg) + ', Average Invoice: ' + formatDecimalComma(d.inv_avg))
		.style("font-family", "Helvetica Neue")
		.style("font-size", 14)
		.style("fill", colorScale(color(d)));

	    svg.append("text")
		.attr("id", "countryname3")
		.attr("y", height - 20)
		.attr("x", 10)
		.text('Period Revenue: ' + formatDecimalComma(d.period_amt) + ', Average Invoice for Period: ' + formatDecimalComma(d.period_avg))
		.style("font-family", "Helvetica Neue")
		.style("font-size", 14)
		.style("fill", colorScale(color(d)));

	}

	function removeTooltip(d, i) {
	    d3.selectAll(".dot").style("opacity", 1);
	    d3.select("#countryname1").remove();
	    d3.select("#countryname2").remove();
	    d3.select("#countryname3").remove();
	}

	function tweenYear() {
	    var year = d3.interpolateNumber(iterFrom, iterTo);
	    return function(t) { displayYear(year(t)); };
	}

	// Updates the display to show the specified year.
	function displayYear(year) {
	    // we use a key function to reduce the number of DOM modifications:
	    // it allows us to reorder DOM elements in the update selection rather than
	    // regenerating them
	    //for more information see Mike Bostock's post on Object Constancy
	    //https://bost.ocks.org/mike/constancy/
	    //or the answer to this stackoverflow question:
	    //http://stackoverflow.com/questions/24175624/d3-key-function

	    dot.data(interpolateData(year), key).call(position).sort(order);
	    label.text(periods[Math.round(year)]);


	    //redraw voronoi
	    d3.selectAll("path").remove();
	    //		voronoiTiling.data(voronoi(interpolateData(year)));
	    svg.selectAll("path")
		.data(voronoi(interpolateData(year))) //Use voronoi() with your dataset inside
		.enter().append("path")
		.attr("d", function(d, i) {return d.join("L")? "M" + d.join("L") + "Z":"M 1,1 Z"; })
		.datum(function(d, i) { return d.point; })
	    //give each cell a unique id where the unique part corresponds to the dot ids
		.attr("id", function(d,i) { return "voronoi" + d.post_town.replace(/\s/g, '').replace(/\./g,'').replace(/\,/g,''); })
		.style("stroke", "rgb(0,128,128)")
		//.style("visibility", d3.select("input").property("checked") ? "hidden" : "visible" )
		.style("visibility", d3.select("#myVor").property("checked") ? "hidden" : "visible" )
		.style("fill", "none")
		.style("opacity", 0.5)
		.style("pointer-events", "all")
		.on("mouseover", showTooltip)
		.on("mouseout", removeTooltip);
	}

	// After the transition finishes, you can mouseover to change the year.
	function enableInteraction() {
	    var yearScale = d3.scale.linear()
		    .domain([iterFrom, iterTo])
		    .range([box.x + 10, box.x + box.width - 10])
		    .clamp(true);

	    // Cancel the current transition, if any.
	    svg.transition().duration(0);

	    overlay
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)
		.on("mousemove", mousemove)
		.on("touchmove", mousemove);

	    function mouseover() {
		label.classed("active", true);
	    }

	    function mouseout() {
		label.classed("active", false);
	    }

	    function mousemove() {
		displayYear(yearScale.invert(d3.mouse(this)[0]));
	    }
	}


	//d3.select("input").on("change", change);
	d3.select("#myVor").on("change", changeVor);
	d3.select("#mySqr").on("change", changeRad);


	function changeVor() {
	    this.checked ? svg.selectAll("path").style("visibility", "hidden")
		: svg.selectAll("path").style("visibility", "visible");
	}

	function changeRad() {
		radiusScale = d3.select("#mySqr").property("checked")? d3.scale.sqrt().domain([10, 325000]).range([1, 120]) : d3.scale.linear().domain([10, 325000]).range([1, 120]);
		//radiusScale = d3.select("#mySqr").property("checked")? d3.scale.sqrt().domain([10, 325000]).range([1, 120]) : d3.scaleLinear().domain([10, 325000]).range([1, 120]);
	}

	var div = d3.select("main").append("div")
	    .attr("id", "introtext")
	    .attr("class", "explan-text")
	    //.style("display", "inline")
	    //.style("color", "black")
	    //.style("left", 20 + "px")
	    //.style("top", 510 + "px")
	    //.style("font-family", "Helvetica Neue")
	    //.style("font-size", "15px")

	;

	var div1 = div.append("p").text("Fictional Telco\'s Customers\' story, based on ");

	var span1 = div1.append('span').text("Gapminder's Tools");

	var span2 = div1.append('span').text(", made famous by Hans Rosling's memorable ");

	var link3 = div1.append('a').text("2006 TED talk")
		.attr("href", "http://www.ted.com/talks/hans_rosling_shows_the_best_stats_you_ve_ever_seen")
		.style("color", 'steelblue')
		.style("text-decoration", 'none');
	var span21 = div1.append('span').text(".");

	var span3 = div1.append('p').text("It shows the possible dynamic fluctuation in period revenue (x), average invoice (y), ccustomer volume (radius), average lifetime, average lifetime revenue and average invoice for the period of UK postal towns over the last 9 years. Towns are colored randomly; mouseover to read their names and revnue data.");

	var span5 = div1.append("p").text(" Mouseover the year label on the right to move forward and backwards through time.").style("color", "grey");

    });
}

