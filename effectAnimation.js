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
 * @param {number} moveDuration - Duration of the text movement in seconds.
 * @param {number} textDuration - Duration for the text to be present in the video.
 * @param {string} fontFamily - Font family for the text.
 * @param {string} output - Path to the output video file.
 */
function overlayTextWithAnimation(input, text, fontSize, fontColor, startX, startY, endX, endY, moveDuration, textDuration, fontFamily, output) {
    ffmpeg.ffprobe(input, (err, metadata) => {
        if (err) {
            console.error('Error reading video metadata:', err);
            return;
        }

        const filters = [
            `drawtext=text='${text}':fontfile='font/NotoSans/NotoSans-VariableFont_wdth,wght.ttf':font='${fontFamily}':fontcolor=${fontColor}:fontsize=${fontSize}:x='if(lt(t,${moveDuration}),(${startX})+t*(${endX}-${startX})/${moveDuration},${endX})':y='if(lt(t,${moveDuration}),(${startY})+t*(${endY}-${startY})/${moveDuration},${endY})':enable='between(t,0,${textDuration})'`
        ];

        // Log the filter for debugging
        console.log('Applying video filter:', filters);

        ffmpeg(input)
            .videoFilter(filters)
            .output(output)
            .on('end', () => console.log('Text overlay with animation and transitions done'))
            .on('error', err => console.error('Error: ' + err.message))
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

// Ask user for starting and ending X and Y positions, font family, movement duration, and text duration
rl.question('Enter text to overlay: ', (textInput) => {
    rl.question('Enter starting X position: ', (startX) => {
        rl.question('Enter starting Y position: ', (startY) => {
            rl.question('Enter ending X position: ', (endX) => {
                rl.question('Enter ending Y position: ', (endY) => {
                    rl.question('Enter font size: ', (fontSizeInput) => {
                        rl.question('Enter font color (e.g., white, red, #FF0000): ', (fontColorInput) => {
                            rl.question('Enter font family: ', (fontFamily) => {
                                rl.question('Enter movement duration (seconds): ', (moveDuration) => {
                                    rl.question('Enter text duration (seconds): ', (textDuration) => {
                                        // Call the overlayTextWithAnimation function with user inputs
                                        overlayTextWithAnimation(
                                            inputVideo,
                                            textInput,
                                            parseInt(fontSizeInput),
                                            fontColorInput,
                                            parseFloat(startX),
                                            parseFloat(startY),
                                            parseFloat(endX),
                                            parseFloat(endY),
                                            parseFloat(moveDuration),
                                            parseFloat(textDuration),
                                            fontFamily,
                                            outputVideo
                                        );
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
});
