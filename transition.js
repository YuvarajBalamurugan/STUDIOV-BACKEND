const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const readline = require('readline');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to apply fade in/out effect
function fadeInOut(inputVideo, outputVideo) {
    ffmpeg(inputVideo)
        .videoFilter([
            'fade=in:0:30',   // Fade in from frame 0 to 30
            'fade=out:100:30' // Fade out from frame 100 to 130
        ])
        .output(outputVideo)
        .on('end', () => console.log('Fade in/out effect done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to apply transition effects
function applyTransition(effect, inputVideo1, inputVideo2, outputVideo) {
    let complexFilter = '';

    switch (effect) {
        case 'crossfade':
            complexFilter = '[0:v][1:v]xfade=transition=fade:duration=1:offset=4[v]';
            break;
        case 'slide':
            complexFilter = '[0:v][1:v]xfade=transition=slideleft:duration=1:offset=4[v]';
            break;
        case 'slideup':
            complexFilter = '[0:v][1:v]xfade=transition=slideup:duration=1:offset=4[v]';
            break;
        case 'slidedown':
            complexFilter = '[0:v][1:v]xfade=transition=slidedown:duration=1:offset=4[v]';
            break;
        case 'wipe':
            complexFilter = '[0:v][1:v]xfade=transition=wiperight:duration=1:offset=4[v]';
            break;
        case 'wipeleft':
            complexFilter = '[0:v][1:v]xfade=transition=wipeleft:duration=1:offset=4[v]';
            break;
        case 'wipedown':
            complexFilter = '[0:v][1:v]xfade=transition=wipedown:duration=1:offset=4[v]';
            break;
        case 'dissolve':
            complexFilter = '[0:v][1:v]xfade=transition=dissolve:duration=1:offset=4[v]';
            break;
        case 'fadeblack':
            complexFilter = '[0:v][1:v]xfade=transition=fadeblack:duration=1:offset=4[v]';
            break;
        case 'fadewhite':
            complexFilter = '[0:v][1:v]xfade=transition=fadewhite:duration=1:offset=4[v]';
            break;
        case 'circleopen':
            complexFilter = '[0:v][1:v]xfade=transition=circleopen:duration=1:offset=4[v]';
            break;
        case 'circleclose':
            complexFilter = '[0:v][1:v]xfade=transition=circleclose:duration=1:offset=4[v]';
            break;
        default:
            console.log('Invalid transition effect');
            return;
    }

    ffmpeg()
        .input(inputVideo1)
        .input(inputVideo2)
        .complexFilter(complexFilter)
        .outputOptions('-map', '[v]')
        .output(outputVideo)
        .on('end', () => console.log(`${effect} effect done`))
        .on('error', err => console.log('Error: ' + err.message))
        .run();
}

// Predefined parameters
const inputVideo1 = path.join(__dirname, 'input/transition1.mp4'); // Your first input video path
const inputVideo2 = path.join(__dirname, 'input/transition2.mp4'); // Your second input video path

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user for transition effect and apply it
function promptForTransition() {
    rl.question('Enter the transition effect (fade, crossfade, slide, slideup, slidedown, wipe, wipeleft, wipedown, dissolve, fadeblack, fadewhite, circleopen, circleclose): ', (effect) => {
        const outputVideo = path.join(__dirname, `output_${effect}.mp4`); // Your output video path

        if (effect === 'fade') {
            fadeInOut(inputVideo1, outputVideo);
        } else {
            applyTransition(effect, inputVideo1, inputVideo2, outputVideo);
        }

        rl.close();
    });
}

// Start the prompt
promptForTransition();
