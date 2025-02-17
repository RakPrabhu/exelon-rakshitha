import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import pdfParse from "pdf-parse";
import pdf2pic from "pdf2pic";
const { PDFDocument } = require("pdf-lib");
import { extractImagesFromPdf } from "pdf-extract-image";
import { writeFileSync, existsSync, mkdirSync } from "fs";
// Function to extract images from PDFs
import { exportImages } from "pdf-export-images";

async function extractImagesFromPDFs(pdfPaths: string[], outputFolder: string) {
  // Ensure the output folder exists
  // Ensure the output folder exists
  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder);
  }

  const fileNameCount: { [key: string]: number } = {};

  for (const pdfPath of pdfPaths) {
    const baseName = path.basename(pdfPath, path.extname(pdfPath));
    let folderName = baseName;

    // Append a number to folder name if it already exists
    if (fileNameCount[baseName]) {
      fileNameCount[baseName]++;
      folderName = `${baseName}-${fileNameCount[baseName]}`;
    } else {
      fileNameCount[baseName] = 1;
    }

    const outputDir = path.join(outputFolder, folderName);

    // Ensure directory for the PDF exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir);
    }

    try {
      // Extract images from PDF
      const images = await extractImagesFromPdf(pdfPath);

      if (images.length === 0) {
        console.log(`No images found in ${pdfPath}`);
        continue;
      }

      // Save images
      images.forEach((image, index) => {
        const imgPath = path.join(outputDir, `image${index}.png`);
        writeFileSync(imgPath, image);
      });

      console.log(`Extracted images from ${pdfPath} and saved to ${outputDir}`);
    } catch (error) {
      console.error(`Error extracting images from ${pdfPath}:`, error);
    }
  }
}

// Function to extract text from PDFs and store in separate files
async function extractTextFromPDFs(pdfPaths: string[]): Promise<string> {
  const textOutputFolder = path.join(__dirname, "pdf_text"); // Adjusted to use absolute path to store text files
  await fs.ensureDir(textOutputFolder); // Ensure the output folder exists

  let combinedText = "";
  let index = 1;

  for (const pdfPath of pdfPaths) {
    const baseName = path.basename(pdfPath, path.extname(pdfPath));
    let fileName = `${baseName}-${index}.txt`; // Create unique file names to avoid overwriting

    let outputPath = path.join(textOutputFolder, fileName);

    // Ensure unique file name (if file already exists, append a number)
    while (await fs.pathExists(outputPath)) {
      index++;
      fileName = `${baseName}-${index}.txt`;
      outputPath = path.join(textOutputFolder, fileName);
    }

    const pdfBuffer = await fs.readFile(pdfPath);
    const data = await pdfParse(pdfBuffer);
    const extractedText = data.text;

    await fs.writeFile(outputPath, extractedText);
    combinedText += extractedText + "\n\n";

    index = 1; // Reset index for the next file to avoid numbering conflicts across files
  }

  // Combine all extracted text into one file
  const combinedTextFilePath = path.join(textOutputFolder, "combined_text.txt");
  await fs.writeFile(combinedTextFilePath, combinedText);

  return combinedTextFilePath;
}

export { extractImagesFromPDFs, extractTextFromPDFs };
