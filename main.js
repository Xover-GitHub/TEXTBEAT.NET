"use strict";

const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('playBtn');

audioPlayer.volume = 0.5;

const choosePrev = document.getElementById('choosePrev');
const chooseNext = document.getElementById('chooseNext');

const bumpTitle = document.getElementById('title');
const cursong = document.getElementById('cursong');

const text_input = document.getElementById('text-input');

const songs = ["Resources/pybeat-0.mp3", "Resources/pybeat-1.mp3", "Resources/pybeat-2.mp3"];

let cur = 0;

audioPlayer.src = songs[cur];

playBtn.addEventListener('click', () => {
    audioPlayer.volume = 0.5;
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.textContent = 'Pause';
        animateText();
    } else {
        audioPlayer.pause();
        playBtn.textContent = 'Play';
    }
});

choosePrev.addEventListener('click', () => {
    if (cur == 0) {
        console.log("Nope")
    } else {
        cur -= 1;
    audioPlayer.src = songs[cur];
    }

    if (cur == 0) {
        cursong.textContent = "Current Song: Ber Zer Ker - 1";
    } else if (cur == 1) {
        cursong.textContent = "Current Song: BUSSIN - 2";
    } else if (cur == 2) {
        cursong.textContent = "Current Song: Supersonic - 3";
    }
})

chooseNext.addEventListener('click', () => {
    if (cur == 2) {
        console.log("Nope")
    } else {
        cur += 1;
    audioPlayer.src = songs[cur];
    }

    if (cur == 0) {
        cursong.textContent = "Current Song: Ber Zer Ker - 1";
    } else if (cur == 1) {
        cursong.textContent = "Current Song: BUSSIN - 2";
    } else if (cur == 2) {
        cursong.textContent = "Current Song: Supersonic - 3";
    }
})

function animateText() {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = context.createAnalyser();
    
    const source = context.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(context.destination);
    
    analyser.fftSize = 256; // Size of the FFT (Fast Fourier Transform)
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function bump() {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength; // Average amplitude
        
        // Bump effect based on average amplitude
        const scaleValue = 1 + (average / 256) *0.5; // Scale based on average amplitude
        bumpTitle.style.transform = `scale(${scaleValue})`;
        cursong.style.transform = `scale(${scaleValue})`;

        text_input.style.fontSize = `${scaleValue * 2}em`;

        const colorValue = Math.floor((average / 256) *2 * 255); // Map amplitude to color value
        bumpTitle.style.color = `rgb(${colorValue}, ${50}, ${255 - colorValue})`;
        bumpTitle.style.borderColor = `rgb(${colorValue}, ${50}, ${255 - colorValue})`;

        cursong.style.color = `rgb(${colorValue}, ${50}, ${255 - colorValue})`; // Example RGB mapping
        cursong.style.borderColor = `rgb(${colorValue}, ${50}, ${255 - colorValue})`; // Example RGB mapping

        text_input.style.color = `rgb(${colorValue}, ${50}, ${255 - colorValue})`; // Example RGB mapping
        text_input.style.borderColor = `rgb(${colorValue}, ${50}, ${255 - colorValue})`; // Example RGB mapping
        
        requestAnimationFrame(bump); // Continue the animation loop
    }
    
    bump(); // Start the bumping animation
}

document.getElementById('downloadBtn').addEventListener('click', function() {
    // Get the content from the textarea
    const textContent = document.getElementById('text-input').value;
    
    // Get the filename from the input field
    const filename = "Downloaded.txt";
    
    // Create a Blob from the text content
    const blob = new Blob([textContent], { type: 'text/plain' });
    
    // Create a link element
    const link = document.createElement('a');
    
    // Create an object URL for the Blob
    link.href = URL.createObjectURL(blob);
    
    // Set the download attribute with the filename
    link.download = filename;
    
    // Append link to body (required for Firefox)
    document.body.appendChild(link);
    
    // Programmatically click the link to trigger download
    link.click();
    
    // Clean up and remove the link
    document.body.removeChild(link);

    console.log("Downloaded")
});

document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('text-input').value = '';
})