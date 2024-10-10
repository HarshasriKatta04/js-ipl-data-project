const fs = require('fs');
const csv = require('csv-parser');

function calculateEconomicalBowlers2015() {
  const matchIds2015 = new Set();
  const bowlerStats = {};

  // Step 1: Get match_id for 2015 from matches.csv
  fs.createReadStream('../data/matches.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row['season'] === '2015') {
        matchIds2015.add(row['id']);
      }
    })
    .on('end', () => {
      console.log('Collected match IDs for 2015');

      // Step 2: Filter deliveries based on match_ids and calculate economy rate
      fs.createReadStream('../data/deliveries.csv') // Updated path for deliveries.csv
        .pipe(csv())
        .on('data', (row) => {
          if (matchIds2015.has(row['match_id'])) {
            const bowler = row['bowler'];
            const totalRuns = parseInt(row['total_runs'], 10);
            const ball = 1;

            if (!bowlerStats[bowler]) {
              bowlerStats[bowler] = { runs: 0, balls: 0 };
            }

            bowlerStats[bowler].runs += totalRuns;
            bowlerStats[bowler].balls += ball;
          }
        })
        .on('end', () => {
          const economyRates = [];
          
          // Step 3: Calculate economy rate (runs per over) for each bowler
          for (const bowler in bowlerStats) {
            const stats = bowlerStats[bowler];
            const overs = stats.balls / 6;
            const economy = stats.runs / overs;
            economyRates.push({ bowler, economy });
          }

          // Sort by economy rate, ascending (top 10)
          economyRates.sort((a, b) => a.economy - b.economy);
          const top10Bowlers = economyRates.slice(0, 10);

          // Step 4: Write the result to JSON
          fs.writeFileSync('../public/output/top10EconomicalBowlers2015.json', JSON.stringify(top10Bowlers, null, 2));
          console.log('Top 10 economical bowlers in 2015 data written to JSON file');
        });
    });
}

calculateEconomicalBowlers2015();
