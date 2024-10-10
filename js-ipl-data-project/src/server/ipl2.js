const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

function calculateMatchesWonPerTeamPerYear() {
  const results = {};
  const outputDir = path.join(__dirname, '../public/output'); // Construct the output directory path

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.createReadStream('../data/matches.csv')
    .pipe(csv())
    .on('data', (row) => {
      const season = row['season'];
      const winner = row['winner'];
      if (!results[season]) {
        results[season] = {};
      }
      if (winner) {
        results[season][winner] = results[season][winner] ? results[season][winner] + 1 : 1;
      }
    })
    .on('end', () => {
      fs.writeFileSync(path.join(outputDir, 'matchesWonPerTeamPerYear.json'), JSON.stringify(results, null, 2));
      console.log('Matches won per team per year data written to JSON file');
    });
}

calculateMatchesWonPerTeamPerYear();
