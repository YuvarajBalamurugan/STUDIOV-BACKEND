const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to add audio to a video with start time, duration, and when the audio should start playing in the video
function addAudio(inputVideo, inputAudio, outputVideo, audioStartTime, audioDuration, videoStartTime) {
    ffmpeg()
        .input(inputVideo)
        .input(inputAudio)
        .complexFilter([
            `[1:a]atrim=start=${audioStartTime}:duration=${audioDuration},asetpts=PTS-STARTPTS[aud]`, // Trim and set start time for audio
            `[0:v]null[vid]`, // Pass video unchanged
            `[vid][aud]concat=n=1:v=1:a=1[v][a]`, // Concatenate video and trimmed audio
            `[a]adelay=${videoStartTime * 1000}|${videoStartTime * 1000}[a]` // Delay audio start in the video
        ])
        .map('[v]') // Map video stream
        .map('[a]') // Map audio stream
        .outputOptions([
            '-c:v libx264', // Re-encode video to ensure compatibility
            '-c:a aac',  // Encode the audio to AAC
            '-shortest'  // Make the output duration the same as the shorter input (video or audio)
        ])
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

            rl.question('Enter the start time of the audio in seconds (e.g., 10): ', (audioStartTime) => {
                rl.question('Enter the duration of the audio in seconds (e.g., 30): ', (audioDuration) => {
                    rl.question('Enter the time when the audio should start in the video in seconds (e.g., 5): ', (videoStartTime) => {
                        const outputVideo = 'OutputAudio1.mp4';
                        addAudio(inputVideo, inputAudio, outputVideo, audioStartTime, audioDuration, videoStartTime);
                        rl.close();
                    });
                });
            });
        });
    });
}

// Start the prompt
getUserInput();
