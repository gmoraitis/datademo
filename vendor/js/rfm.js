
  function readTable(path) {
  
  // read csv
  d3.csv(path, function (data) {
    
    // Change to numeric
    changeNumeric(data);

    // Extract columns

    // Apply extractScores function to the columns above

    // Append columns to data

    // Create and render table

  });

};

// Change to numeric
function changeNumeric(data) {
  data.forEach(function (col) {
    col.RECENCY = +col.RECENCY;
    col.FREQUENCY = +col.FREQUENCY;
    col.MONETARY = +col.MONETARY;
  });
};


// Extract scores
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
  
// Create table
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

// Clear table
function clear() {
var table = d3.select('table').selectAll("table").remove();
};  
  
  
