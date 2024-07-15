const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to overlay text on a video
function overlayText(input, text, fontSize, fontColor, x, y, output) {
    ffmpeg(input)
        .videoFilter(`drawtext=text='${text}':fontcolor=${fontColor}:fontsize=${fontSize}:x=${x}:y=${y}`)
        .output(output)
        .on('end', () => console.log('Text overlay done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Predefined parameters
const inputVideo = path.join(__dirname, 'input/SampleVideo_640x360_10mb.mp4'); // Your input video path
const outputVideo = path.join(__dirname, 'output_text_overlay_video.mp4'); // Your output video path
const text = 'Hello, World!'; // Text to overlay
const fontSize = 24; // Font size
const fontColor = 'white'; // Font color

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask user for X and Y positions
rl.question('Enter X position: ', (x) => {
    rl.question('Enter Y position: ', (y) => {
        // Call the overlayText function with user inputs
        overlayText(inputVideo, text, fontSize, fontColor, x, y, outputVideo);
        rl.close();
    });
});
