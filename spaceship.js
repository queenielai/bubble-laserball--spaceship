let canvas = document.getElementById("drawingSurface");
let brush = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 10;
let bgX = 0;
let bgY = 0;
let spriteStartX = 0;
let spriteStartY = 0;
let spriteWidth = 200;
let destinationX = 0;
let destinationY = 5;
let laserballs = [];
let grenades = [];
let gX = 0;
let gY = 0;

let dX = canvas.width;
let dY = GetRandomInteger(0, canvas.height - 100);

bigGrenadeImage = new Image();
bigGrenadeImage.src = "bigGrenade.png";

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

function ToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

let myKeys = {
  up: false,
  down: false,
  spacebar: false,
};

let bodyElem = document.getElementById("body");
bodyElem.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    myKeys.up = true;
  }
  if (event.key === "ArrowDown") {
    myKeys.down = true;
  }
  if (event.key === "Spacebar") {
    myKeys.spacebar = true;
  }
});

const onLoad = () => {
  Setup();
  startGame();
};

const Setup = () => {
  bgImage = new Image();
  bgImage.src = "spaceImg.png";

  const bgDraw = () => {
    brush.drawImage(bgImage, bgX, bgY);
  };
  bg_draw = bgDraw;
};

const Spaceship = () => {
  shipImage = new Image();
  shipImage.src = "spaceShip.png";

  brush.drawImage(
    shipImage,
    //source (birdImage) x,y,width,height
    spriteStartX,
    spriteStartY,
    spriteWidth,
    shipImage.height,
    // destination (canvas) x,y,width,height
    destinationX,
    destinationY,
    spriteWidth,
    shipImage.height
  );
  const spaceshipDraw = () => {};
  const moveDown = () => {
    let newY = spriteStartY - destinationY;
    if (newY + shipImage.height < canvas.height) {
      spriteStartY = newY;
    }
  };
  const moveUp = () => {
    let newY = spriteStartY + destinationY;
    if (newY + shipImage.height < 0) {
      spriteStartY = newY;
    }
  };
  const fire = () => {
    let b = LaserBall();
    laserballs.push(b);
  };
  spaceship_down = moveDown;
  spaceship_up = moveUp;
  spaceship_fire = fire;
};

const LaserBall = (x, y, radius, dX) => {
  brush.beginPath();
  brush.arc(x, y, radius, ToRadians(0), ToRadians(360));
  brush.closePath();
  brush.fillStyle = "salmon";
  brush.fill();

  const move = () => {
    x += dX;
  };

  laserBall_move = move;
};

const drawlaserballs = () => {
  for (let i = 0; i < laserballs.length; i++) {
    if (laserballs[i] !== undefined) {
      laserballs[i].LaserBall(spriteStartX / 2, spriteStartY / 2, 5, 10);
      laserballs[i].laserBall_move();
    }
  }
};

const Grenade = () => {
  // smallGrenadeImage = new Image();
  // smallGrenadeImage.src = "smallGrenade.png";
  let gBig = {
    x: gX,
    y: gY,
    dX: 0,
    dY: 0,
    image: bigGrenadeImage,
  };
  grenades.push(gBig);
};
const grenadeDraw = () => {
  brush.drawImage(
    bigGrenadeImage,
    gX,
    gY,
    100,
    bigGrenadeImage.height,
    dX,
    dY,
    100,
    bigGrenadeImage.height
  );
};

const startGame = () => {
  intervalObj = setInterval(drawGameScreen, 10);
};

const drawGameScreen = () => {
  brush.clearRect(0, 0, canvas.width, canvas.height);
  // animate background
  bg_draw();
  bgX--;
  if (bgX < -bgImage.width) {
    bgX = 0;
  }
  brush.drawImage(bgImage, bgX + bgImage.width, bgY);

  // draw grenades
  grenadeDraw();
  dX -= 2;

  // draw spaceship
  Spaceship();
  //move sprite images
  spriteStartX += spriteWidth;
  if (spriteStartX >= shipImage.width - 10) {
    spriteStartX = 0;
  }
  // set up key events
  if (myKeys.up) {
    spaceship_up();
  }
  if (myKeys.down) {
    spaceship_down();
  }
  if (myKeys.spacebar) {
    spaceship_fire();
  }
  myKeys.up = false;
  myKeys.down = false;
  myKeys.spacebar = false;

  // draw laser balls
  drawlaserballs();
};
