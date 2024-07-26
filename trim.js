const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const readline = require('readline');

// Function to trim video
function trimVideo(inputFile, startTime, duration, outputFile) {
  ffmpeg(inputFile)
    .setStartTime(startTime)
    .setDuration(duration)
    .on('end', () => {
      console.log(`Trimmed video created at ${outputFile}`);
    })
    .on('error', (err) => {
      console.log(`Error: ${err.message}`);
    })
    .save(outputFile);
}

// Function to get user input
function getUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let inputFile;
  let startTime;
  let duration;

  rl.question('Enter input video file path: ', (answer) => {
    inputFile = answer;
    if (!fs.existsSync(inputFile)) {
      console.log('File does not exist. Please try again.');
      rl.close();
      return;
    }

    rl.question('Enter start time (in seconds): ', (answer) => {
      startTime = answer;

      rl.question('Enter duration (in seconds): ', (answer) => {
        duration = answer;

    
          const outputFile = 'outputTrim.mp4';
          rl.close();
          trimVideo(inputFile, startTime, duration, outputFile);
        });
      });
    });
}

// Start the input process
getUserInput();
