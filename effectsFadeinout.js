const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Overlay text on a video with transition effects.
 * @param {string} input - Path to the input video file.
 * @param {string} text - Text to overlay on the video.
 * @param {number} fontSize - Font size of the text.
 * @param {string} fontColor - Font color of the text.
 * @param {number} x - X position of the text.
 * @param {number} y - Y position of the text.
 * @param {number} startTime - Time (in seconds) when the text starts appearing.
 * @param {number} duration - Duration (in seconds) for which the text remains on the screen.
 * @param {number} fadeInDuration - Duration (in seconds) for the text to fade in.
 * @param {number} fadeOutDuration - Duration (in seconds) for the text to fade out.
 * @param {string} fontFamily - Font family for the text.
 * @param {string} output - Path to the output video file.
 */
function overlayTextWithTransitions(input, text, fontSize, fontColor, x, y, startTime, duration, fadeInDuration, fadeOutDuration, fontFamily, output) {
    ffmpeg.ffprobe(input, (err, metadata) => {
        if (err) {
            console.error('Error reading video metadata:', err);
            return;
        }

        const videoDuration = metadata.format.duration;

        ffmpeg(input)
            .videoFilter([
                `drawtext=text='${text}':fontfile='font/NotoSans/NotoSans-VariableFont_wdth,wght.ttf':font='${fontFamily}':fontcolor=${fontColor}:fontsize=${fontSize}:x=${x}:y=${y}:alpha='if(lt(t,${startTime}),0, if(lt(t,${startTime + fadeInDuration}), (t-${startTime})/${fadeInDuration}, if(lt(t,${startTime + duration - fadeOutDuration}), 1, if(lt(t,${startTime + duration}), ((${startTime + duration})-t)/${fadeOutDuration}, 0))))'`
            ])
            .output(output)
            .on('end', () => console.log('Text overlay with transitions done'))
            .on('error', err => console.log('Error: ' + err))
            .run();
    });
}

// Predefined parameters
const inputVideo = path.join(__dirname, 'input/SampleVideo_640x360_10mb.mp4'); // Your input video path
const outputVideo = path.join(__dirname, 'output_text_overlay_transition_video.mp4'); // Your output video path
const text = 'Welcome to the Show!'; // Default text
const fontSize = 48; // Default font size
const fontColor = 'white'; // Default font color

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask user for text, position, timing, and transition details
rl.question('Enter text to overlay: ', (textInput) => {
    rl.question('Enter X position: ', (x) => {
        rl.question('Enter Y position: ', (y) => {
            rl.question('Enter start time (seconds): ', (startTime) => {
                rl.question('Enter duration (seconds): ', (duration) => {
                    rl.question('Enter fade-in duration (seconds): ', (fadeInDuration) => {
                        rl.question('Enter fade-out duration (seconds): ', (fadeOutDuration) => {
                            rl.question('Enter font size: ', (fontSizeInput) => {
                                rl.question('Enter font color (e.g., white, red, #FF0000): ', (fontColorInput) => {
                                    rl.question('Enter font family: ', (fontFamily) => {
                                        // Call the overlayTextWithTransitions function with user inputs
                                        overlayTextWithTransitions(
                                            inputVideo,
                                            textInput,
                                            parseInt(fontSizeInput),
                                            fontColorInput,
                                            parseFloat(x),
                                            parseFloat(y),
                                            parseFloat(startTime),
                                            parseFloat(duration),
                                            parseFloat(fadeInDuration),
                                            parseFloat(fadeOutDuration),
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
