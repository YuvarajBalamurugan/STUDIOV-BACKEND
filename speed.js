const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const readline = require('readline');

// Function to change video speed
function changeVideoSpeed(inputFile, speedFactor, outputFile) {
  ffmpeg(inputFile)
    .videoFilters(`setpts=${1 / speedFactor}*PTS`)
    .on('end', () => {
      console.log(`Video speed changed and saved to ${outputFile}`);
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
  let speedFactor;
  let outputFile;

  rl.question('Enter input video file path: ', (answer) => {
    inputFile = answer;
    if (!fs.existsSync(inputFile)) {
      console.log('File does not exist. Please try again.');
      rl.close();
      return;
    }

    rl.question('Enter speed factor (e.g., 2 for double speed, 0.5 for half speed): ', (answer) => {
      speedFactor = parseFloat(answer);
      if (isNaN(speedFactor) || speedFactor <= 0) {
        console.log('Invalid speed factor. Please enter a positive number.');
        rl.close();
        return;
      }

        const outputFile='outputSpeed.mp4';
        changeVideoSpeed(inputFile, speedFactor, outputFile);
      });
    });
 
}

// Start the input process
getUserInput();

