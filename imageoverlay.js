const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to overlay a scaled image on a video
function overlayImage(inputVideo, inputImage, x, y, width, height, outputVideo) {
    ffmpeg(inputVideo)
        .input(inputImage)
        .complexFilter([
            {
                filter: 'scale',
                options: {
                    w: width,
                    h: height
                },
                inputs: '[1]',
                outputs: 'scaledImage'
            },
            {
                filter: 'overlay',
                options: {
                    x: x,
                    y: y
                },
                inputs: '[0][scaledImage]',
                outputs: 'finalOutput'
            }
        ])
        .outputOptions('-map', '[finalOutput]')
        .output(outputVideo)
        .on('end', () => console.log('Image overlay done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Predefined parameters
const inputVideo = path.join(__dirname, 'input/SampleVideo_640x360_10mb.mp4'); // Your input video path
const inputImage = path.join(__dirname, 'input/wp10992231.jpg'); // Your input image path
const outputVideo = path.join(__dirname, 'output_image_overlay_video.mp4'); // Your output video path

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask user for X and Y positions and width and height for scaling
rl.question('Enter X position: ', (x) => {
    rl.question('Enter Y position: ', (y) => {
        rl.question('Enter image width: ', (width) => {
            rl.question('Enter image height: ', (height) => {
                // Call the overlayImage function with user inputs
                overlayImage(inputVideo, inputImage, x, y, width, height, outputVideo);
                rl.close();
            });
        });
    });
});
