const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
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
        .on('end', () => console.log('Audio addition done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Predefined parameters
const inputVideo = path.join(__dirname, 'input/SampleVideo_360x240_1mb.mp4'); // Your input video path
const inputAudio = path.join(__dirname, 'input/Free_Test_Data_2MB_MP3.mp3'); // Your sample audio path
const outputVideo = path.join(__dirname, 'output_with_audio.mp4'); // Your output video path

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user for confirmation
function promptForAudio() {
    rl.question('Do you want to add audio to the video? (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes') {
            addAudio(inputVideo, inputAudio, outputVideo);
        } else {
            console.log('Audio addition canceled.');
        }
        rl.close();
    });
}

// Start the prompt
promptForAudio();
