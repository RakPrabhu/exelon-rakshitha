import cron from 'node-cron';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const cronSchedule = process.env.CRON_SCHEDULE!;
const targetDate = process.env.TARGET_DATE;

if (!accountSid || !authToken) {
  throw new Error('Missing Twilio environment variables!');
}

if (!cronSchedule || !targetDate) {
  throw new Error('Missing cron schedule or target date in environment variables!');
}

const client = twilio(accountSid, authToken);

const sendMessage = async () => {
  const recipientPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER;
  if (!recipientPhoneNumber) {
    throw new Error('Missing recipient phone number!');
  }

  try {
    const message = await client.messages.create({
      body: 'Your OTP TO LOGIN TO EXELON IS 5559',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipientPhoneNumber,
    });
    console.log('Message sent:', message.sid);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Schedule using time from .env, but only run today
cron.schedule(cronSchedule, () => {
  if (today === targetDate) {
    console.log(`Running the scheduled Twilio SMS task at ${cronSchedule} on ${targetDate}...`);
    sendMessage();

    // Stop the cron job after execution
    setTimeout(() => {
      process.exit(0); // Exit the script after sending the message
    }, 5000);
  } else {
    console.log(`Skipping cron job. Today is ${today}, but the target date is ${targetDate}`);
  }
});

console.log(`Cron job scheduled with time: ${cronSchedule} for date: ${targetDate}`);
