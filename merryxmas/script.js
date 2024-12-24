let snowflakes = []; // 雪花数组
let showPopup = true; // 控制弹窗显示的标志
let snowflakesStopped = false; // 标志是否停止雪花的生成
let musicSwitched = false; // 标志是否已经切换过背景音乐
let backgroundMusic; // 当前播放的背景音乐
let newMusic; // 新音乐
let popupImage; // 弹窗图片

function preload() {
  // 加载音乐文件
  soundFormats("mp3");
  backgroundMusic = loadSound("./assets/background_music.mp3");
  newMusic = loadSound("./assets/new_music.mp3");

  // 加载弹窗图片
  popupImage = loadImage("./assets/popup_image.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 创建全屏画布
  noStroke();
  frameRate(30); // 控制动画速度

  // 初始化雪花
  for (let i = 0; i < 10; i++) {
    snowflakes.push(new PixelSnowflake(random(width), random(height)));
  }

  // 设置背景音乐
  backgroundMusic.setVolume(0.6); // 调低至 60%
  backgroundMusic.loop();
}

function draw() {
  drawGradientBackground(); // 绘制渐变背景

  // 更新和绘制雪花
  for (let i = snowflakes.length - 1; i >= 0; i--) {
    let s = snowflakes[i];
    s.update();
    s.display();
    if (s.isFinished()) {
      snowflakes.splice(i, 1); // 移除已经消失的雪花
    }
  }

  // 控制雪花生成，仅在未停止雪花时继续生成
  if (!snowflakesStopped && frameCount % 10 === 0) {
    snowflakes.push(new PixelSnowflake(random(width), random(height / 2)));
  }

  // 如果弹窗标志为真，则显示弹窗图片
  if (showPopup) {
    drawPopup();
  }
}

function mousePressed() {
  // 一次点击同时关闭弹窗、停止雪花生成、清空雪花、切换背景音乐
  if (showPopup) {
    showPopup = false; // 关闭弹窗
    snowflakesStopped = true; // 停止生成雪花
    snowflakes = []; // 清空所有雪花

    // 只允许切换一次背景音乐
    if (!musicSwitched) {
      musicSwitched = true; // 标记为已切换
      backgroundMusic.stop(); // 停止旧音乐
      newMusic.play(); // 播放新音乐一次（非循环）
    }
  }
}

function drawGradientBackground() {
  for (let y = 0; y < height; y++) {
    let gradient = map(y, 0, height, 0, 50); // 黑色到深灰渐变
    stroke(gradient);
    line(0, y, width, y);
  }
}

function drawPopup() {
  imageMode(CENTER); // 设置图片绘制模式为中心对齐
  image(popupImage, width / 2, height / 2, 300, 150); // 在屏幕中心绘制图片
}

class PixelSnowflake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10); // 雪花大小
    this.opacity = 255; // 初始透明度
  }

  update() {
    this.size += 0.2;
    this.opacity -= 15;
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
