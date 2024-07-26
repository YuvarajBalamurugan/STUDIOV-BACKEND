const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to apply video effect
function applyEffect(inputVideo, effect, outputVideo) {
    ffmpeg(inputVideo)
        .videoFilter(effect)
        .output(outputVideo)
        .on('end', () => console.log('Effect applied'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Predefined parameters
const inputVideo = path.join(__dirname, 'input/SampleVideo_360x240_1mb.mp4'); // Your input video path
const outputVideo = path.join(__dirname, 'output_with_effect.mp4'); // Your output video path

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input for brightness/contrast effect
function getBrightnessContrastInput(callback) {
    rl.question('Enter brightness (-1 to 1): ', (brightness) => {
        rl.question('Enter contrast (-2 to 2): ', (contrast) => {
            callback(`eq=brightness=${brightness}:contrast=${contrast}`);
        });
    });
}

// Function to get user input for blur effect
function getBlurInput(callback) {
    rl.question('Enter blur level (horizontal:vertical): ', (blurLevel) => {
        callback(`boxblur=${blurLevel}`);
    });
}

// Function to get user input for text overlay effect
function getTextOverlayInput(callback) {
    rl.question('Enter text to overlay: ', (text) => {
        rl.question('Enter font size: ', (fontSize) => {
            rl.question('Enter font color (e.g., white, #FFFFFF): ', (fontColor) => {
                rl.question('Enter X position: ', (w) => {
                    rl.question('Enter Y position: ', (h) => {
                callback(`drawtext=text='${text}':fontcolor=${fontColor}:fontsize=${fontSize}:x=${w}:y=${h}`);
            });
        });
    });
});
});
}

// Function to prompt user for effect and get additional input if needed
function promptForEffect() {
    rl.question('Enter the effect (brightness, blur, sharpen, grayscale, sepia, negative, speed, rotate, crop, text): ', (effect) => {
        switch (effect) {
            case 'brightness':
                getBrightnessContrastInput(effectCommand => {
                    applyEffect(inputVideo, effectCommand, outputVideo);
                    rl.close();
                });
                break;
            case 'blur':
                getBlurInput(effectCommand => {
                    applyEffect(inputVideo, effectCommand, outputVideo);
                    rl.close();
                });
                break;
            case 'sharpen':
                applyEffect(inputVideo, 'unsharp=5:5:1.0:5:5:0.0', outputVideo);
                rl.close();
                break;
            case 'grayscale':
                applyEffect(inputVideo, 'hue=s=0', outputVideo);
                rl.close();
                break;
            case 'sepia':
                applyEffect(inputVideo, 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131', outputVideo);
                rl.close();
                break;
            case 'negative':
                applyEffect(inputVideo, 'negate', outputVideo);
                rl.close();
                break;
            case 'speed':
                rl.question('Enter speed factor (e.g., 0.5 for 2x speed, 2 for half speed): ', (speedFactor) => {
                    applyEffect(inputVideo, `setpts=${speedFactor}*PTS`, outputVideo);
                    rl.close();
                });
                break;
            case 'rotate':
                applyEffect(inputVideo, 'transpose=1', outputVideo); // Rotate 90 degrees clockwise
                rl.close();
                break;
            case 'crop':
                rl.question('Enter crop parameters (width:height:x:y): ', (cropParams) => {
                    applyEffect(inputVideo, `crop=${cropParams}`, outputVideo);
                    rl.close();
                });
                break;
            case 'text':
                getTextOverlayInput(effectCommand => {
                    applyEffect(inputVideo, effectCommand, outputVideo);
                    rl.close();
                });
                break;
            default:
                console.log('Invalid effect');
                rl.close();
        }
    });
}

// Start the prompt
promptForEffect();
