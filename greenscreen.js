const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to apply chroma key effect and overlay background image
function applyChromaKey(inputVideo, inputImage, chromaColor, outputVideo) {
    ffmpeg(inputVideo)
        .input(inputImage)
        .complexFilter([
            {
                filter: 'chromakey',
                options: {
                    color: chromaColor,
                    similarity: 0.1, // Adjust as needed
                    blend: 0.0 // Adjust as needed
                },
                inputs: '0:v',
                outputs: 'ckout'
            },
            {
                filter: 'overlay',
                options: {
                    x: 0,
                    y: 0,
                    format: 'rgb',  // Adjust format as needed
                    eof_action: 'pass'  // Adjust eof_action as needed
                },
                inputs: ['ckout', '1:v'],
                outputs: 'v'
            }
        ])
        .outputOptions('-map', '[v]')
        .outputOptions('-map', '0:a?')
        .output(outputVideo)
        .on('end', () => console.log('Chroma key effect applied successfully'))
        .on('error', err => console.log('Error: ' + err.message))
        .run();
}

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user for inputs
function promptForInputs() {
    rl.question('Enter the path for the video file: ', (videoPath) => {
        rl.question('Enter the path for the background image: ', (imagePath) => {
            rl.question('Enter the chroma key color (e.g., 0x00FF00 for green): ', (chromaColor) => {
                const outputVideo = path.join(__dirname, 'output_chroma_key.mp4'); // Output video path
                applyChromaKey(videoPath, imagePath, chromaColor, outputVideo);
                rl.close();
            });
        });
    });
}

// Start the prompt for user inputs
promptForInputs();
