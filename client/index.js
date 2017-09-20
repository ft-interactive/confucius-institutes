import './styles.scss';
import * as d3 from 'd3';
import { geoNaturalEarth2 } from 'd3-geo-projection'


////////// IMPORT DATA //////////

import rawdata from './data/confucius_locations.csv';
import geodata from './data/world_countries.json';


////////// SETUP //////////

// calculate width and height of svg based on window size
var divWidth = d3.select(".confucius-graphic").node().getBoundingClientRect().width;

var margin = {
  top: 20, 
  right: divWidth / 20, 
  bottom: 0, 
  left: divWidth / 20
};
var width = Math.max(Math.min(divWidth, 980), 350) - margin.left - margin.right;
var height = Math.round(Math.max(Math.min(divWidth, 980), 490)*0.55) - margin.top - margin.bottom;

var histHeight = height/5;

var parseDate = d3.timeParse("%d-%b-%y");
var formatDateIntoYear = d3.timeFormat("%Y");

var startDate = new Date("2004-11-01"),
    endDate = new Date("2017-05-31");

var dateArray = d3.timeYears(startDate, d3.timeYear.offset(endDate, 1));

var colours = d3.scaleOrdinal()
    .domain(dateArray)
    .range(['#ffc388','#ffb269','#ffa15e','#fd8f5b','#f97d5a','#f26c58','#e95b56','#e04b51','#d53a4b','#c92c42','#bb1d36','#ac0f29','#9c0418','#8b0000']);

// parse data
var data = d3.csvParse(rawdata);

data.forEach(function(d) {
  d.date = parseDate(d.date);
  d.value = +d.value;
  return d;
})

var nullDates = data.filter(function(d) {
  return d.date == null;
})

var dataset = data.filter(function(d) {
  return d.date != null;
})

// x scale for time
var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width])
    .clamp(true);

// draw svg
var svg = d3.select(".locations-map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


////////// HISTOGRAM //////////

// set parameters for histogram
var histogram = d3.histogram()
    .value(function(d) { return d.date; })
    .domain(x.domain())
    .thresholds(x.ticks(d3.timeYear));

// group data for histogram bars
var bins = histogram(data);

// y scale for histogram
var y = d3.scaleLinear()
    .domain([0, d3.max(bins, function(d) { return d.length; })])
    .range([histHeight, 0]);

var hist = svg.append("g")
    .attr("class", "hist")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = hist.selectAll(".bar")
    .data(bins)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })

bar.append("rect")
    .attr("class", "bar")
    .attr("x", 1)
    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1; })
    .attr("height", function(d) { return histHeight - y(d.length); })
    .attr("fill", function(d) { return colours(d.x0); });

bar.append("text")
    .attr("class", "histLabel")
    .attr("dy", ".75em")
    .attr("y", "6")
    .attr("x", function(d) { return (x(d.x1) - x(d.x0))/2; })
    .attr("text-anchor", "middle")
    .text(function(d) { if (d.length>15) { return d.length; } })
    .style("fill", "white");


////////// BASE MAP //////////

var projection = geoNaturalEarth2()
  .scale([width*0.2])
  .translate([width/2, height/2 + height*0.25]);

var path = d3.geoPath()
  .projection(projection);

var graticule = d3.geoGraticule();

var map = svg.append("g")
    .attr("class", "map")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

map.append("g")
    .attr("class", "graticule")
    .append("path")
    .datum(graticule)
    .attr("d", path);

map.append("g")
    .attr("class", "countries")
    .selectAll("path")
      .data(geodata.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "#d0d7cc")
      .style("opacity", 0.7)
      .style("stroke", "white")


////////// CENTRE LOCATIONS //////////

var centres = svg.append("g")
    .attr("class", "centre-locations")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// draw all centre locations upon load
drawLocations(data);

function drawLocations(data) {
  var locations = centres.selectAll(".centre")
      .data(data, function(d) { return d.id; });

  // if filtered dataset has more circles than already existing, transition new ones in
  locations.enter()
      .append("circle")
      .attr("class", "centre")
      .attr("cx", function(d) { return projection([d.longitude, d.latitude])[0]; })
      .attr("cy", function(d) { return projection([d.longitude, d.latitude])[1]; })
      .style("fill", function(d) {
        if (d.date == null) {
          return "#666";
        } else {
          return colours(d3.timeYear(d.date));
        }
      })
      .style("stroke", function(d) { return colours(d3.timeYear(d.date)); })
      .style("opacity", 0.5)
      .attr("r", 3);

  // if filtered dataset has less circles than already existing, remove excess
  locations.exit()
    .remove();
}


////////// SLIDER //////////

var currentValue = 0;
var targetValue = width;

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + (margin.top+histHeight+5) +")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          currentValue = d3.event.x;
          update(x.invert(currentValue)); 
        })
    );

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 7)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDateIntoYear(d); });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);


////////// PLAY ANIMATION BUTTON //////////

var timer;
var moving = false;

var playButton = d3.select(".play-button");

playButton
  .on("click", function() {
    var button = d3.select(this);

    if(button.text() == "Pause animation") {
      moving = false;
      clearInterval(timer);
      button.text("Play animation");
    } else {
      moving = true;
      timer = setInterval(step, 100);
      button.text("Pause animation");
    }
    console.log("Slider moving: " + moving);
  })


////////// COUNTER //////////

var counter = svg.append("g")
    .attr("class", "counter")
    .attr("transform", "translate(" + width/10 + "," + (height-20) + ")");

var num = counter.append("text")
    .attr("class", "number")
    .attr("text-anchor", "middle")
    .text("500");

counter.append("text")
    .attr("transform", "translate(0, 25)")
    .attr("text-anchor", "middle")
    .text("locations");


////////// UPDATE FUNCTIONS //////////

// update map
function update(h) {
  handle.attr("cx", x(h));

  // filter data set and redraw plot
  var newData = dataset.filter(function(d) {
    return d.date < h;
  })

  // if the slider is at the end, add the locations with no dates
  if (h > x.invert(targetValue-5)) {
    newData = d3.merge([newData, nullDates]);
  }

  drawLocations(newData);

  // histogram bar colours
  d3.selectAll(".bar")
    .attr("fill", function(d) {
      if (d.x0 < h) {
        return colours(d.x0);
      } else {
        return "#dad2c3";
      }
    })

  // update counter number
  num.text(newData.length);
}

// update slider animation
function step() {
  update(x.invert(currentValue));
  currentValue = currentValue + (targetValue/151); // each step is a month on time scale
  if (currentValue > targetValue) {
    // reached end of slider, reset
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    playButton.text("Play animation");
    console.log("Slider moving: " + moving);
  }
}

/*
  TODO: delete this comment

  This file is where you bootstrap your JS code
  For example import stuff here:

  import {select} from 'd3-selection';
  import myComponent from './components/my-component';

  Split logical parts of you project into components e.g.

  /client
    - /components
        - /component-name
            - styles.scss
            - index.js
            - template.html

  If you want to import some data, just import it like normal:

  import myData from './data.csv';

  `myData` will be a string that you can then parse into an object using, for example, d3.csvParse()

  You can import CSV, TSV, TXT, XML and JSON this way! Note, however, that it will increase your
  bundle size, which may increase the time to first render in some cases!
*/
