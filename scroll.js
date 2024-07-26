const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Overlay text on a video with scrolling movement across the screen and then stop at a specific position.
 * @param {string} input - Path to the input video file.
 * @param {string} text - Text to overlay on the video.
 * @param {number} fontSize - Font size of the text.
 * @param {string} fontColor - Font color of the text.
 * @param {number} startX - Starting X position of the text.
 * @param {number} startY - Starting Y position of the text.
 * @param {number} stopX - X position where the text should stop.
 * @param {number} stopY - Y position where the text should stop.
 * @param {string} fontFamily - Font family for the text.
 * @param {string} output - Path to the output video file.
 */
function overlayTextWithScrollAndStop(input, text, fontSize, fontColor, startX, startY, stopX, stopY, fontFamily, output) {
    ffmpeg.ffprobe(input, (err, metadata) => {
        if (err) {
            console.error('Error reading video metadata:', err);
            return;
        }

        const duration = metadata.format.duration;
        const videoWidth = metadata.streams[0].width;

        // Duration to scroll across the entire width of the video
        const scrollDuration = 5; // Duration for the text to scroll out of the video frame (in seconds)

        ffmpeg(input)
            .videoFilter([
                `drawtext=text='${text}':fontfile='font/NotoSans/NotoSans-VariableFont_wdth,wght.ttf':font='${fontFamily}':fontcolor=${fontColor}:fontsize=${fontSize}:x='if(lt(t,${scrollDuration}),w-(t/${scrollDuration})*(w+tw),${stopX})':y='if(lt(t,${scrollDuration}),${startY},${stopY})'`
            ])
            .output(output)
            .on('end', () => console.log('Text overlay with scrolling and stopping done'))
            .on('error', err => console.log('Error: ' + err))
            .run();
    });
}

// Predefined parameters
const inputVideo = path.join(__dirname, 'input/SampleVideo_640x360_10mb.mp4'); // Your input video path
const outputVideo = path.join(__dirname, 'output_text_overlay_scrolling_video.mp4'); // Your output video path
const text = 'Hello, World!'; // Default text
const fontSize = 24; // Default font size
const fontColor = 'black'; // Default font color

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask user for starting position, stopping position, and font family
rl.question('Enter text to overlay: ', (textInput) => {
    rl.question('Enter starting X position: ', (startX) => {
        rl.question('Enter starting Y position: ', (startY) => {
            rl.question('Enter stopping X position: ', (stopX) => {
                rl.question('Enter stopping Y position: ', (stopY) => {
                    rl.question('Enter font size: ', (fontSizeInput) => {
                        rl.question('Enter font color (e.g., white, red, #FF0000): ', (fontColorInput) => {
                            rl.question('Enter font family: ', (fontFamily) => {
                                // Call the overlayTextWithScrollAndStop function with user inputs
                                overlayTextWithScrollAndStop(
                                    inputVideo,
                                    textInput,
                                    parseInt(fontSizeInput),
                                    fontColorInput,
                                    parseFloat(startX),
                                    parseFloat(startY),
                                    parseFloat(stopX),
                                    parseFloat(stopY),
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
