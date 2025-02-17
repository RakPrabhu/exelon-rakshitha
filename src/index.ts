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


import { TwilioService } from './services/v1/twilio/twilio'; // Import the service

const testTwilio = async () => {
const testPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER || ''; // Replace with your real number
  const testMessage = 'Your OTP for exelon is 5559';

  const result = await TwilioService.sendSMS(testPhoneNumber, testMessage);
  console.log('Test Result:', result);
};
const testWhatsApp = async () => {
  const testPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER|| ''; // Replace with your WhatsApp number
  const testMessage = 'Hello Rakshi wasuppp';

  const result = await TwilioService.sendWhatsApp(testPhoneNumber, testMessage);
  console.log('WhatsApp Test Result:', result);
};

async function callUserWithTTS() {
  const testPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER || ''; // Replace with your real number
  const testMessage = 'Hello Rakshitha good job ';
  const response = await TwilioService.makeCall(testPhoneNumber,testMessage);
  console.log('Call Response:', response);
}
//testTwilio();
// testWhatsApp();
// callUserWithTTS();

// import { extractImagesFromPDFs, extractTextFromPDFs } from "./services/v1/pdfExtract";
// import path from "path";
// const pdfPaths = [
//     path.join(__dirname, "pdfs", "a.pdf"),
//     path.join(__dirname, "pdfs", "b.pdf"),
// ]
// const outputFolder = "./src/services/v1/pdfExtract/pdf_image";
// console.log(pdfPaths)
// console.log(outputFolder);

// (async () => {
//     await extractImagesFromPDFs(pdfPaths, outputFolder);
//     console.log("Images extracted!");

//     // const textFilePath = await extractTextFromPDFs(pdfPaths);
//     // console.log(`Text extracted to: ${textFilePath}`);
// })();

import { extractTextFromWordDocs,extractImagesFromWordDocs,replaceInFile } from './services/v1/wordExtract';
import path from "path";
const wordPaths = [
  path.join(__dirname, "wordDocs", "a.docx"),
  // path.join(__dirname, "wordDocs", "b.docx"),
  ]
  const outputFolder = "./src/services/v1/wordExtract/word_image";
  console.log(wordPaths)
  console.log(outputFolder);
  (async () => {
    // await extractImagesFromWordDocs(wordPaths, outputFolder);
    // console.log("Images extracted!");
    // const textFilePath = await extractTextFromWordDocs(wordPaths);
    // console.log(`Text extracted to: ${textFilePath}`);
    replaceInFile('src/wordDocs/sample.docx', /hello/gi, "hi","src/services/v1/wordExtract/modified.docx");

    })();

