let snowflakes = [];
let showPopup = true;
let snowflakesStopped = false;
let musicSwitched = false;
let imagesLoaded = false;
let userInput = "";
let backgroundMusic, newMusic;
let image1, image2;
let buttonX, buttonY, buttonWidth, buttonHeight;

let programStarted = false; // 标志程序是否已启动

function preload() {
  backgroundMusic = loadSound('./assets/background_music.mp3');
  newMusic = loadSound('./assets/new_music.mp3');
  image1 = loadImage('./assets/image1.png');
  image2 = loadImage('./assets/image2.png');
}

function setup() {
  createCanvas(1200, 800);
  noStroke();
  frameRate(38);

  for (let i = 0; i < 10; i++) {
    snowflakes.push(new PixelSnowflake(random(width), random(height)));
  }

  // 初始化按钮参数
  buttonWidth = 72;
  buttonHeight = 35;
  buttonX = width / 2 - buttonWidth / 2;
  buttonY = height / 2 + 46;
}

function draw() {
  if (!programStarted) {
    // 等待用户单击以启动程序
    background(0);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Click anywhere to start", width / 2, height / 2);
    return;
  }

  drawGradientBackground();

  for (let i = snowflakes.length - 1; i >= 0; i--) {
    let s = snowflakes[i];
    s.update();
    s.display();
    if (s.isFinished()) {
      snowflakes.splice(i, 1);
    }
  }

  if (!snowflakesStopped && frameCount % 7 === 0) {
    snowflakes.push(new PixelSnowflake(random(width), random(height / 2)));
  }

  if (showPopup) {
    drawPopup();
    drawButton();
    drawInputField();
  }

  if (imagesLoaded) {
    drawImages();
    drawImagePopup();
  }
}

function mousePressed() {
  if (!programStarted) {
    // 启动程序
    programStarted = true;
    userStartAudio(); // 启动音频上下文
    backgroundMusic.setVolume(0.6);
    backgroundMusic.loop();
    return;
  }

  if (
    showPopup &&
    mouseX > buttonX &&
    mouseX < buttonX + buttonWidth &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonHeight
  ) {
    showPopup = false;
    snowflakesStopped = true;
    snowflakes = [];

    if (!musicSwitched) {
      musicSwitched = true;
      backgroundMusic.stop();
      newMusic.play();
    }

    imagesLoaded = true;
  }
}

function keyPressed() {
  if (showPopup && userInput.length < 20 && keyCode !== SHIFT) {
    if (keyCode === BACKSPACE) {
      userInput = userInput.slice(0, -1);
    } else {
      userInput += key;
    }
  }
}
