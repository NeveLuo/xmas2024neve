let userInput = ""; // 用户输入的文字
let inputEnabled = false; // 输入启用标志
let audioStarted = false; // 音频启动标志

// 初始化雪花和按钮状态
function setup() {
  createCanvas(1200, 800);
  noStroke();
  frameRate(38);
  
  // 添加启动按钮
  let startButton = createButton("Click to Start");
  startButton.position(width / 2 - 50, height / 2);
  startButton.mousePressed(() => {
    // 启用音频上下文
    getAudioContext().resume();
    audioStarted = true;
    startButton.remove(); // 移除按钮
    inputEnabled = true; // 启用键盘输入
  });
}

// 监听键盘输入
function keyPressed() {
  if (inputEnabled) {
    if (keyCode === BACKSPACE) {
      userInput = userInput.slice(0, -1); // 删除最后一个字符
    } else if (key.length === 1) {
      userInput += key; // 添加字符
    }
  }
}

// 绘制用户输入的文字
function draw() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  if (!audioStarted) {
    text("Please click 'Start' to enable input and sound.", width / 2, height / 2 - 100);
  } else {
    text(`User Input: ${userInput}`, width / 2, height / 2);
  }
}
