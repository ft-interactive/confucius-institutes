import './styles.scss';

import * as d3 from 'd3';

var margin = {top:20, right:50, bottom:0, left:50};

// calculate width and height of svg based on window size
var divWidth = d3.select(".confucius-graphic").node().getBoundingClientRect().width;
var width = Math.max(Math.min(divWidth, 980), 490) - margin.left - margin.right;
var height = Math.round(Math.max(Math.min(divWidth, 980), 490)*0.55) - margin.top - margin.bottom;


var histHeight = height/5;

var svg = d3.select(".locations-map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("rect")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("fill", "lightgrey");



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
