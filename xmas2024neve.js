import ddf.minim.*; // 导入 Minim 库 

ArrayList<PixelSnowflake> snowflakes = new ArrayList<PixelSnowflake>();
boolean showPopup = true; // 控制弹窗显示的标志
boolean snowflakesStopped = false; // 标志是否停止雪花的生成
boolean musicSwitched = false; // 标志是否已经切换过背景音乐
boolean imagesLoaded = false; // 标志是否已加载图片
String userInput = ""; // 用户输入的文本
Minim minim; // Minim 音频对象
AudioPlayer backgroundMusic; // 当前播放的背景音乐
float buttonX, buttonY, buttonWidth, buttonHeight; // 按钮位置和尺寸

// 图片对象
PImage image1, image2;

void setup() {
  size(1200, 800);
  noStroke(); // 去掉描边
  frameRate(38); // 控制动画速度

  // 初始化雪花
  for (int i = 0; i < 10; i++) { // 增加初始雪花数量
    snowflakes.add(new PixelSnowflake(random(width), random(height)));
  }

  // 初始化 Minim 并加载背景音乐
  minim = new Minim(this);
  backgroundMusic = minim.loadFile("background_music.mp3"); // 替换为你的第一首音乐文件名
  backgroundMusic.setGain(-10); // 将旧背景音乐音量降低至 60%
  backgroundMusic.loop(); // 循环播放音乐

  // 初始化按钮位置和尺寸
  buttonWidth = 72;
  buttonHeight = 35;
  buttonX = width / 2 - buttonWidth / 2;
  buttonY = height / 2 + 46; // 在弹窗下方
}

void draw() {
  drawGradientBackground(); // 绘制渐变背景

  // 更新和绘制雪花
  for (int i = snowflakes.size() - 1; i >= 0; i--) {
    PixelSnowflake s = snowflakes.get(i);
    s.update();
    s.display();
    if (s.isFinished()) {
      snowflakes.remove(i); // 移除已经消失的雪花
    }
  }

  // 控制雪花生成，仅在未停止雪花时继续生成
  if (!snowflakesStopped && frameCount % 7 == 0) { // 增加生成频率
    snowflakes.add(new PixelSnowflake(random(width), random(height / 2))); // 雪花从上半部分生成
  }

  // 如果弹窗标志为真，则显示弹窗和按钮
  if (showPopup) {
    drawPopup();
    drawButton(); // 绘制按钮
    drawInputField(); // 绘制输入框
  }

  // 显示加载的图片
  if (imagesLoaded) {
    drawImages();
  }
  
  if (imagesLoaded) {
    drawImages();
    drawImagePopup(); // 调用绘制圆角矩形弹窗的方法
  }
}

void mousePressed() {
  // 检测是否点击了按钮
  if (showPopup && mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    showPopup = false; // 关闭弹窗
    snowflakesStopped = true; // 停止生成雪花
    snowflakes.clear(); // 清空所有雪花

    // 只允许切换一次背景音乐
    if (!musicSwitched) {
      musicSwitched = true; // 标记为已切换
      backgroundMusic.close(); // 关闭旧音乐
      AudioPlayer newMusic = minim.loadFile("new_music.mp3"); // 替换为你的第二首音乐文件名
      newMusic.play(); // 播放新音乐一次（非循环）
    }

    // 加载图片
    image1 = loadImage("image1.png"); // 替换为你的第一张图片文件名
    image2 = loadImage("image2.png"); // 替换为你的第二张图片文件名
    imagesLoaded = true; // 标记为已加载图片
  }
}

// 绘制图片
void drawImages() {
  if (image1 != null) {
    image(image1, 600, 400, 480, 360); // 调整第一张图片位置和大小
  }
  if (image2 != null) {
    image(image2, 80, 400, 480, 360); // 调整第二张图片位置和大小
  }
}

void keyPressed() {
  // 允许用户输入字符到输入框
  if (showPopup && userInput.length() < 20 && key != CODED) {
    if (key == BACKSPACE && userInput.length() > 0) {
      userInput = userInput.substring(0, userInput.length() - 1); // 删除字符
    } else if (key != BACKSPACE && key != ENTER) {
      userInput += key; // 添加字符
    }
  }
}

// 绘制渐变背景
void drawGradientBackground() {
  for (int y = 0; y < height; y++) {
    float gradient = map(y, 0, height, 0, 50); // 黑色到深灰渐变
    stroke(gradient);
    line(0, y, width, y);
  }
}

// 绘制弹窗
void drawPopup() {
  // 弹窗背景
  fill(40, 40, 40, 200); // 半透明深灰色
  rect(width / 2 - 175, height / 2 - 102, 350, 204, 20); // 中心弹窗

  // 弹窗内容
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Enter your name here \n(English only)", width / 2, height / 2 - 60); // 提示文字
}

// 绘制按钮
void drawButton() {
  // 按钮背景
  fill(100, 100, 250); // 蓝色背景
  rect(buttonX, buttonY, buttonWidth , buttonHeight, 10); // 圆角矩形按钮

  // 按钮文字
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("OK", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2); // 按钮文字
}

// 绘制输入框
void drawInputField() {
  // 输入框背景
  fill(255, 255, 255, 200); // 半透明白色背景
  rect(width / 2 - 128, height / 2 - 23, 256, 45, 5); // 白色背景，圆角矩形

  // 输入框文字
  fill(0); // 黑色文字
  textSize(21);
  textAlign(CENTER, CENTER); // 改为水平和垂直居中对齐
  text(userInput, width / 2, height / 2); // 文字居中显示
}

// 绘制图片弹窗
void drawImagePopup() {
  // 圆角矩形背景
  fill(40, 40, 40, 180); // 深灰色背景，180 的透明度
  rect(width / 2 - 275, height / 2 - 300, 550, 550, 20); // 圆角矩形，宽300，高100，圆角20

  // 拼接用户输入的文字
  String displayText = "Dear " + userInput + ":\n\n\n\n"
                     + "Merry Christmas!\n\n"
                     + "May you love and be loved.\n\n\n\n"
                     + "Yours,\n\n"
                     + "Neve\n\n"
                     + "24 Dec 24";

  // 弹窗文字
  fill(255); // 白色文字
  textSize(21); // 字体大小
  textAlign(CENTER, CENTER); // 水平和垂直居中
  text(displayText, width / 2, height / 2 - 70); // 文本位置
}

// 定义雪花类
class PixelSnowflake {
  float x, y, size, opacity;

  PixelSnowflake(float x, float y) {
    this.x = x;
    this.y = y;
    this.size = random(8, 15); // 增大初始雪花大小
    this.opacity = 255; // 雪花初始透明度
  }

  void update() {
    size += 0.4; // 增大雪花增长速度
    opacity -= 11; // 雪花逐渐透明
  }

  void display() {
    for (float r = size; r > 0; r -= size / 3) {
      float edgeRatio = map(r, 0, size, 1, 0);
      fill(lerpColor(color(255, 255, 255, opacity), color(0, 0, 255, opacity), edgeRatio));
      drawHexagon(x, y, r);
    }
  }

  boolean isFinished() {
    return opacity <= 0; // 当透明度为 0 时，雪花消失
  }

  void drawHexagon(float x, float y, float radius) {
    beginShape();
    for (int i = 0; i < 6; i++) {
      float angle = TWO_PI / 6 * i;
      vertex(x + cos(angle) * radius, y + sin(angle) * radius);
    }
    endShape(CLOSE);
  }
}
