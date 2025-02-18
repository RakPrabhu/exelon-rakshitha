import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

const inputVideo = "src/services/v1/watermark/input.mp4";  // Path to your input video
const watermarkImage = "src/services/v1/watermark/watermark.png"; // Path to your watermark image
const outputVideo = "src/services/v1/watermark/output.mp4"; // Specify the output file name

// Check if input files exist
if (!fs.existsSync(inputVideo) || !fs.existsSync(watermarkImage)) {
  console.error("Input video or watermark image not found!");
  process.exit(1);
}

ffmpeg(inputVideo)
  .outputOptions([
    "-i", watermarkImage, // Add watermark image as input
    "-filter_complex", 
    "[1]scale=200:-1,format=rgba,colorchannelmixer=aa=0.3[wm];[0][wm]overlay=W-w-10:H-h-10,format=yuv420p" // Resize watermark and overlay it
  ])
  .output(outputVideo)
  .on("start", () => console.log("Processing..."))
  .on("progress", (progress) => {
    console.log(`Processing: ${progress.percent}% done`);
  })
  .on("end", () => console.log("Watermark added successfully!"))
  .on("error", (err) => console.error("Error: ", err))
  .run();
