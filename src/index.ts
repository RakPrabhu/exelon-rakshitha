import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config()
const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Node.js with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


import { TwilioService } from './services/twilio'; // Import the service

const testTwilio = async () => {
const testPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER || ''; // Replace with your real number
  const testMessage = 'Your OTP for exelon is 5559';

  const result = await TwilioService.sendSMS(testPhoneNumber, testMessage);
  console.log('Test Result:', result);
};

testTwilio();
