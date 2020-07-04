


let maxScore = 10;

//FOR MONETARY
function readTable() {
  
  let path = document.getElementById('csv').value;
  console.log(path);

  // read csv
  d3.csv(path).then(function (data) {
    main(data, maxScore);
  });

};

/**
* Main takes two arguments.Data which is the csv and a max score for the calculation of the data.
* The return value is data ready to be render in d3 as perhaps a table .
* Main uses the following functions a)changeNumeric, b)extractColumn, c)extractScores.  
* @param {*} data - The csv file.
* @param {*} maxScore - A given number from user to have an end in our calculation.
*/
function main(data, maxScore) {

  // Change to numeric
  changeNumeric(data);

  // Extract columns
  let recency = extractColumn(data, 'RECENCY');
  let frequency = extractColumn(data, 'FREQUENCY');
  let monetary = extractColumn(data, 'MONETARY');


  // Apply calculateScores function to the columns above
  let recScores = calculateScores(recency, maxScore);
  let freqScores = calculateScores(frequency, maxScore);
  let monScores = calculateScores(monetary, maxScore);
  let labels = []
  let scoresCols = ['RecencyScores', 'FrequencyScores', 'MonetaryScores'];
  for (let i = 0; i < data.length; i++) {
    let scoresRow = {};
    scoresRow[scoresCols[0]] = recScores[i];
    scoresRow[scoresCols[1]] = freqScores[i];
    scoresRow[scoresCols[2]] = monScores[i];
    labels.push(scoresRow);
  }
  
  data = _.merge(data, labels);
  data.columns = data.columns.concat(scoresCols);
  


  // Set the matgin of the svg
  var margin = { top: 50, right: 50, bottom: 50, left: 50 };

  //set the width and height using the current width and height of ther div
  var width = 600 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  //create svg and append to visualization div
  var svg = d3.select("#visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // set the ranges
  var x = d3.scaleBand()
    .range([0, width]);

  var y = d3.scaleLinear()
    .range([height, 0]);

  // Scale the range of the data in the domains
  x.domain(data.map(function (row) { return row.ID; }));
  y.domain([0, d3.max(data, function (row) { return row.MONETARY; })]);


  // append the rectangles for the bar chart
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (row) { return x(row.ID); })
    .attr("width", x.bandwidth())
    .attr("y", function (row) { return y(row.MONETARY); })
    .attr("height", function (row) { return height - y(row.MONETARY); });

  //add the x axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  //add the y axis
  svg.append("g")
    .call(d3.axisLeft(y));

};

/**
* Converts a string to number for the calculations.
* With the + operator we can do the change . 
*/
function changeNumeric(data) {

  data.forEach(function (row) {
    row.RECENCY = +row.RECENCY;
    row.FREQUENCY = +row.FREQUENCY;
    row.MONETARY = +row.MONETARY;
    row.id = +row.ID;
  });
};

/**
* It takes two arguments.
* The return value is 'column' in all cases.
* @param {*} data - Is the 
* @param {*} colName - An optional argument that is a string.
* @param {*} column - Is an array to be filled.
*/
function extractColumn(data, colName) {
  column = [];
  data.forEach(function (row) {
    column.push(row[colName]);
  });
  return column;
}

/**
* extractScores takes two arguments.
* The return value is 'scores' in all cases.
* @param {*} column - 
* @param {*} maxScore - 
*/
function calculateScores(column, maxScore) {

  // Get min and max
  min = Math.min(...column);
  max = Math.max(...column);

  // Calculate step
  step = (max - min) / maxScore

  // Populate scores
  scores = []
  column.forEach(function (el) {
    score = 0;
    do {
      score++;
    }
    while (el > min + score * step);
    scores.push(score);
  });

  return scores;
}

function clear(){
  document.getElementsById('visualization').style.display = "none";
}

