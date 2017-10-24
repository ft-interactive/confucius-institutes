import './styles.scss';
import * as d3 from 'd3';
import { geoNaturalEarth2 } from 'd3-geo-projection';
import d3Tip from 'd3-tip';
d3.tip = d3Tip;


////////// IMPORT DATA //////////

import rawdata from './data/confucius_locations.csv';
import geodata from './data/world_countries.json';


////////// SETUP //////////

// calculate width and height of svg based on window size
let divWidth = d3.select(".confucius-graphic").node().getBoundingClientRect().width;

let margin = {
  top: 20, 
  right: divWidth / 20, 
  bottom: 0, 
  left: divWidth / 20
};
let width = Math.max(Math.min(divWidth, 1220), 240) - margin.left - margin.right;
let height = Math.round(Math.max(Math.min(divWidth, 1220), 240)*0.55) - margin.top - margin.bottom;

let histHeight = height/5;

let parseDate = d3.timeParse("%d-%b-%y");
let formatDateIntoYear = d3.timeFormat("%Y");
let formatDateIntoMonthYear = d3.timeFormat("%B, %Y");

const startDate = new Date("2004-11-01"),
    endDate = new Date("2017-05-31");

const dateArray = d3.timeYears(startDate, d3.timeYear.offset(endDate, 1));

const colours = d3.scaleOrdinal()
    .domain(dateArray)
    .range(['#ffc388','#ffb269','#ffa15e','#fd8f5b','#f97d5a','#f26c58','#e95b56','#e04b51','#d53a4b','#c92c42','#bb1d36','#ac0f29','#9c0418','#8b0000']);

// parse data
let data = d3.csvParse(rawdata);

data.forEach(d => {
  d.date = parseDate(d.date);
  d.value = +d.value;
  return d;
})

let nullDates = data.filter(d => {
  return d.date == null;
})

let dataset = data.filter(d => {
  return d.date != null;
})

// x scale for time
let x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, width])
    .clamp(true);

// draw svg
let svg = d3.select(".locations-map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      let date = "NA";
      if (d.date != null) {
        date = formatDateIntoMonthYear(d.date);
      }
      return `
      <span class="details">
        ${d.location}, ${d.country}<br/>
        Established: ${date}
      </span>
      `;
    });

svg.call(tip);

////////// HISTOGRAM //////////

// set parameters for histogram
let histogram = d3.histogram()
    .value((d) => { return d.date; })
    .domain(x.domain())
    .thresholds(x.ticks(d3.timeYear));

// group data for histogram bars
let bins = histogram(data);

// y scale for histogram
let y = d3.scaleLinear()
    .domain([0, d3.max(bins, (d) => { return d.length; })])
    .range([histHeight, 0]);

let hist = svg.append("g")
    .attr("class", "hist")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let bar = hist.selectAll(".bar")
    .data(bins)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d) => {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })

bar.append("rect")
    .attr("class", "bar")
    .attr("x", 1)
    .attr("width", (d) => { return x(d.x1) - x(d.x0) -1; })
    .attr("height", (d) => { return histHeight - y(d.length); })
    .attr("fill", (d) => { return colours(d.x0); });

bar.append("text")
    .attr("class", "histLabel")
    .attr("dy", ".75em")
    .attr("y", "6")
    .attr("x", (d) => { return (x(d.x1) - x(d.x0))/2; })
    .attr("text-anchor", "middle")
    .text((d) => { if (d.length>15) { return d.length; } })
    .style("fill", "white");


////////// BASE MAP //////////

let projection = geoNaturalEarth2()
  .scale([width*0.19])
  .translate([width/2, height/2 + height*0.23]);

let path = d3.geoPath()
  .projection(projection);

let graticule = d3.geoGraticule();

let map = svg.append("g")
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
      .style("fill-opacity", 0.7)
      .style("stroke", "white")


////////// CENTRE LOCATIONS //////////

let centres = svg.append("g")
    .attr("class", "centre-locations")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// draw all centre locations upon load
drawLocations(data);

function drawLocations(data) {
  let locations = centres.selectAll(".centre")
      .data(data, (d) => { return d.id; });

  // if filtered dataset has more circles than already existing, transition new ones in
  locations.enter()
      .append("circle")
      .attr("class", "centre")
      .attr("cx", (d) => { return projection([d.longitude, d.latitude])[0]; })
      .attr("cy", (d) => { return projection([d.longitude, d.latitude])[1]; })
      .style("fill", (d) => {
        if (d.date == null) {
          return "#666";
        } else {
          return colours(d3.timeYear(d.date));
        }
      })
      .style("stroke", (d) => { 
        if (d.date == null) {
          return "#666";
        } else {
          return colours(d3.timeYear(d.date));
        }
      })
      .style("fill-opacity", 0.5)
      .style("stroke-opacity", 0.5)
      .on("mouseover", function(d) {
        tip.show(d);

        d3.select(this)
        .style("fill-opacity", 0.9)
        .style("stroke-opacity", 0.9)
        .style("stroke","black")
        .style("stroke-width",1.5);
      })
      .on("mouseout", function(d) {
        tip.hide(d);

        d3.select(this)
        .style("fill-opacity", 0.6)
        .style("stroke-opacity", 0.6)
        .style("stroke","white")
        .style("stroke-width",0.5);
      })
      .attr("r", 3)
        .transition()
        .duration(300)
        .attr("r", 5)
          .transition()
          .attr("r", 3)

  // if filtered dataset has less circles than already existing, remove excess
  locations.exit()
    .remove();
}


////////// SLIDER //////////

let currentValue = 0;
let targetValue = width;

let slider = svg.append("g")
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
        .on("start.interrupt", () => { slider.interrupt(); })
        .on("start drag", () => {
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
    .text(d => { return formatDateIntoYear(d); });

let handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);


////////// PLAY ANIMATION BUTTON //////////

let timer;
let moving = false;

let playButton = d3.select(".play-button");

playButton
  .on("click", function() {
    let button = d3.select(this);

    if(button.text() == "Pause animation") {
      moving = false;
      clearInterval(timer);
      button.text("\u25B6 Play animation");
    } else {
      moving = true;
      timer = setInterval(step, 100);
      button.text("Pause animation");
    }
    console.log("Slider moving: " + moving);
  })


////////// COUNTER //////////

let counter = svg.append("g")
    .attr("class", "counter")
    .attr("transform", "translate(" + width/10 + "," + (height-20) + ")");

let num = counter.append("text")
    .attr("class", "number")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "baseline")
    .text("500");

counter.append("text")
    .attr("transform", "translate(0, 20)")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "baseline")
    .text("locations");


////////// UPDATE FUNCTIONS //////////

// update map
function update(h) {
  handle.attr("cx", x(h));

  // filter data set and redraw plot
  var newData = dataset.filter(d => {
    return d.date < h;
  })

  // if the slider is at the end, add the locations with no dates
  if (h > x.invert(targetValue-5)) {
    newData = d3.merge([newData, nullDates]);
  }

  drawLocations(newData);

  // histogram bar colours
  d3.selectAll(".bar")
    .attr("fill", d => {
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
  if (currentValue > targetValue+10) {
    // reached end of slider, reset
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    playButton.text("\u25B6 Play animation");
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
