const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const { exec } = require('child_process');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to trim a video
function trimVideo(input, startTime, duration, output) {
    ffmpeg(input)
        .setStartTime(startTime)
        .setDuration(duration)
        .output(output)
        .on('end', () => console.log('Trimming done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to concatenate videos
function concatenateVideos(inputs, output) {
    const filelist = 'filelist1.txt';
    fs.writeFileSync(filelist, inputs.map(file => `file '${file}'`).join('\n'));

    const concatCommand = `ffmpeg -f concat -safe 0 -i ${filelist} -c copy ${output}`;
    exec(concatCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
    });
}

// Function to apply a grayscale effect
function applyGrayscale(input, output) {
    ffmpeg(input)
        .videoFilter('hue=s=0')
        .output(output)
        .on('end', () => console.log('Grayscale effect applied'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to extract audio from video
function extractAudio(input, output) {
    ffmpeg(input)
        .output(output)
        .audioCodec('copy')
        .noVideo()
        .on('end', () => console.log('Audio extraction done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to apply a blur video filter
function applyBlur(input, output) {
    ffmpeg(input)
        .videoFilter('boxblur=10:1')
        .output(output)
        .on('end', () => console.log('Blur effect applied'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to increase audio volume
function increaseVolume(input, output) {
    ffmpeg(input)
        .audioFilter('volume=2.0')
        .output(output)
        .on('end', () => console.log('Volume increased'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to duplicate a video
function duplicateVideo(input, output) {
    ffmpeg(input)
        .output(output)
        .on('end', () => console.log('Duplication done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to change video resolution
function changeResolution(input, width, height, output) {
    ffmpeg(input)
        .videoFilter(`scale=${width}:${height}`)
        .output(output)
        .on('end', () => console.log('Resolution changed'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to change video speed
function changeSpeed(input, speed, output) {
    const pts = 1 / speed;
    ffmpeg(input)
        .videoFilter(`setpts=${pts}*PTS`)
        .audioFilter(`atempo=${speed}`)
        .output(output)
        .on('end', () => console.log('Speed changed'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to cut a specific part of a video
function cutVideo(input, startTime, duration, output) {
    ffmpeg(input)
        .setStartTime(startTime)
        .setDuration(duration)
        .output(output)
        .on('end', () => console.log('Cutting done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}


// Function to crop a video
function cropVideo(input, width, height, x, y, output) {
    ffmpeg(input)
        .videoFilter(`crop=${width}:${height}:${x}:${y}`)
        .output(output)
        .on('end', () => console.log('Cropping done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to replace audio in a video
function replaceAudio(videoInput, audioInput, output) {
    ffmpeg()
        .input(videoInput)
        .input(audioInput)
        .outputOptions('-map 0:v:0 -map 1:a:0')
        .output(output)
        .on('end', () => console.log('Audio replacement done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to adjust audio volume
function adjustVolume(input, output, dB) {
    ffmpeg(input)
        .audioFilter(`volume=${dB}dB`)
        .output(output)
        .on('end', () => console.log('Volume adjustment done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to apply audio effects
function applyAudioEffect(input, effectType, output) {
    ffmpeg(input)
        .audioFilter(effectType)
        .output(output)
        .on('end', () => console.log('Audio effect applied'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to resize a video
function resizeVideo(input, width, height, output) {
    ffmpeg(input)
        .size(`${width}x${height}`)
        .output(output)
        .on('end', () => console.log('Resizing done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to rotate a video
function rotateVideo(input, angle, output) {
    ffmpeg(input)
        .videoFilter(`rotate=${angle}`)
        .output(output)
        .on('end', () => console.log('Rotation done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to flip a video
function flipVideo(input, direction, output) {
    const filter = direction === 'horizontal' ? 'hflip' : 'vflip';
    ffmpeg(input)
        .videoFilter(filter)
        .output(output)
        .on('end', () => console.log('Flipping done'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to add fade in/out effects
function addFade(input, fadeInDuration, fadeOutDuration, output) {
    ffmpeg.ffprobe(input, (err, metadata) => {
        if (err) {
            console.error('Error:', err);
            return;
        }

        const inputDuration = metadata.format.duration;
        const fadeOutStart = inputDuration - fadeOutDuration;
        
        ffmpeg(input)
            .videoFilter(`fade=in:0:${fadeInDuration},fade=out:${fadeOutStart}:${fadeOutDuration}`)
            .output(output)
            .on('end', () => console.log('Fade effect applied'))
            .on('error', err => console.log('Error: ' + err))
            .run();
    });
}

// Function to apply a wipe transition
function applyWipe(input1, input2, transitionDuration, output) {
    ffmpeg()
        .input(input1)
        .input(input2)
        .complexFilter([
            `[0:v] crop=w*iw/${transitionDuration}:h*ih/${transitionDuration}:x='0.5*(iw-w*main_w/${transitionDuration})*t':y='0.5*(ih-h*main_h/${transitionDuration})*t', fade=out:st=0:d=${transitionDuration}, setpts=PTS-STARTPTS [a];`,
            `[1:v] crop=w*iw/${transitionDuration}:h*ih/${transitionDuration}:x='0.5*(iw-w*main_w/${transitionDuration})*t':y='0.5*(ih-h*main_h/${transitionDuration})*t', fade=in:st=0:d=${transitionDuration}, setpts=PTS-STARTPTS [b];`,
            `[a][b] overlay [v]`
        ], ['v'])
        .output(output)
        .on('end', () => console.log('Wipe transition applied'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to apply a slide transition
function applySlide(input1, input2, slideDuration, direction, output) {
    ffmpeg()
        .input(input1)
        .input(input2)
        .complexFilter([
            `[0:v] crop=w*iw/${slideDuration}:h*ih/${slideDuration}:x='if(gte(t,0),(-w*main_w/${slideDuration})*t,0)', y='if(gte(t,0),(-h*main_h/${slideDuration})*t,0)', fade=out:st=0:d=${slideDuration}, setpts=PTS-STARTPTS [a];`,
            `[1:v] crop=w*iw/${slideDuration}:h*ih/${slideDuration}:x='if(gte(t,0),(w*main_w/${slideDuration})*t,0)', y='if(gte(t,0),(h*main_h/${slideDuration})*t,0)', fade=in:st=0:d=${slideDuration}, setpts=PTS-STARTPTS [b];`,
            `[a][b] overlay [v]`
        ], ['v'])
        .output(output)
        .on('end', () => console.log('Slide transition applied'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to apply green screen effect
function applyGreenScreen(inputVideo, inputBackground, output) {
    ffmpeg()
        .input(inputVideo)
        .input(inputBackground)
        .complexFilter('[0:v][1:v]greenbgreplace[outv]')
        .outputOptions('-map [outv]')
        .output(output)
        .on('end', () => console.log('Green screen applied'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to apply picture-in-picture effect
function pictureInPicture(mainVideo, overlayVideo, x, y, output) {
    ffmpeg()
        .input(mainVideo)
        .input(overlayVideo)
        .complexFilter(`[0:v][1:v]overlay=${x}:${y}`)
        .output(output)
        .on('end', () => console.log('Picture-in-picture applied'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to add subtitles or captions
function addSubtitles(inputVideo, subtitlesFile, output) {
    ffmpeg(inputVideo)
        .input(subtitlesFile)
        .outputOptions('-c:s mov_text')
        .output(output)
        .on('end', () => console.log('Subtitles added'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to add watermark to a video
function addWatermark(inputVideo, watermarkImage, position, output) {
    ffmpeg(inputVideo)
        .input(watermarkImage)
        .complexFilter(`overlay=${position}`)
        .output(output)
        .on('end', () => console.log('Watermark added'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

// Function to stabilize video footage
function stabilizeVideo(input, output) {
    ffmpeg(input)
        .videoFilters('deshake')
        .output(output)
        .on('end', () => console.log('Video stabilized'))
        .on('error', err => console.log('Error: ' + err))
        .run();
}

trimVideo('input/SampleVideo_640x360_20mb.mp4', '00:00:10', '10', 'output/output_trimmed.mp4');
concatenateVideos(['input/SampleVideo_640x360_20mb.mp4', 'input/SampleVideo_640x360_10mb.mp4'], 'output/output_concatenated.mp4');
applyGrayscale('input/SampleVideo_640x360_20mb.mp4', 'output/output_grayscale.mp4');
extractAudio('input/SampleVideo_640x360_20mb.mp4', 'output/output_audio.mp3');
applyBlur('input/SampleVideo_640x360_20mb.mp4', 'output/output_blur.mp4');
increaseVolume('input/SampleVideo_640x360_20mb.mp4', 'output/output_volume.mp4');
duplicateVideo('input/SampleVideo_640x360_20mb.mp4', 'output/output_copy.mp4');
changeResolution('input/SampleVideo_360x240_1mb.mp4', 1280, 720, 'output/output_resolution.mp4');
changeSpeed('input/SampleVideo_640x360_20mb.mp4', 2.0, 'output/output_speed.mp4');
cutVideo('input/SampleVideo_640x360_10mb.mp4', '00:00:10', '10', 'output/cut_video.mp4');
cropVideo('input/SampleVideo_640x360_10mb.mp4', 640, 480, 100, 100, 'output/cropped_video.mp4');
replaceAudio('input/SampleVideo_640x360_10mb.mp4', 'input/Kalimba.mp3', 'output/video_with_audio.mp4');
adjustVolume('input/SampleVideo_640x360_10mb.mp4', 'output/video_adjusted_volume.mp4', 2.0);
applyAudioEffect('input/SampleVideo_640x360_10mb.mp4', 'aecho=0.8:0.9:1000:0.3', 'output/audio_echo_effect.mp4');
resizeVideo('input/SampleVideo_640x360_10mb.mp4', 1280, 720, 'output/resized_video.mp4');
rotateVideo('input/SampleVideo_640x360_10mb.mp4', 90, 'output/rotated_video.mp4');
flipVideo('input/SampleVideo_640x360_10mb.mp4', 'vflip', 'output/flipped_video.mp4');
addFade('input/SampleVideo_640x360_10mb.mp4', 2, 2, 'output/video_with_fade.mp4');
applyWipe('input/SampleVideo_640x360_10mb.mp4', 'input/SampleVideo_640x360_20mb.mp4', 2, 'output/video_with_wipe.mp4');
applySlide('input/SampleVideo_640x360_10mb.mp4', 'input/SampleVideo_640x360_20mb.mp4', 2, 'left', 'output/video_with_slide.mp4');
applyGreenScreen('input/SampleVideo_640x360_10mb.mp4', 'input/wp10992231.jpg', 'output/greenscreen_video.mp4');
pictureInPicture('input/SampleVideo_640x360_10mb.mp4', 'input/SampleVideo_640x360_20mb.mp4', 20, 20, 'output/pip_video.mp4');
addSubtitles('input/SampleVideo_640x360_10mb.mp4', 'input/sample.srt', 'output/video_with_subtitles.mp4');
addWatermark('input/SampleVideo_640x360_10mb.mp4', 'input/R.png', '10:10', 'output/video_with_watermark.mp4');
stabilizeVideo('input/SampleVideo_640x360_10mb.mp4', 'output/stabilized_video.mp4');

