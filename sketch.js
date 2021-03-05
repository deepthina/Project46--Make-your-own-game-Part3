const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var bckImage, bck, house, houseImage;

var nemo, nemoImage;
var marlin, marlinImage;

var net, netImage;

var sharkImage, jellyImage, coralImage, octopusImage;

var sharkGroup, jellyGroup, coralGroup, octopusGroup;

var gameOver, gameOverImage;

var restart, restartImage;

var gameState = "start";

var music;

var marlinLife = 3;

function preload() {

  bckImage = loadImage("images/bck1.jpg");
  nemoImage = loadImage("images/nemo.png");
  sharkImage = loadImage("images/shark.png");
  jellyImage = loadImage("images/jelly.png");
  coralImage = loadImage("images/coral.png");
  octopusImage = loadImage("images/octopus.png");
  houseImage = loadImage('images/house.jpg');
  marlinImage = loadImage('images/marlin.png');
  netImage = loadImage("images/net.png");
  gameOverImage = loadImage("images/gameOver.jpg");
  restartImage = loadImage("images/restart.png");


  music = loadSound("sounds/bensound-funkyelement.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  bck = createSprite(width / 2, height / 2, width, height);
  bck.shapeColor = rgb(0, 83, 203);

  nemo = createSprite(550, 300);
  nemo.addImage("nemo", nemoImage);
  nemo.scale = 0.6;
  nemo.setCollider("circle", 0, 0, 10);
  nemo.visible = false;

  marlin = createSprite(400, 300);
  marlin.addImage("marlin", marlinImage);
  marlin.scale = 0.8;
  marlin.setCollider("circle", 0, 0, 10);

  net = createSprite(width - 100, 190);
  net.addImage("net", netImage);
  net.visible = false;
  net.scale = 1.3;
  net.setCollider("circle", 50, 100, 50);

  gameOver = createSprite(camera.x+300, camera.y-100);
  gameOver.addImage("gameover", gameOverImage);
  gameOver.visible = false;

  restart = createSprite(camera.x+300, camera.y+200);
  restart.addImage("restart", restartImage);
  restart.visible = false;


  house = createSprite(100, 100, 100, 100);
  house.addImage("house", houseImage);
  house.visible = false;


  sharkGroup = new Group();
  jellyGroup = new Group();
  coralGroup = new Group();
  octopusGroup = new Group();

  music.loop();
}

function draw() {
  background(0, 83, 203);

  console.log(gameState);

  drawSprites();

  textSize(30);
  fill("white");
  text("Marlin life left: "+marlinLife, width-30,10);

  Engine.update(engine);

  if (gameState === "start") {

    bck.velocityX = -10;

    if (bck.x < 0)
      bck.x = bck.width / 2;

    spawnCoral();

    nemo.visible = true;

    textSize(30);
    fill("white");
    text("Mario and his son Nemo are having a great day.", width / 2 - 100, height / 2);
    text("Press 'Y' to see what happens next.", width / 2 - 50, height / 2 + 100);
    if (keyDown("y"))
      gameState = "story";

  }

  if (gameState === "story") {

    bck.velocityX = -10;

    if (bck.x < 0)
      bck.x = bck.width / 2;

    nemo.visible = true;
    net.visible = true;

    net.velocityX = -10;

    spawnCoral();

    if (net.isTouching(nemo)) {
      
      nemo.velocityY = -10;
      net.velocityY = -10;
      net.velocityX = 0;
      bck.velocityX = 0;

      net.lifetime = 50;
      gameState = "story2";
    }

  }
  if (gameState === "story2") {

    textSize(50);
    fill("white");
    text("OH NO! HELP ME FIND MY SON NEMO PLEASE!!", 100, 500);
    textSize(30);
    text("You can hide behind the octopuses and do not touch stinky jelly fishes and scary sharks!!", 100, 600);
    text("Press 'Space' to help me.", 500, 700);

    if (keyDown("Space"))
      gameState = "level1";
  }

  if (gameState === "level1") {

    bck.velocityX = -10;

    camera.x = marlin.x;
    camera.y = marlin.y;

    if (bck.x < 0)
      bck.x = bck.width / 2;


    if (keyDown("up")) {
      marlin.y = marlin.y - 10;
    }

    else if (keyDown("down")) {
      marlin.y = marlin.y + 10;
    }

    else if (keyDown("left")) {
      marlin.x = marlin.x - 10;
    }

    else if (keyDown("right")) {
      marlin.x = marlin.x + 10;
    }

    spawnJellyFish();
    spawnSharks();
    spawnCoral();
    spawnOctopus();

    if (octopusGroup.isTouching(marlin)) {
      octopusGroup.x = bck.x;
      octopusGroup.y = bck.y;
    }

    else if (marlin.isTouching(sharkGroup) || marlin.isTouching(jellyGroup)) {
      gameState = "end";
    }

  }


  if (gameState === "level2") {
    house.x = camera.x;
    house.y = camera.y;
    house.visible = true;
  }


  if (gameState === "end") {

    console.log(marlinLife)

    gameOver.x=camera.x
    gameOver.y= camera.y-100;

    restart.x=camera.x;
    restart.y= camera.y+200;

     nemo.velocityX = 0;
    sharkGroup.setVelocityXEach(0);
    jellyGroup.setVelocityXEach(0);

    sharkGroup.destroyEach();
    jellyGroup.destroyEach();

    bck.velocityX = 0;

    gameOver.visible = true;

    if (marlinLife > 0) 
    restart.visible = true;

    music.stop();

    if (mousePressedOver(restart)) {

      if (marlinLife > 0) {
        console.log("inside if")
        marlinLife = marlinLife - 1;
        music.play();
      }
      else
      marlinLife = 0;

      gameOver.visible = false;
      restart.visible = false;

      gameState = "level1";
    }

  }
}
function spawnSharks() {
  if (frameCount % 130 === 0) {
    var shark = createSprite(width, random(camera.y));
    shark.addImage("shark", sharkImage);
    shark.velocityX = -20;
    shark.scale = 1.5;
    shark.lifetime = width / 20;
    sharkGroup.add(shark);
  }
}

function spawnJellyFish() {
  if (frameCount % 200 === 0) {
    var jelly = createSprite(width, random(camera.y));
    jelly.addImage("jelly", jellyImage);
    jelly.scale = 0.3;
    jelly.velocityX = -20;
    jelly.lifetime = width / 20;
    jellyGroup.add(jelly);
  }
}

function spawnCoral() {
  if (frameCount % 100 === 0) {
    var coral = createSprite(width, random(camera.y));
    coral.addImage("coral", coralImage);
    coral.scale = 2;
    coral.velocityX = -10;
    coral.lifetime = width / 10;
    coralGroup.add(coral);

    coral.depth = 1;
    marlin.depth = 2;

  }
}

function spawnOctopus() {
  if (frameCount % 500 === 0) {
    var octopus = createSprite(width, random(camera.y));
    octopus.addImage("octopus", octopusImage);
    octopus.velocityX = -10;
    octopus.lifetime = width / 10;
    octopusGroup.add(octopus);

    octopus.depth = 3;
    marlin.depth = 2;
  }
}
