import fs from "fs-extra";
import path from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import unzipper from "unzipper";
import * as mammoth from "mammoth";
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Function to extract images from Word files (DOCX)
async function extractImagesFromWordDocs(docxPaths: string[], outputFolder: string) {
  // Ensure the output folder exists
  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder);
  }

  const fileNameCount: { [key: string]: number } = {};

  for (const docxPath of docxPaths) {
    const baseName = path.basename(docxPath, path.extname(docxPath));
    let folderName = baseName;

    // Append a number to folder name if it already exists
    if (fileNameCount[baseName]) {
      fileNameCount[baseName]++;
      folderName = `${baseName}-${fileNameCount[baseName]}`;
    } else {
      fileNameCount[baseName] = 1;
    }

    const outputDir = path.join(outputFolder, folderName);

    // Ensure directory for the DOCX exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir);
    }

    try {
      // Unzip the DOCX file to extract images
      const zip = fs.createReadStream(docxPath).pipe(unzipper.Parse({ forceStream: true }));

      for await (const entry of zip) {
        const entryPath = entry.path;
        const extname = path.extname(entryPath).toLowerCase();

        // Check if the file is an image (you can add more extensions if necessary)
        if ([".jpeg", ".jpg", ".png", ".gif"].includes(extname)) {
          const imgPath = path.join(outputDir, path.basename(entryPath));
          entry.pipe(fs.createWriteStream(imgPath)); // Save image
        } else {
          entry.autodrain(); // Skip non-image files
        }
      }

      console.log(`Extracted images from ${docxPath} and saved to ${outputDir}`);
    } catch (error) {
      console.error(`Error extracting images from ${docxPath}:`, error);
    }
  }
}

// Function to extract text from Word files and store in separate files
async function extractTextFromWordDocs(docxPaths: string[]): Promise<string> {
  const textOutputFolder = path.join(__dirname, "word_text"); // Adjusted to use absolute path to store text files
  await fs.ensureDir(textOutputFolder); // Ensure the output folder exists

  let combinedText = "";
  let index = 1;

  for (const docxPath of docxPaths) {
    const baseName = path.basename(docxPath, path.extname(docxPath));
    let fileName = `${baseName}-${index}.txt`; // Create unique file names to avoid overwriting

    let outputPath = path.join(textOutputFolder, fileName);

    // Ensure unique file name (if file already exists, append a number)
    while (await fs.pathExists(outputPath)) {
      index++;
      fileName = `${baseName}-${index}.txt`;
      outputPath = path.join(textOutputFolder, fileName);
    }

    // Extract text using mammoth
    const result = await mammoth.extractRawText({ path: docxPath });
    const extractedText = result.value;

    await fs.writeFile(outputPath, extractedText);
    combinedText += extractedText + "\n\n";

    index = 1; // Reset index for the next file to avoid numbering conflicts across files
  }

  // Combine all extracted text into one file
  const combinedTextFilePath = path.join(textOutputFolder, "combined_text.txt");
  await fs.writeFile(combinedTextFilePath, combinedText);

  return combinedTextFilePath;
}

async function replaceInFile(
    filePath: string,
    pattern: RegExp,
    replacement: string,
    outputFilePath?: string // Optional parameter for saving the modified file
  ): Promise<boolean> {
    try {
      // Check if the file exists
      if (!(await fs.pathExists(filePath))) {
        console.error(`Error: File "${filePath}" does not exist.`);
        return false;
      }
  
      // Read the DOCX file
      const fileBuffer = await fs.readFile(filePath);
  
      // Extract text from the DOCX file using mammoth
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      let docText = result.value;
  
      // Check if the pattern exists in the document text
      if (!pattern.test(docText)) {
        console.log("Pattern not found, no replacement made.");
        return false; // No changes made
      }
  
      // Replace occurrences of the pattern in the document text
      docText = docText.replace(pattern, replacement);
  
      // Create a new document with the replaced text
      const updatedDocument = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(docText), // Add the replaced text as a TextRun
                ],
              }),
            ],
          },
        ],
      });
  
      // Convert the updated document to a buffer
      const updatedBuffer = await Packer.toBuffer(updatedDocument);
  
      // Determine where to save the modified file
      const savePath = outputFilePath ?? filePath; // Save to outputFilePath if provided, else overwrite
  
      // Save the updated content to the DOCX file
      await fs.writeFile(savePath, updatedBuffer);
  
      console.log(`Replacement successful! Saved at: ${savePath}`);
      return true; // Replacement successful
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
      return false; // Failure
    }
  }
  
export { extractImagesFromWordDocs, extractTextFromWordDocs,replaceInFile };
