
  function readTable(path, maxScore) {
  
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

    // Apply extractScores function to the columns above
    let recScores = extractScores(recency, maxScore);
    let freqScores = extractScores(frequency, maxScore);
    let monScores= extractScores(monetary, maxScore);
    let labels = []
    let scoresCols = ['RecencyScores', 'FrequencyScores', 'MonetaryScores'];
    for (let i = 0; i < data.length; i++){
      let scoresRow = {};
      scoresRow[scoresCols[0]] = recScores[i];
      scoresRow[scoresCols[1]] = freqScores[i];
      scoresRow[scoresCols[2]] = monScores[i];
      labels.push(scoresRow);
    }
    console.log(data);
    data = _.merge(data, labels);
    data.columns = data.columns.concat(scoresCols);
    console.log(data);
         
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
  
    
    
  