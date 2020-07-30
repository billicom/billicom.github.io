 //var svg = d3.select('body').append('svg')

function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 260,
      legendHeight = 185;

  // clipping to make sure nothing appears behind legend
/*
  svg.append('clipPath')
    .attr('id', 'axes-clip')
    .append('polygon')
      .attr('points', (-margin.left)                 + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + (chartHeight + margin.bottom) + ' ' +
                      (-margin.left)                 + ',' + (chartHeight + margin.bottom));
*/
  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis);

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Customers');

  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + 30 + ', 0)');

  legend.append('rect')
    .attr('class', 'legend-bg')
    .attr('width',  legendWidth)
    .attr('height', legendHeight);

  legend.append('rect')
    .attr('class', 'area below')
    .attr('width',  75)
    .attr('height', 20)
    .attr('x', 10)
    .attr('y', 10);

  legend.append('text')
    .attr('x', 95)
    .attr('y', 25)
    .text('Joins (1000)');

  legend.append('rect')
    .attr('class', 'area above')
    .attr('width',  75)
    .attr('height', 20)
    .attr('x', 10)
    .attr('y', 40);

  legend.append('text')
    .attr('x', 95)
    .attr('y', 55)
    .text('Leavers (1000)');

  legend.append('path')
    .attr('class', 'net-line')
    .attr('d', 'M10,80L85,80')
    .attr('stroke', 'green');

  legend.append('text')
    .attr('x', 95)
    .attr('y', 85)
    .text('Customer Net');

  legend.append('path')
    .attr('class', 'customer-line')
    .attr('d', 'M10,110L85,110')
    .attr('stroke', 'green');

  legend.append('text')
    .attr('x', 95)
    .attr('y', 115)
    .text('Customer Total (10000)');

  legend.append('path')
    .attr('class', 'churn-line')
    .attr('d', 'M10,140L85,140')
    .attr('stroke', 'green');

  legend.append('text')
    .attr('x', 95)
    .attr('y', 145)
    .text('Churn (/100%)');

  legend.append('path')
    .attr('class', 'acquisition-line')
    .attr('d', 'M10,170L85,170')
    .attr('stroke', 'blue');

  legend.append('text')
    .attr('x', 95)
    .attr('y', 175)
    .text('Acquisition (/100%)');
}

function drawLines (svg, data, x, y) {


  var joinsLine = d3.svg.line()
    .interpolate('basis')
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.joins); });

  var leaversLine = d3.svg.line()
    .interpolate('basis')
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.leavers); });


  var actCustLine = d3.svg.line()
    .interpolate('monotone')
    .x (function (d) { return x(d.date); })
    .y(function (d) { return y(d.activecustomers); });

  var netLine = d3.svg.line()
    .interpolate('monotone')
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.netperiod); });

  var churnLine = d3.svg.line()
    .interpolate('monotone')
    .x (function (d) { return x(d.date) || 1; })
    .y(function (d) { return y(d.churn); });

  var acquisLine = d3.svg.line()
    .interpolate('monotone')
    .x (function (d) { return x(d.date) || 1; })
    .y(function (d) { return y(d.acquis); });

  svg.datum(data);


	  svg.append("path")
  	  .attr('id', 'joins' )
	      .attr("class", "joins-line")
    	  .attr('clip-path', 'url(#rect-clip)')
	      .attr("d", joinsLine)
	      ;

	svg.append("path")
	  	.attr('id', 'leavers' )
		.attr("class", "leavers-line")
		.attr('clip-path', 'url(#rect-clip)')
	    .attr("d", leaversLine)
	    ;

	svg.append('path')
	  	.attr('id', 'activecustomers' )
    .attr('class', 'customer-line')
    .attr('d', actCustLine)
    .attr('clip-path', 'url(#rect-clip)')
    ;


  svg.append('path')
  	.attr('id', 'churn' )
    .attr('class', 'churn-line')
    .attr('d', churnLine)
    .attr('clip-path', 'url(#rect-clip)')
    ;

  svg.append('path')
  	.attr('id', 'acquis' )
    .attr('class', 'acquisition-line')
    .attr('d', acquisLine)
    .attr('clip-path', 'url(#rect-clip)')
    ;

  svg.append('path')
    	.attr('id', 'netperiod' )
    .attr('class', 'net-line')
    .attr('d', netLine)
    .attr('clip-path', 'url(#rect-clip)')
    ;

svg.append("rect")
	.attr("class", "overlay")
	.attr("width", 900)
	.attr("height", 600)
	.on("mouseover", function() { for (i = 0; i < focusValues.length; i++) {focus[i].style("display", null); }})
	.on("mouseout", function() { for (i = 0; i < focusValues.length; i++) {focus[i].style("display", "none");} })
	.on("mousemove", mousemove);


	var focusValues = ['-150', 'd.churn', 'd.acquis', 'd.activecustomers', 'd.netperiod'];
	var focusDisplayValues = ['(1 + (d.date).getMonth()).toString() + \'/\' + (d.date).getFullYear()','d.churn/100','d.acquis/100', 'd.activecustomers*10000', 'd.netperiod*1000'];
	focus = new Array(focusValues.length);
	for (i = 0; i < focusValues.length; i++) {
		focus[i]=svg.append("g").attr("class", "focus").style("display", "none");
		focus[i].append("circle").attr("r", 4.5).attr('id', 'circle');
		focus[i].append("text").attr("x", 9).attr("dy", ".35em").attr('id', 'text')
		;
	}
	focus[0].append('line').attr('id', 'focusLineX').attr('class', 'focusLine');

	function mousemove() {
		//console.log(ld[li]);
		var bisectDate = d3.time.format('%Y-%m').parse,
		bisectDate = d3.bisector(function(d) { return d.date; }).left
		;

		var x0 = x.invert(d3.mouse(this)[0]),
		i = bisectDate(data, x0, 1),
		d0 = data[i - 1],
		d1 = data[i],
		d = x0 - d0.date > d1.date - x0 ? d1 : d0;

		for (i = 0; i < focusValues.length; i++) {
			focus[i].select("circle").attr('cx', x(d.date)).attr('cy', y(eval(focusValues[i])));
			focus[i].select("text").text(eval(focusDisplayValues[i])).attr('x', x(d.date)-15).attr('y', y(eval(focusValues[i]))-15);
		}
		//console.log(x(d.date));
		focus[0].select('line').attr('x1', x(d.date)).attr('y1', 0).attr('x2', x(d.date)).attr('y2', 550);
	}
}

function drawAreas (svg, data, x, y) {

  var joinsArea = d3.svg.area()
    .interpolate('basis')
    .x(function(d) { return x(d.date); })
    .y1(function(d) { return y(d.joins); });

  var diffArea = d3.svg.area()
    .interpolate('basis')
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.leavers); })
    .y1(function(d) { return y(d.joins); });


  svg.datum(data);

    svg.append("clipPath")
        .attr("id", "clip-above")
        .append("path")
        .attr("d", joinsArea.y0(0));

    svg.append("clipPath")
        .attr("id", "clip-below")
        .append("path")
        .attr("d", joinsArea.y0(405));

    svg.append("path")
        .attr("class", "area above")
        .attr("clip-path", "url(#clip-above)")
        .attr("d", joinsArea.y0(function(d) { return y(d.leavers); }));

    svg.append("path")
        .attr("class", 'area below')
        .attr("clip-path", "url(#clip-below)")
        .attr("d", joinsArea);

}



function addMarker (marker, svg, chartHeight, x) {
  var radius = 32,
      xPos = x(marker.date) - radius,
      yPosStart = chartHeight - radius,
      yPosEnd = (marker.type === 'Price' ? 40 : -20) + 1/5*radius ;

  var markerG = svg.append('g')
    .attr('class', 'marker '+marker.type.toLowerCase())
    .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
    .attr('opacity', 0);

  markerG.transition()
    .duration(5000)
    .attr('transform', 'translate(' + xPos + ', ' + yPosEnd + ')')
    .attr('opacity', 1);

  markerG.append('path')
    .attr('d', 'M' + radius + ',' + (chartHeight-yPosStart) + 'L' + radius + ',' + (chartHeight-yPosStart))
    .transition()
      .duration(1000)
      .attr('d', 'M' + radius + ',' + (chartHeight-yPosEnd) + 'L' + radius + ',' + (radius*2));

  markerG.append('circle')
    .attr('class', 'marker-bg')
    .attr('cx', radius)
    .attr('cy', radius)
    .attr('r', radius);

  markerG.append('text')
    .attr('x', radius)
    .attr('y', radius*0.9)
    .text(marker.type);

  markerG.append('text')
    .attr('x', radius)
    .attr('y', radius*1.5)
    .text(marker.version);
}

function startTransitions (svg, chartWidth, chartHeight, rectClip, markers, x) {
  rectClip.transition()
    .duration(150*markers.length)
    .attr('width', chartWidth);


  markers.forEach(function (marker, i) {
    setTimeout(function () {
      addMarker(marker, svg, chartHeight, x);
    }, 100 + 50*i);
  });

}

function makeChart (data, markers) {
  var svgWidth  = 960,
      svgHeight = 600,
      margin = { top: 20, right: 60, bottom: 40, left: 40 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.time.scale().range([0, chartWidth])
            .domain(d3.extent(data, function (d) { return d.date; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([-150, 450]); //d3.max(data, function (d) { return d.activecustomers; })]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

	d3.select("svg").remove();
	svg = d3.select('body').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
  drawLines(svg, data, x, y);
  startTransitions(svg, chartWidth, chartHeight, rectClip, markers, x);

  setTimeout(function () {drawAreas(svg, data, x, y);
    }, 900);

  setTimeout(function () {drawLines(svg, data, x, y);
    }, 910);
}

function drawChart(fP, tP){
var parseDate  = d3.time.format('%Y-%m').parse;
d3.json('fictional_customer_trend_data.json' + '?nocache=' + (new Date()).getTime(), function (error, rawData) {
  if (error) {
    console.error(error);
    return;
  }

var  data = rawData
  	.filter(function (d) {if (d.PERIOD >= fP && d.PERIOD <= tP) {return d}})
  	.map(function (d) {
    return {
      date: parseDate(d.PERIOD),
      churn: d.CHURN * 100,
      acquis: d.ACQUIS * 100,
      leavers: d.LEAVERS / 1000,
      netperiod: d.NET_PERIOD / 1000,
      joins: d.JOINS / 1000,
      activecustomers: d.LIVE_CUSTOMERS / 10000
	};
  });

 // console.log(data);

  d3.json('fictional_customer_trend_markers.json' + '?nocache=' + (new Date()).getTime(), function (error, markerData) {
    if (error) {
      console.error(error);
      return;
    }

    var markers = markerData.map(function (marker) {
      return {
        date: parseDate(marker.date),
        type: marker.type,
        version: marker.version
      };
    });
 // console.log(markers);

    makeChart(data, markers);
  });

});

};

drawChart('0000-00', '9999-99');