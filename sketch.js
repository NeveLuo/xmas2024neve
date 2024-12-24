
// Simulating the Processing sketch into JavaScript (p5.js syntax)
// Importing Minim and setting up variables
let snowflakes = [];
let showPopup = true;
let snowflakesStopped = false;
let musicSwitched = false;
let imagesLoaded = false;
let userInput = "";
let buttonX, buttonY, buttonWidth, buttonHeight;
let backgroundMusic;
let image1, image2;

// Preloading assets
function preload() {
    soundFormats('mp3');
    backgroundMusic = loadSound('background_music.mp3');
    newMusic = loadSound('new_music.mp3');
    image1 = loadImage('image1.png');
    image2 = loadImage('image2.png');
}

// Setup function
function setup() {
    createCanvas(1200, 800);
    noStroke();
    frameRate(38);

    // Initialize snowflakes
    for (let i = 0; i < 10; i++) {
        snowflakes.push(new Snowflake(random(width), random(height)));
    }

    // Setup button dimensions
    buttonWidth = 72;
    buttonHeight = 35;
    buttonX = width / 2 - buttonWidth / 2;
    buttonY = height / 2 + 46;

    backgroundMusic.setVolume(0.4);
    backgroundMusic.loop();
}

// Main draw function
function draw() {
    drawGradientBackground();
    drawSnowflakes();

    if (showPopup) {
        drawPopup();
        drawButton();
        drawInputField();
    }

    if (imagesLoaded) {
        drawWaves();
        drawImages();
        drawImagePopup();
    }
}

// Additional helper functions
// Mouse pressed actions, snowflakes drawing, and other additional helpers would continue here...
