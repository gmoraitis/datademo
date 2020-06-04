
  function readTable(path, maxScore) {
  
    // read csv
    d3.csv("/files/rfm.csv", function (data) {
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

    // Apply extractScores function to the columns above
    let rs = extractScores(recency, maxScore);
    let fs = extractScores(frequency, maxScore);
    let ms = extractScores(monetary, maxScore);
    let labels = []
    for (let i = 0; i < data.length; i++)
      labels.push([rs[i], fs[i], ms[i]])
    console.log(labels);

    // Append columns to data

    // Create and render table
    update(data,labels);
    
};
  
/**
 * Converts a string to number for the calculations.
 * With the  + operator we can do the change . 
 */
function changeNumeric(data) {
  data.forEach(function (row) {
    row.RECENCY = +row.RECENCY;
    row.FREQUENCY = +row.FREQUENCY;
    row.MONETARY = +row.MONETARY;
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
 * Foo takes any argument.
 * The return value is 'baz' in all cases.
 * @param {*} bar - Any argument
 * @param {string} [optionalArg] - An optional argument that is a string
 */
function extractScores(column, maxScore) {

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
 
/**
 * Foo takes any argument.
 * The return value is 'baz' in all cases.
 * @param {*} bar - Any argument
 * @param {string} [optionalArg] - An optional argument that is a string
 */
function update(data, columns) {
  var table = d3.select('table').append('table')
  var thead = table.append('thead')
  var tbody = table.append('tbody')
  thead.append('tr').selectAll('th').data(columns).enter().append('th').text(function (d) { return d })
  var rows = tbody.selectAll('tr').data(data).enter().append('tr')
  var cells = rows.selectAll('td').data(function (row) {
    return columns.map(function (column) {
      return { column: column, value: row[column] }
    })
  }).enter().append('td').text(function (d) { return d.value })
  return table;
};

/**
 * Foo takes any argument.
 * The return value is 'baz' in all cases.
 * @param {*} bar - Any argument
 * @param {string} [optionalArg] - An optional argument that is a string
 */
function clear() {
var table = d3.select('table').selectAll("table").remove();
};  
    
    
  