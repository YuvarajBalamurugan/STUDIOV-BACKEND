const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const readline = require('readline');

// Function to merge videos
function mergeVideos(videoFiles, outputFile) {
  if (videoFiles.length === 0) {
    console.log('No video files provided');
    return;
  }

  const mergedVideo = ffmpeg();

  videoFiles.forEach((file) => {
    mergedVideo.input(file);
  });

  mergedVideo
    .on('end', () => {
      console.log(`Merged video created at ${outputFile}`);
    })
    .on('error', (err) => {
      console.log(`Error: ${err.message}`);
    })
    .mergeToFile(outputFile, './tempdir');
}

// Function to get user input
function getUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const videoFiles = [];

  function askForFile() {
    rl.question('Enter video file path (or type "done" to finish): ', (answer) => {
      if (answer.toLowerCase() === 'done') {
        rl.close();
        mergeVideos(videoFiles, 'outputConcatenate.mp4');
      } else {
        if (fs.existsSync(answer)) {
          videoFiles.push(answer);
          askForFile();
        } else {
          console.log('File does not exist. Please try again.');
          askForFile();
        }
      }
    });
  }

  askForFile();
}

// Start the input process
getUserInput();
