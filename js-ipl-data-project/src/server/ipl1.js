const fs = require('fs');
const csv = require('csv-parser');

function calculateMatchesPerYear() {
  const results = {};
  fs.createReadStream('../data/matches.csv') 
    .pipe(csv())
    .on('data', (row) => {
      const year = row['season'];
      results[year] = results[year] ? results[year] + 1 : 1;
    })
    .on('end', () => {
      fs.writeFileSync('../public/output/matchesPerYear.json', JSON.stringify(results, null, 2));
      console.log('Matches per year data written to JSON file');
    });
}

calculateMatchesPerYear();
 