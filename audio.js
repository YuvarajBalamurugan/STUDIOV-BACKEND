const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to add audio to a video
function addAudio(inputVideo, inputAudio, outputVideo) {
    ffmpeg(inputVideo)
        .input(inputAudio)
        .outputOptions('-c:v copy') // Copy the video stream without re-encoding
        .outputOptions('-c:a aac')  // Encode the audio to AAC
        .outputOptions('-map 0:v:0') // Map the video stream
        .outputOptions('-map 1:a:0') // Map the audio stream
        .outputOptions('-shortest')  // Make the output duration the same as the shorter input (video or audio)
        .output(outputVideo)
        .on('end', () => console.log(`Audio added successfully. Output saved to ${outputVideo}`))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input and add audio to the video
function getUserInput() {
    rl.question('Enter the path to the input video file: ', (inputVideo) => {
        if (!fs.existsSync(inputVideo)) {
            console.log('Input video file does not exist. Please try again.');
            return getUserInput(); // Retry if file does not exist
        }

        rl.question('Enter the path to the input audio file: ', (inputAudio) => {
            if (!fs.existsSync(inputAudio)) {
                console.log('Input audio file does not exist. Please try again.');
                return getUserInput(); // Retry if file does not exist
            }
            const outputVideo='outputAudio.mp4';
            rl.close();
            addAudio(inputVideo, inputAudio, outputVideo);
            });
        });
}

// Start the prompt
getUserInput();
