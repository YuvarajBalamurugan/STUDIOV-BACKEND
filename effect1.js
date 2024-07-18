const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Overlay text on a video with animation and transitions.
 * @param {string} input - Path to the input video file.
 * @param {string} text - Text to overlay on the video.
 * @param {number} fontSize - Font size of the text.
 * @param {string} fontColor - Font color of the text.
 * @param {number} startX - Starting X position of the text.
 * @param {number} startY - Starting Y position of the text.
 * @param {number} endX - Ending X position of the text.
 * @param {number} endY - Ending Y position of the text.
 * @param {number} animationDuration - Duration (in seconds) of the text animation.
 * @param {number} startTime
 * @param {number} endTime 
 * @param {string} fontFamily - Font family for the text.
 * @param {string} output - Path to the output video file.
 */
function overlayTextWithAnimation(input, text, fontSize, fontColor, startX, startY, endX, endY, animationDuration,startTime,endTime,fontFamily, output) {
    ffmpeg.ffprobe(input, (err, metadata) => {
        if (err) {
            console.error('Error reading video metadata:', err);
            return;
        }

        const duration = metadata.format.duration;

        ffmpeg(input)
            .videoFilter([
                `drawtext=text='${text}':fontfile='font/Kalnia/KalniaGlaze-VariableFont_wdth,wght.ttf':font='${fontFamily}':fontcolor=${fontColor}:fontsize=${fontSize}:x=${startX}+(t-${startTime})*(${endX}-${startX})/${animationDuration}:y=${startY}+(t-${startTime})*(${endY}-${startY})/${animationDuration}:enable='between(t,${startTime},${endTime})'`
            ])
            .output(output)
            .on('end', () => console.log('Text overlay with animation and transitions done'))
            .on('error', err => console.log('Error: ' + err))
            .run();
    });
}

// Predefined parameters
const inputVideo = path.join(__dirname, 'input/SampleVideo_640x360_10mb.mp4'); // Your input video path
const outputVideo = path.join(__dirname, 'output_text_overlay_animation_video.mp4'); // Your output video path
const text = 'Hello, World!'; // Default text
const fontSize = 24; // Default font size
const fontColor = 'black'; // Default font color

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask user for starting and ending X and Y positions, animation duration, font family
rl.question('Enter text to overlay: ', (textInput) => {
    rl.question('Enter starting X position: ', (startX) => {
        rl.question('Enter starting Y position: ', (startY) => {
            rl.question('Enter ending X position: ', (endX) => {
                rl.question('Enter ending Y position: ', (endY) => {
                    rl.question('Enter animation duration (seconds): ', (animationDuration) => {
                        rl.question('Enter starting Time(seconds): ',(startTime) =>{
                            rl.question('Enter the ending Time(seconds): ',(endTime) => {
                        rl.question('Enter font family: ', (fontFamily) => {
                            // Call the overlayTextWithAnimation function with user inputs
                            overlayTextWithAnimation(inputVideo, textInput, fontSize, fontColor, parseFloat(startX), parseFloat(startY), parseFloat(endX), parseFloat(endY), parseFloat(animationDuration),parseFloat(startTime),parseFloat(endTime), fontFamily, outputVideo);
                            rl.close();
                        });
                    });
                });
            });
        });
    });
});
    });
});