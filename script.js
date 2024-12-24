let snowflakes = [];
let showPopup = true;
let snowflakesStopped = false;
let musicSwitched = false;
let imagesLoaded = false;
let userInput = "";
let backgroundMusic, newMusic;
let image1, image2;
let buttonX, buttonY, buttonWidth, buttonHeight;

function preload() {
  // 加载音频和图片
  backgroundMusic = loadSound('./assets/background_music.mp3', () => {
    console.log("Background music loaded");
  });
  newMusic = loadSound('./assets/new_music.mp3', () => {
    console.log("New music loaded");
  });
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
  if (!backgroundMusic.isPlaying()) {
    userStartAudio(); // 启动音频上下文
    backgroundMusic.setVolume(0.6);
    backgroundMusic.loop();
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

// 额外功能和绘制方法
function drawGradientBackground() {
  for (let y = 0; y < height; y++) {
    let gradient = map(y, 0, height, 0, 50);
    stroke(gradient);
    line(0, y, width, y);
  }
}

function drawPopup() {
  fill(40, 40, 40, 200);
  rect(width / 2 - 175, height / 2 - 102, 350, 204, 20);
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Enter your name here \n(English only)", width / 2, height / 2 - 60);
}

function drawButton() {
  fill(100, 100, 250);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("OK", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function drawInputField() {
  fill(255, 255, 255, 200);
  rect(width / 2 - 128, height / 2 - 23, 256, 45, 5);
  fill(0);
  textSize(21);
  textAlign(CENTER, CENTER);
  text(userInput, width / 2, height / 2);
}

function drawImages() {
  if (image1) {
    image(image1, 600, 400, 480, 360);
  }
  if (image2) {
    image(image2, 80, 400, 480, 360);
  }
}

function drawImagePopup() {
  fill(40, 40, 40, 180);
  rect(width / 2 - 275, height / 2 - 300, 550, 550, 20);
  let displayText = `Dear ${userInput}:\n\n\n\nMerry Christmas!\n\nMay you love and be loved.\n\n\n\nYours,\n\nNeve\n\n24 Dec 24`;
  fill(255);
  textSize(21);
  textAlign(CENTER, CENTER);
  text(displayText, width / 2, height / 2 - 70);
}

// 雪花类
class PixelSnowflake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(8, 15);
    this.opacity = 255;
  }

  update() {
    this.size += 0.4;
    this.opacity -= 11;
  }

  display() {
    for (let r = this.size; r > 0; r -= this.size / 3) {
      let edgeRatio = map(r, 0, this.size, 1, 0);
      fill(lerpColor(color(255, 255, 255, this.opacity), color(0, 0, 255, this.opacity), edgeRatio));
      this.drawHexagon(this.x, this.y, r);
    }
  }

  isFinished() {
    return this.opacity <= 0;
  }

  drawHexagon(x, y, radius) {
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      vertex(x + cos(angle) * radius, y + sin(angle) * radius);
    }
    endShape(CLOSE);
  }
}
