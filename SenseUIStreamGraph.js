/**
 * @ngdoc function
 * @name SenseUI Stream Graph
 * @author Yianni Ververis
 * @email yianni.ververis@qlik.com
 * @description
 * SenseUI Stream Graph
 * http://bl.ocks.org/WillTurman/4631136
 */

define( [
	"qlik",
	"jquery",
	// "underscore",
	// "./d3", 
	'./d3-tip',
	"css!./SenseUIStreamGraph.css",
], function ( qlik, $ ) {
	"use strict";
	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 3,
					qHeight: 900
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 2,
					max: 2
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings : {
					uses : "settings",
					items: {
						Chart: {
							type: "items",
							label: "SenseUI-StreamGraph",
							items: {
							}
						}
					}
				}
			}
		},

		support : {
			snapshot: true,
			export: true,
			exportData : false
		},

		app: qlik.currApp(this),

		paint: function ($element, layout) {
			var vars = {
				v: '1.0.1',
				id: layout.qInfo.qId,
				height: $element.height(),
				width: $element.width(),
				data: layout.qHyperCube.qDataPages[0].qMatrix,
				tooltip: {},
				chart: {
					pro: null,
					mousex: null,
					mousey: null,
				}
			}
			vars.css = '\n\
				#' + vars.id + ' {\n\
					height: ' + vars.height + 'px; \n\
					text-align: center; \n\
				}\n\
			';
			$("<style>").html(vars.css).appendTo("head");

			vars.template = '\
				<div qv-extension class="ng-scope senseui-streamGraph" id="' + vars.id + '"> \n\
					<div class="chart"></div> \n\
				</div> \n\
			';
			$element.html(vars.template);

			vars.data2 = _.groupBy(vars.data, function(d){ 
				return d[1].qText; 
			});

			// var n = Object.keys(vars.data2).length, // number of layers
			// m = 200, // number of samples per layer
			// stack = d3.layout.stack().offset("wiggle"),
			// layers0 = stack(d3.range(n).map(function() { return bumpLayer(m); })),
			// layers1 = stack(d3.range(n).map(function() { return bumpLayer(m); }));

			// var width = vars.width,
			//     height = vars.height;

			// var x = d3.scale.linear()
			//     .domain([0, m - 1])
			//     .range([0, width]);

			// var y = d3.scale.linear()
			//     .domain([0, d3.max(layers0.concat(layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
			//     .range([height, 0]);

			// var color = d3.scale.linear()
			//     .range(["#aad", "#556"]);

			// var area = d3.svg.area()
			//     .x(function(d) { return x(d.x); })
			//     .y0(function(d) { return y(d.y0); })
			//     .y1(function(d) { return y(d.y0 + d.y); });

			// var svg = d3.select('#'+vars.id).append("svg")
			//     .attr("width", width)
			//     .attr("height", height);

			// svg.selectAll("path")
			//     .data(layers0)
			//   .enter().append("path")
			//   	.attr("class", "layer")
			//     .attr("d", area)
			//     .style("fill", function() { return color(Math.random()); });

			// svg.selectAll(".layer")
			// 	.attr("opacity", 1)
			// 	.on("mouseover", function(d, i) {
			// 	  svg.selectAll(".layer").transition()
			// 	  .duration(250)
			// 	  .attr("opacity", function(d, j) {
			// 	  	console.log(j)
			// 	  	console.log(d)
			// 	    return j != i ? 0.6 : 1;
			// 	})})

			// function transition() {
			//   d3.selectAll("path")
			//       .data(function() {
			//         var d = layers1;
			//         layers1 = layers0;
			//         return layers0 = d;
			//       })
			//     .transition()
			//       .duration(2500)
			//       .attr("d", area);
			// }

			// // Inspired by Lee Byron's test data generator.
			// function bumpLayer(n) {

			//   function bump(a) {
			//     var x = 1 / (.1 + Math.random()),
			//         y = 2 * Math.random() - .5,
			//         z = 10 / (.1 + Math.random());
			//     for (var i = 0; i < n; i++) {
			//       var w = (i / n - y) * z;
			//       a[i] += x * Math.exp(-w * w);
			//     }
			//   }

			//   var a = [], i;
			//   for (i = 0; i < n; ++i) a[i] = 0;
			//   for (i = 0; i < 5; ++i) bump(a);
			//   return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
			// }

			// // Tooltip
			// var tip = d3.tip()
			// 	.attr('class', vars.id + ' d3-tip')
			// 	.offset([-10, 0]) 
			// 	.extensionData(vars.tooltip)
			// 	.html(function(j, d, i) {
			// 		var html = '\
			// 			<div>YIANNIS</div>\
			// 		';
			// 		return html;
			// 	})
			// svg.call(tip);

			// http://bl.ocks.org/WillTurman/4631136
			chart("http://localhost:4848/Extensions/SenseUIStreamGraph/data.csv", "blue");

			var datearray = [];
			var colorrange = [];


			function chart(csvpath, color) {

			if (color == "blue") {
			  colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
			}
			else if (color == "pink") {
			  colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
			}
			else if (color == "orange") {
			  colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
			}
			var strokecolor = colorrange[0];

			var format = d3.time.format("%m/%d/%y");
			var format2 = d3.time.format("%m/%d/%Y");

			var margin = {top: 20, right: 40, bottom: 30, left: 30};
			var width = vars.width - margin.left - margin.right;
			var height = vars.height - margin.top - margin.bottom;

			var tooltip = d3.select('#'+vars.id + " .chart")
			    .append("div")
			    .attr("class", "remove")
			    .style("position", "absolute")
			    .style("z-index", "20")
			    .style("visibility", "hidden")
			    .style("top", "30px")
			    .style("left", "55px");

			var x = d3.time.scale()
			    .range([0, width]);

			var y = d3.scale.linear()
			    .range([height-10, 0]);

			var z = d3.scale.ordinal()
			    .range(colorrange);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom")
			    // .ticks(d3.time.weeks);

			var yAxis = d3.svg.axis()
			    .scale(y);

			var yAxisr = d3.svg.axis()
			    .scale(y);

			var stack = d3.layout.stack()
			    .offset("silhouette")
			    .values(function(d) { return d.values; })
			    .x(function(d) { return d.date; })
			    .y(function(d) { return d.value; });

			var nest = d3.nest()
			    .key(function(d) { return d.key; });

			var area = d3.svg.area()
			    .interpolate("cardinal")
			    .x(function(d) { return x(d.date); })
			    .y0(function(d) { return y(d.y0); })
			    .y1(function(d) { return y(d.y0 + d.y); });

			var svg = d3.select('#'+vars.id + " .chart").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Draw the tooltip
			if ($('.' + vars.id + ' .d3-tip').length > 0) {
				$('.' + vars.id + ' .d3-tip ').remove();
			}
			var tip = d3.tip()
				.attr('class', vars.id + ' d3-tip')
				.offset([-10, 0]) 
				.extensionData(vars.tooltip)
				.html(function(d,i) {
					var html = '<div>' + d.key + '</div> \n\
						<div>' + vars.chart.pro + '</div> \n\
					';
					return html;
				})

			svg.call(tip);

			var graph = d3.csv(csvpath, function(data) {
			  data.forEach(function(d) {
			    d.date = format.parse(d.date);
			    d.value = +d.value;
			  });


			vars.data2 = vars.data.map(function(d) {
				return {
					"date": format2.parse(d[0].qText),
					"key": d[1].qText,
					"value": d[2].qNum,
					"qElemNumber": d[0].qElemNumber,
				}
			});
console.log(vars.data2[0])
console.log(data[0])
			  var layers = stack(nest.entries(data));

			  x.domain(d3.extent(data, function(d) { return d.date; }));
			  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

			  svg.selectAll(".layer")
			      .data(layers)
			    .enter().append("path")
			      .attr("class", "layer")
			      .attr("d", function(d) { return area(d.values); })
			      .style("fill", function(d, i) { return z(i); });

			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);

			  svg.append("g")
			      .attr("class", "y axis")
			      .attr("transform", "translate(" + width + ", 0)")
			      .call(yAxis.orient("right"));

			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis.orient("left"));

			  svg.selectAll(".layer")
			    .attr("opacity", 1)
			    // .style("cursor", "crosshair")
			    .on("mouseover", function(d, i) {
			      svg.selectAll(".layer").transition()
			      .duration(250)
			      .attr("opacity", function(d, j) {
			        return j != i ? 0.6 : 1;
			      }
			    )})

			    .on("mousemove", function(d, i) {
			      vars.chart.mousex = d3.mouse(this);
			      vars.chart.mousex = vars.chart.mousex[0];
			      var invertedx = x.invert(vars.chart.mousex);
			      invertedx = invertedx.getMonth() + invertedx.getDate();
			      var selected = (d.values);
			      for (var k = 0; k < selected.length; k++) {
			        datearray[k] = selected[k].date
			        datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
			      }

			      var mousedate = datearray.indexOf(invertedx);
			      vars.chart.pro = d.values[mousedate].value;

			      d3.select(this)
			      .classed("hover", true)
			      .attr("stroke", strokecolor)
			      .attr("stroke-width", "0.5px"), 
			      tip.show(d, i),
			      tooltip.html( "<p>" + d.key + "<br>" + vars.chart.pro + "</p>" ).style("visibility", "visible");
			      
			    })
			    .on("mouseout", function(d, i) {
			     svg.selectAll(".layer")
			      .transition()
			      .duration(250)
			      .attr("opacity", "1");
			      d3.select(this)
			      .classed("hover", false)
			      .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + vars.chart.pro + "</p>" ).style("visibility", "visible");
			      tip.hide();
			  })
			    
			  var vertical = d3.select(".chart")
			        .append("div")
			        .attr("class", "remove")
			        .style("position", "absolute")
			        .style("z-index", "19")
			        .style("width", "1px")
			        .style("height", "380px")
			        .style("top", "10px")
			        .style("bottom", "30px")
			        .style("left", "0px")
			        .style("background", "#fff");

			  d3.select(".chart")
			      .on("mousemove", function(d,i){
			         var coords = d3.mouse(this);
			         vars.chart.mousex = coords[0];
			         vars.chart.mousey = coords[1] + vars.height - 30;
			         vertical.style("left", vars.chart.mousex + "px" )
			         tip.style("left", (vars.chart.mousex-5) + "px" )
			         tip.style("top", vars.chart.mousey + "px" )
			         // tip.style("top", $element.offset().top + "px" )
			     })
			      .on("mouseover", function(d, i){
			         var coords = d3.mouse(this);
			         vars.chart.mousex = coords[0];
			         vars.chart.mousey = coords[1] + vars.height - 30;
			         vertical.style("left", vars.chart.mousex + "px")
			         tip.style("left", (vars.chart.mousex-5) + "px" )
			         tip.style("top", vars.chart.mousey + "px" )
			         // tip.style("top", $element.offset().top + "px" )
			     });
			});
			}

			// $('#' + vars.id + ' .content').append(legend);	
			
			console.info('%c SenseUI Graph Chart ' + vars.v + ': ', 'color: red', '#' + vars.id + ' Loaded!');

			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

