import puppeteer from 'puppeteer';
import socketIoClient from 'socket.io-client';

interface MatchDetails {
  overs: string;
  score: string;
  runs: string;
  wickets: string;
}

const socket = socketIoClient('http://localhost:3000');

async function scrapeScores() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.espncricinfo.com/series/ranji-trophy-2024-25-1445824/gujarat-vs-kerala-1st-semi-final-1445954/live-cricket-score', { waitUntil: 'domcontentloaded' });

  // Wait for the element containing the overs and score
  await page.waitForSelector('.ds-text-compact-m.ds-text-typo');

  const fetchMatchDetails = async () => {
    const matchDetails = await page.evaluate(() => {
      const oversElement = document.querySelector('.ds-text-compact-xs.ds-mr-0\\.5'); // Fixed selector for overs element
      const scoreElement = document.querySelector('.ds-text-compact-m.ds-text-typo.ds-text-right');

      const oversText = oversElement && oversElement.textContent ? oversElement.textContent.trim() : 'N/A';
      const scoreText = scoreElement && scoreElement.textContent ? scoreElement.textContent.trim() : 'N/A';

      // Debugging: print out the actual text of the overs and score
      console.log('Overs Text:', oversText);
      console.log('Score Text:', scoreText);

      // Match the overs value (e.g., "88.5 ov") and remove any surrounding parentheses
      const oversMatch = oversText.match(/\(?(\d+(\.\d+)?)\s*ov\)?/);  // Allow for parentheses around overs

      // Extract score using regex (e.g., "206/4")
      const scoreMatch = scoreText.match(/(\d+\/\d+)/);  // Match score pattern

      const overs = oversMatch ? oversMatch[1] : 'N/A';  // Get the overs value, or 'N/A' if not found

      // If the score is in the format "runs/wickets", split it into runs and wickets
      let runs = 'N/A';
      let wickets = 'N/A';

      if (scoreMatch) {
        const scoreParts = scoreMatch[1].split('/'); // Split the score into runs and wickets
        runs = scoreParts[0]; // Runs are the first part
        wickets = scoreParts[1]; // Wickets are the second part
      }

      return { overs, score: scoreMatch ? scoreMatch[1] : 'N/A', runs, wickets };
    });

    console.log('Overs:', matchDetails.overs);  // Ensure you log the overs
    console.log('Score:', matchDetails.score);
    console.log('Runs:', matchDetails.runs);
    console.log('Wickets:', matchDetails.wickets);
  };

  // Fetch the match details initially
  await fetchMatchDetails();

  // Set an interval to fetch match details every 15 seconds
  setInterval(fetchMatchDetails, 15000); // 15000ms = 15 seconds

  // Uncomment to stop the browser after a specific time (e.g., 1 minute)
  // setTimeout(() => browser.close(), 60000);  // Close browser after 1 minute
}

// Start the scraping process
scrapeScores();
