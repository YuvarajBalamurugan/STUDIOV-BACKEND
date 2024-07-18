const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to overlay text on a video with movement and transitions
function overlayTextWithMovementAndTransitions(input, text, fontSize, fontColor, startX, startY, endX, endY, fontFamily, output) {
    const words = text.split(' ');

    const filters = words.map((word, index) => {
        const delay = index * 1; // Delay each word's transition

        return {
            filter: 'drawtext',
            options: {
                text: word,
                fontfile: 'font/NotoSans/NotoSans-VariableFont_wdth,wght.ttf', // Adjust font file path
                fontcolor: fontColor,
                fontsize: fontSize,
                x: `if(gte(t,${delay}),${endX},${startX}+(t-${delay})*(${endX}-${startX})/1)`,
                y: `if(gte(t,${delay}),${endY},${startY}+(t-${delay})*(${endY}-${startY})/1)`,
                enable: `gte(t,${delay})`
            }
        };
    });

    const filterString = filters.map(f => {
        const optionsString = Object.entries(f.options).map(([k, v]) => `${k}=${v}`).join(':');
        return `${f.filter}=${optionsString}`;
    }).join(',');

    console.log('Filter String:', filterString);

    ffmpeg(input)
        .complexFilter(filterString)
        .output(output)
        .on('end', () => console.log('Text overlay with movement and transitions done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Predefined parameters
const inputVideo = path.join(__dirname, 'input/SampleVideo_640x360_10mb.mp4'); // Your input video path
const outputVideo = path.join(__dirname, 'output_text_overlay_with_movement.mp4'); // Your output video path

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask user for text, font size, font color, font family, starting and ending positions
rl.question('Enter text to overlay: ', (text) => {
    rl.question('Enter font size: ', (fontSize) => {
        rl.question('Enter font color (e.g., white, red, #FF0000): ', (fontColor) => {
            rl.question('Enter font family: ', (fontFamily) => {
                rl.question('Enter starting X position: ', (startX) => {
                    rl.question('Enter starting Y position: ', (startY) => {
                        rl.question('Enter ending X position: ', (endX) => {
                            rl.question('Enter ending Y position: ', (endY) => {
                                // Call the overlayTextWithMovementAndTransitions function with user inputs
                                overlayTextWithMovementAndTransitions(
                                    inputVideo,
                                    text,
                                    parseInt(fontSize),
                                    fontColor,
                                    parseFloat(startX),
                                    parseFloat(startY),
                                    parseFloat(endX),
                                    parseFloat(endY),
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
