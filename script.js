
// Main interactive snowflake project script
let snowflakes = []; // Snowflake array
let showPopup = true; // Popup control
let snowflakesStopped = false; // Control for stopping snowflake generation
let musicSwitched = false; // Control for switching music
let backgroundMusic; // Current background music
let newMusic; // New music
let popupImage; // Popup image

function preload() {
  // Preload assets
  backgroundMusic = loadSound("assets/background_music.mp3", () => {
    console.log("Background music loaded.");
  }, (err) => {
    console.error("Error loading background music:", err);
  });

  newMusic = loadSound("assets/new_music.mp3", () => {
    console.log("New music loaded.");
  }, (err) => {
    console.error("Error loading new music:", err);
  });

  popupImage = loadImage("assets/popup_image.jpg", () => {
    console.log("Popup image loaded.");
  }, (err) => {
    console.error("Error loading popup image:", err);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Fullscreen canvas
  noStroke();
  frameRate(30);

  // Initialize snowflakes
  for (let i = 0; i < 10; i++) {
    snowflakes.push(new PixelSnowflake(random(width), random(height)));
  }

  // Start background music if loaded
  if (backgroundMusic) {
    backgroundMusic.setVolume(0.6);
    backgroundMusic.loop();
  }
}

function draw() {
  drawGradientBackground(); // Draw background gradient

  // Update and display snowflakes
  for (let i = snowflakes.length - 1; i >= 0; i--) {
    let s = snowflakes[i];
    s.update();
    s.display();
    if (s.isFinished()) {
      snowflakes.splice(i, 1); // Remove finished snowflakes
    }
  }

  // Generate new snowflakes if allowed
  if (!snowflakesStopped && frameCount % 10 === 0) {
    snowflakes.push(new PixelSnowflake(random(width), random(height / 2)));
  }

  // Show popup if active
  if (showPopup) {
    drawPopup();
  }
}

function mousePressed() {
  // On click, close popup, stop snowflakes, clear them, and switch music
  if (showPopup) {
    showPopup = false;
    snowflakesStopped = true;
    snowflakes = []; // Clear snowflakes

    if (!musicSwitched && newMusic) {
      musicSwitched = true;
      if (backgroundMusic) {
        backgroundMusic.stop();
      }
      newMusic.setVolume(0.6);
      newMusic.play(); // Play new music once
    }
  }
}

function drawGradientBackground() {
  for (let y = 0; y < height; y++) {
    let gradient = map(y, 0, height, 0, 50);
    stroke(gradient);
    line(0, y, width, y);
  }
}

function drawPopup() {
  imageMode(CENTER);
  image(popupImage, width / 2, height / 2, 300, 150);
}

class PixelSnowflake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);
    this.opacity = 255;
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
