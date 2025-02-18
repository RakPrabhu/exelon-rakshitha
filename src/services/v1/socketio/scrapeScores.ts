import puppeteer from 'puppeteer';
import io from 'socket.io-client';

// Connect to WebSocket server
const socket = io('http://localhost:3000');

async function scrapeScores() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the match page
  await page.goto('https://www.espncricinfo.com/series/ranji-trophy-2024-25-1445824/gujarat-vs-kerala-1st-semi-final-1445954/live-cricket-score', { 
    waitUntil: 'networkidle2' 
  });

  await page.waitForSelector('table.ds-w-full.ds-table');

  const fetchMatchDetails = async () => {
    const matchDetails = await page.evaluate(() => {
      const batters = [];
      const bowlers = [];
  
      // Get all tables with the correct class
      const tables = document.querySelectorAll('table.ds-w-full.ds-table');
  
      // Identify batting tables (look for "Batters" in headers)
      const batterTables = [];
      for (const table of tables) {
        const headers = table.querySelectorAll('th');
        for (const header of headers) {
          if (header.textContent && header.textContent.includes('Batters')) {
            batterTables.push(table); // Add table if header contains "Batters"
            break;
          }
        }
      }
  
      // Process batters from all batting tables
      for (const batterTable of batterTables) {
        const rows = batterTable.querySelectorAll('tbody tr');
        for (const row of rows) {
          if (row.classList.contains('ds-hidden') || row.querySelector('th')) continue;
  
          const columns = row.querySelectorAll('td');
          if (columns.length >= 3) {
            const nameCell = columns[0];
            if (!nameCell) continue;
  
            const nameElement = nameCell.querySelector('a span');
            if (!nameElement) continue;
  
            const name = nameElement.textContent?.trim() || 'N/A';
            const styleElement = nameCell.querySelector('span.ds-text-tight-s.ds-font-regular');
            const style = styleElement ? ` (${styleElement.textContent?.trim() || ''})` : '';
  
            const runsText = columns[1]?.textContent?.trim() || '0';
            const ballsText = columns[2]?.textContent?.trim() || '0';
  
            const runs = parseInt(runsText) || 0;
            const balls = parseInt(ballsText) || 0;
  
            // Check if player is a batter or bowler based on their style (lhb or rhb)
            if (name !== 'N/A') {
              if (style.includes('lhb') || style.includes('rhb')) {
                console.log(`Adding batter: ${name}, Runs: ${runs}, Balls: ${balls}`); // Debug log
                batters.push({
                  name: `${name}${style}`,
                  runs,
                  balls
                });
              } else {
                console.log(`Adding bowler: ${name}, Overs: ${runsText}, Wickets: ${ballsText}`); // Debug log
                bowlers.push({
                  name: `${name}${style}`,
                  overs: runsText, // Keep overs as a string
                  maidens: ballsText // Treat wickets as the 3rd column (or whichever column contains wickets)
                });
              }
            }
          }
        }
      }
  
      // Deduplication and validation
      // Ensure no player appears in both arrays
      const batterNames = new Set(batters.map(b => b.name));
      const filteredBowlers = bowlers.filter(bowler => !batterNames.has(bowler.name));
  
      return { batters, bowlers: filteredBowlers };
    });
    console.log('Sending match details:', matchDetails);
    socket.emit('SCORE_UPDATE', matchDetails);
  };
  

  await fetchMatchDetails();
  setInterval(fetchMatchDetails, 15000); // Update every 15 seconds
  
  // Cleanup function
  process.on('SIGINT', async () => {
    await browser.close();
    process.exit();
  });
}

scrapeScores().catch(error => {
  console.error('Error in scraping script:', error);
});