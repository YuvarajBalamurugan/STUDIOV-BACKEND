const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to change the speed of a video
function changeSpeed(inputVideo, speedFactor, outputVideo) {
    ffmpeg(inputVideo)
        .videoFilter(`setpts=${1/speedFactor}*PTS`)
        .audioFilter(`atempo=${speedFactor}`)
        .output(outputVideo)
        .on('end', () => console.log('Video speed change done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Predefined parameters
const inputVideo = path.join(__dirname, 'input/SampleVideo_640x360_10mb.mp4'); // Your input video path
const outputVideo = path.join(__dirname, 'output_speed_changed_video.mp4'); // Your output video path

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask user for speed factor
rl.question('Enter speed factor (e.g., 2 for double speed, 0.5 for half speed): ', (speedFactor) => {
    // Call the changeSpeed function with user input
    changeSpeed(inputVideo, speedFactor, outputVideo);
    rl.close();
});
