import fs from 'fs';
import path from 'path';
import { getDocument } from 'pdfjs-dist';

async function extractImagesFromPDF(pdfPath: string, outputDir: string) {
    try {
        // Read the PDF file as a Buffer (this should be a Buffer, not a number)
        const pdfData = fs.readFileSync(pdfPath);  // pdfData will be a Buffer
        
        // Ensure pdfData is passed as an ArrayBuffer (Buffer in Node.js is compatible with ArrayBuffer)
        const pdfDoc = await getDocument(pdfData).promise; // pdfData is valid here

        const extractedImages: string[] = [];

        // Iterate through all pages
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);

            // Extract images (you can customize this part further)
            const opList = await page.getOperatorList();
            const images = opList.fnArray.filter((fn: number) => fn === 1);  // Check for image operators

            for (const image of images) {
                // Handle image extraction here (you need to parse image data)
                const imagePath = path.join(outputDir, `image_${pageNum}.jpg`);
                fs.writeFileSync(imagePath, image);  // Save image (this is just an example)
                extractedImages.push(imagePath);
            }
        }

        return extractedImages;
    } catch (error) {
        console.error('Error extracting images from PDF:', error);
        throw error;
    }
}
