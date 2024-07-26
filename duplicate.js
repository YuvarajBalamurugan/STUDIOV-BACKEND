const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to duplicate a video file once
function duplicateVideo(inputFile, outputFile) {
  if (!fs.existsSync(inputFile)) {
    console.log('Input file does not exist.');
    rl.close();
    return;
  }

  ffmpeg(inputFile)
    .on('end', () => {
      console.log(`Video duplicated successfully. Output saved to ${outputFile}`);
      rl.close();
    })
    .on('error', (err) => {
      console.log(`Error: ${err.message}`);
      rl.close();
    })
    .save(outputFile);
}

// Function to get user input
function getUserInput() {
  rl.question('Enter input video file path: ', (inputFile) => {
    if (!fs.existsSync(inputFile)) {
      console.log('File does not exist. Please try again.');
      return getUserInput(); // Retry if file does not exist
    }
    const outputFile='outputDuplicate.mp4';
    duplicateVideo(inputFile, outputFile);
  });
}

// Start the input process
getUserInput();
