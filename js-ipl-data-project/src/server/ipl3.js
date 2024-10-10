const fs = require('fs');
const csv = require('csv-parser');

function calculateExtraRunsConcededPerTeam() {
  const matchIds2016 = new Set();
  const results = {};

  // Step 1: Read matches.csv and get match_id for the year 2016
  fs.createReadStream('../data/matches.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row['season'] === '2016') {
        matchIds2016.add(row['id']);
      }
    })
    .on('end', () => {
      console.log('Collected match IDs for 2016');

      // Step 2: Use match IDs to filter deliveries.csv and calculate extra runs
      fs.createReadStream('../data/deliveries.csv')
        .pipe(csv())
        .on('data', (row) => {
          if (matchIds2016.has(row['match_id'])) {
            const bowling_team = row['bowling_team'];
            const extra_runs = parseInt(row['extra_runs'], 10);

            if (!results[bowling_team]) {
              results[bowling_team] = 0;
            }

            results[bowling_team] += extra_runs;
          }
        })
        .on('end', () => {
          fs.writeFileSync('../public/output/extraRunsConcededPerTeam2016.json', JSON.stringify(results, null, 2));
          console.log('Extra runs conceded per team in 2016 data written to JSON file');
        });
    });
}

calculateExtraRunsConcededPerTeam();
