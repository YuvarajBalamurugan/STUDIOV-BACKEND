const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to overlay text on a video
function overlayText(input, text, fontSize, fontColor, x, y, output) {
    ffmpeg(input)
        .videoFilter(`drawtext=text='${text}':fontcolor=${fontColor}:fontsize=${fontSize}:x=${x}:y=${y}`)
        .output(output)
        .on('end', () => console.log('Text overlay done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Example usage
const inputVideo = path.join(__dirname, 'input/SampleVideo_640x360_10mb.mp4'); // Your input video path
const outputVideo = path.join(__dirname, 'output_text_overlay_video.mp4'); // Your output video path
const text = 'Hello, World!'; // Text to overlay
const fontSize = 24; // Font size
const fontColor = 'white'; // Font color (you can use named colors or hex codes)
const x = '(main_w/2-text_w/2)'; // X position (centered horizontally)
const y = '(main_h/2-text_h/2)'; // Y position (centered vertically)

overlayText(inputVideo, text, fontSize, fontColor, x, y, outputVideo);
