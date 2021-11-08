let canvas;
let brush;
let intervalObj;
let spaceshipObj;
let invaderObj;
let bgX = 0;
let bgY = 0;
let spriteStartX = 0;
let spriteStartY = 0;
let spriteWidth = 200;
let destinationX = 0;
let destinationY = 0;
let laserballs = [];
let b;
let grenades = [];
let gX = 0;
let gY = 0;
let intervalgrenade1;
let intervalgrenade2;
let score = 0;

function ToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function GetRandomInteger(a, b) {
  // returns a random integer x such that a <= x <= b
  //
  // @params
  // a: integer
  // b: integer
  // @returns
  // a random integer x such that a <= x <= b

  // switch the large and small if out of order
  if (a > b) {
    small = b;
    large = a;
  } else {
    small = a;
    large = b;
  }

  let x = parseInt(Math.random() * (large - small + 1)) + small;
  return x;
}

let myKeys = {
  up: false,
  down: false,
  spacebar: false,
};

let bodyElem = document.getElementById("body");
bodyElem.addEventListener("keydown", function (event) {
  if (event.keyCode === 32) {
    myKeys.spacebar = true;
  }
  if (event.key === "ArrowUp") {
    myKeys.up = true;
  }
  if (event.key === "ArrowDown") {
    myKeys.down = true;
  }
});

function onLoad() {
  canvas = document.getElementById("drawingSurface");
  brush = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 100;
  bgImage = new Image();
  bgImage.src = "spaceImg.png";
  StartGame();
}

function StartGame() {
  if (intervalObj !== undefined || intervalObj !== null) {
    clearInterval(intervalObj);
    spaceshipObj = null;
    grenades = [];
    laserballs = [];
  }

  CreateSpaceship();
  CreateGrenades();
  CreateInvader();

  intervalObj = setInterval(DrawGameScreen, 10);
  intervalgrenade1 = setInterval(AddGrenade1, 5000);
  intervalgrenade2 = setInterval(AddGrenade2, 8000);
}

class Spaceship {
  constructor(x, y, dX, dY, imageFile) {
    this.image = new Image();
    this.image.src = imageFile;
    this.width = this.image.width;
    this.height = this.image.height;
    this.x = x;
    this.y = y;
    this.dX = dX;
    this.dY = dY;
  }
  MoveUp() {
    let newY = this.y - this.dY;
    if (newY >= 0) {
      this.y = newY;
    }
  }
  MoveDown() {
    let newY = this.y + this.dY;
    if (newY + this.image.height < canvas.height) {
      this.y = newY;
    }
  }
  Draw() {
    brush.drawImage(this.image, this.x, this.y);
  }
  Fire() {
    let radius = 5;
    let ranX = this.x + (this.width - 10);
    let ranY = this.y + this.height / 2;
    let dX = 10;
    let dY = 0;
    let color = "salmon";
    b = new Laserball(ranX, ranY, radius, dX, dY, color);
    laserballs.push(b);
  }
}

class Grenades {
  constructor(x, y, dX, dY, imageFile) {
    this.image = new Image();
    this.image.src = imageFile;
    this.width = this.image.width;
    this.height = this.image.height;
    this.x = x;
    this.y = y;
    this.dX = dX;
    this.dY = dY;
  }
  Move() {
    this.x -= this.dX;
  }
  Draw() {
    brush.drawImage(this.image, this.x, this.y);
  }
  Overlaps(x, y, radius) {
    let rect1Left = this.x;
    // let rect1Right = this.x + this.width;
    let rect1Top = this.y;
    let rect1Bottom = this.y + this.height;
    // let rect2Left = x;
    let cir2Right = x + radius;
    let cir2Top = y - radius;
    let cir2Bottom = y + radius;

    if (
      rect1Left > cir2Right ||
      cir2Bottom < rect1Top ||
      cir2Top > rect1Bottom
    ) {
      return false;
    } else {
      return true;
    }
  }
}

class Laserball {
  constructor(x, y, radius, dX, dY, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dX = dX;
    this.dY = dY;
    this.color = color;
  }
  Move() {
    this.x = this.x + this.dX;
  }
  Draw() {
    brush.beginPath();
    brush.arc(this.x, this.y, this.radius, ToRadians(0), ToRadians(360));
    brush.closePath();
    brush.fillStyle = this.color;
    brush.fill();
  }
}

const DrawGameScreen = () => {
  brush.clearRect(0, 0, canvas.width, canvas.height);
  // animate background image
  brush.drawImage(bgImage, bgX, bgY);
  bgX--;
  if (bgX < -bgImage.width) {
    bgX = 0;
  }
  brush.drawImage(bgImage, bgX + bgImage.width, bgY);

  // draw spaceship
  spaceshipObj.Draw();
  if (myKeys.up) {
    spaceshipObj.MoveUp();
  }
  if (myKeys.down) {
    spaceshipObj.MoveDown();
  }
  if (myKeys.spacebar) {
    spaceshipObj.Fire();
  }
  myKeys.up = false;
  myKeys.down = false;
  myKeys.spacebar = false;
  // draw all laserballs
  DrawAllLaserballs();
  // remove laserballs that have gone out of view
  RemoveLaserballs();

  // draw aliens
  for (let i = grenades.length - 1; i >= 0; i--) {
    grenades[i].Draw();
    grenades[i].Move();
    let position = grenades[i].x;
    let isOverlap = OverlapLaserballs(grenades[i]);
    if (laserballs[i] !== undefined) {
      if (isOverlap === true) {
        score++;
        OutputCounter();
        isOverlap = false;
        grenades.splice(i, 1);
      }
    }

    if (position < -100) {
      EndGame();
      OutputEndGame();
    }
  }
};

const OverlapLaserballs = (characterObj) => {
  for (let i = 0; i < laserballs.length; i++) {
    if (
      characterObj.Overlaps(
        laserballs[i].x,
        laserballs[i].y,
        laserballs[i].radius
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
};

const DrawAllLaserballs = () => {
  for (let i = 0; i < laserballs.length; i++) {
    if (laserballs[i] !== undefined) {
      laserballs[i].Draw();
      laserballs[i].Move();
    }
  }
};

const EndGame = () => {
  if (intervalObj !== undefined) {
    clearInterval(intervalObj);
  }
  brush.clearRect(0, 0, canvas.width, canvas.height);
  spaceshipObj = null;
  grenades = [];
};

const RemoveLaserballs = () => {
  for (let i = laserballs.length - 1; i >= 0; i--) {
    if (laserballs[i] !== undefined) {
      if (
        laserballs[i].x < 0 ||
        laserballs[i].x >= canvas.width ||
        laserballs[i].y < 0 ||
        laserballs[i].y >= canvas.height
      ) {
        laserballs.splice(i, 1);
      }
    }
  }
};

const CreateSpaceship = () => {
  spaceshipObj = new Spaceship(10, 10, 10, 10, "spaceShip.png");
};

const CreateInvader = () => {
  invaderObj = new Spaceship(
    canvas.width / 2.25,
    canvas.height / 2.5,
    0,
    0,
    "invader.png"
  );
};

const CreateGrenade = (x, y, dX, dY, imageFile) => {
  let grenadeObj = new Grenades(x, y, dX, dY, imageFile);
  grenades.push(grenadeObj);
};

const CreateGrenades = () => {
  CreateGrenade(
    canvas.width + 200,
    GetRandomInteger(50, canvas.height - 100),
    1,
    1,
    "smallAlien.png"
  );
  CreateGrenade(
    canvas.width + 700,
    GetRandomInteger(50, canvas.height - 250),
    1,
    1,
    "smallBoss.png"
  );
};

const AddGrenade1 = () => {
  CreateGrenade(
    canvas.width + 100,
    GetRandomInteger(50, canvas.height - 100),
    2,
    2,
    "smallAlien.png"
  );
  CreateGrenade(
    canvas.width + 300,
    GetRandomInteger(50, canvas.height - 250),
    2,
    2,
    "smallBoss.png"
  );
};

const AddGrenade2 = () => {
  CreateGrenade(
    canvas.width,
    GetRandomInteger(50, canvas.height - 100),
    3,
    3,
    "smallAlien.png"
  );
  CreateGrenade(
    canvas.width,
    GetRandomInteger(50, canvas.height - 250),
    3,
    3,
    "smallBoss.png"
  );
};

const OutputCounter = () => {
  let counterID = document.getElementById("counter");
  counterID.innerHTML = `Score: ${score}`;
};

const OutputEndGame = () => {
  invaderObj.Draw();
  brush.font = "60px monospace";
  brush.fillStyle = "white";
  brush.fillText("INVADER CONQUERED", canvas.width / 2.8, canvas.height / 4.5);
};
